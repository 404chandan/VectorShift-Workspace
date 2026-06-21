import json
from fastapi import FastAPI, Form, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

import database

app = FastAPI()

# Add CORS Middleware to allow communication with the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Dependency
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    
    token = authorization.split(" ")[1]
    user = database.verify_session(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return user

# Pydantic Schemas
class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class WorkspaceCreateRequest(BaseModel):
    name: str

class WorkspaceUpdateRequest(BaseModel):
    name: Optional[str] = None
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    nodeIDs: Dict[str, int]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

# Core DAG parsing endpoint
def check_is_dag(nodes, edges):
    # Kahn's algorithm for detecting cycles in a directed graph
    node_ids = {node['id'] for node in nodes}
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source:
            node_ids.add(source)
        if target:
            node_ids.add(target)
            
    # Setup adjacency list and in-degree maps
    adj = {node_id: [] for node_id in node_ids}
    in_degree = {node_id: 0 for node_id in node_ids}
    
    for edge in edges:
        u = edge.get('source')
        v = edge.get('target')
        if u and v:
            adj[u].append(v)
            in_degree[v] += 1
            
    # Process nodes with in-degree 0
    queue = [node_id for node_id in node_ids if in_degree[node_id] == 0]
    visited_count = 0
    
    while queue:
        curr = queue.pop(0)
        visited_count += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    # If all nodes are visited, there are no cycles
    return visited_count == len(node_ids)

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        data = json.loads(pipeline)
    except json.JSONDecodeError:
        return {'num_nodes': 0, 'num_edges': 0, 'is_dag': False, 'error': 'Invalid JSON'}
        
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    is_dag = check_is_dag(nodes, edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }

# ================= AUTH ENDPOINTS =================

@app.post('/api/auth/register')
def register(req: RegisterRequest):
    user = database.create_user(req.email, req.password, req.name)
    if not user:
        raise HTTPException(status_code=400, detail="A user with this email already exists")
    
    token = database.create_session(user["id"])
    return {"token": token, "user": user}

@app.post('/api/auth/login')
def login(req: LoginRequest):
    user = database.authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    token = database.create_session(user["id"])
    return {"token": token, "user": user}

@app.post('/api/auth/logout')
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        database.delete_session(token)
    return {"detail": "Logged out successfully"}

@app.get('/api/auth/me')
def me(user = Depends(get_current_user)):
    return user

# ================= WORKSPACE ENDPOINTS =================

@app.get('/api/workspaces')
def get_workspaces(user = Depends(get_current_user)):
    return database.get_user_workspaces(user["id"])

@app.post('/api/workspaces')
def create_workspace(req: WorkspaceCreateRequest, user = Depends(get_current_user)):
    ws = database.create_workspace(user["id"], req.name)
    return ws

@app.get('/api/workspaces/{workspace_id}')
def get_workspace(workspace_id: str, user = Depends(get_current_user)):
    ws = database.get_workspace(workspace_id, user["id"])
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws

@app.put('/api/workspaces/{workspace_id}')
def update_workspace(workspace_id: str, req: WorkspaceUpdateRequest, user = Depends(get_current_user)):
    success = database.update_workspace(
        workspace_id, 
        user["id"], 
        req.name, 
        req.nodes, 
        req.edges, 
        req.nodeIDs
    )
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found or no changes made")
    return {"success": True}

@app.delete('/api/workspaces/{workspace_id}')
def delete_workspace(workspace_id: str, user = Depends(get_current_user)):
    success = database.delete_workspace(workspace_id, user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"success": True}

import json
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS Middleware to allow communication with the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

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


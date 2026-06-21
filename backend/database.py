import os
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta
# pyrefly: ignore [missing-import]
from pymongo import MongoClient
# pyrefly: ignore [missing-import]
from bson.objectid import ObjectId
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/vectorshift")

# Initialize MongoDB Client
client = MongoClient(MONGO_URI)
# Use 'vectorshift' as default database name if none is defined in the connection URI
db = client.get_database("vectorshift")

# Collections
users_col = db["users"]
sessions_col = db["sessions"]
workspaces_col = db["workspaces"]

# Ensure indexes
users_col.create_index("email", unique=True)
sessions_col.create_index("token", unique=True)
workspaces_col.create_index("owner_id")

# Password Hashing Helpers
def hash_password(password: str) -> str:
    """Hash password using PBKDF2 with SHA-256."""
    salt = secrets.token_hex(16)
    iterations = 100000
    pwd_bytes = password.encode("utf-8")
    salt_bytes = salt.encode("utf-8")
    
    hash_bytes = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, iterations)
    hash_hex = hash_bytes.hex()
    
    return f"{salt}:{iterations}:{hash_hex}"

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against pbkdf2 hash."""
    try:
        salt, iterations, hash_hex = hashed_password.split(":")
        iterations = int(iterations)
        
        pwd_bytes = password.encode("utf-8")
        salt_bytes = salt.encode("utf-8")
        
        test_hash = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, iterations)
        return test_hash.hex() == hash_hex
    except Exception:
        return False

# Authentication Helpers
def create_user(email: str, password: str, name: str):
    """Create a new user in the database."""
    email_clean = email.strip().lower()
    if users_col.find_one({"email": email_clean}):
        return None
    
    pwd_hash = hash_password(password)
    user = {
        "email": email_clean,
        "password": pwd_hash,
        "name": name.strip(),
        "created_at": datetime.utcnow()
    }
    result = users_col.insert_one(user)
    user["_id"] = str(result.inserted_id)
    # Remove password from return object
    user.pop("password", None)
    return user

def authenticate_user(email: str, password: str):
    """Authenticate user with email and password."""
    email_clean = email.strip().lower()
    user = users_col.find_one({"email": email_clean})
    if not user:
        return None
    
    if verify_password(password, user["password"]):
        user_info = {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"]
        }
        return user_info
    return None

def create_session(user_id: str):
    """Create a session token for a user."""
    token = secrets.token_urlsafe(32)
    # Session expires in 7 days
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    session = {
        "token": token,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "expires_at": expires_at
    }
    sessions_col.insert_one(session)
    return token

def verify_session(token: str):
    """Verify session token and retrieve user information."""
    session = sessions_col.find_one({"token": token})
    if not session:
        return None
    
    if session["expires_at"] < datetime.utcnow():
        sessions_col.delete_one({"token": token})
        return None
        
    user = users_col.find_one({"_id": ObjectId(session["user_id"])})
    if not user:
        return None
        
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"]
    }

def delete_session(token: str):
    """Delete a session token (logout)."""
    sessions_col.delete_one({"token": token})

# Workspace Helpers
def get_user_workspaces(user_id: str):
    """Get all workspaces owned by the user, formatted for listing."""
    workspaces = list(workspaces_col.find({"owner_id": user_id}).sort("updated_at", -1))
    formatted = []
    for ws in workspaces:
        formatted.append({
            "id": ws["_id"],
            "name": ws["name"],
            "node_count": len(ws.get("nodes", [])),
            "edge_count": len(ws.get("edges", [])),
            "updated_at": ws["updated_at"].isoformat() if isinstance(ws.get("updated_at"), datetime) else ws.get("updated_at")
        })
    return formatted

def create_workspace(user_id: str, name: str):
    """Create a new workspace."""
    ws_id = str(uuid.uuid4())
    now = datetime.utcnow()
    workspace = {
        "_id": ws_id,
        "owner_id": user_id,
        "name": name.strip() or "Untitled Workspace",
        "nodes": [],
        "edges": [],
        "nodeIDs": {},
        "created_at": now,
        "updated_at": now
    }
    workspaces_col.insert_one(workspace)
    return {
        "id": ws_id,
        "name": workspace["name"],
        "nodes": [],
        "edges": [],
        "nodeIDs": {},
        "updated_at": now.isoformat()
    }

def get_workspace(workspace_id: str, user_id: str):
    """Get details of a workspace if it belongs to the user."""
    workspace = workspaces_col.find_one({"_id": workspace_id, "owner_id": user_id})
    if not workspace:
        return None
        
    return {
        "id": workspace["_id"],
        "name": workspace["name"],
        "nodes": workspace.get("nodes", []),
        "edges": workspace.get("edges", []),
        "nodeIDs": workspace.get("nodeIDs", {}),
        "updated_at": workspace["updated_at"].isoformat() if isinstance(workspace.get("updated_at"), datetime) else workspace.get("updated_at")
    }

def update_workspace(workspace_id: str, user_id: str, name: str, nodes: list, edges: list, nodeIDs: dict):
    """Update workspace details and return success status."""
    now = datetime.utcnow()
    update_data = {
        "nodes": nodes,
        "edges": edges,
        "nodeIDs": nodeIDs,
        "updated_at": now
    }
    if name:
        update_data["name"] = name.strip()
        
    result = workspaces_col.update_one(
        {"_id": workspace_id, "owner_id": user_id},
        {"$set": update_data}
    )
    return result.modified_count > 0 or result.matched_count > 0

def delete_workspace(workspace_id: str, user_id: str):
    """Delete a workspace from the database."""
    result = workspaces_col.delete_one({"_id": workspace_id, "owner_id": user_id})
    return result.deleted_count > 0

import React, { useEffect, useState } from 'react';
import { useStore } from '../store';

export const Dashboard = () => {
  const user = useStore((state) => state.user);
  const token = useStore((state) => state.token);
  const logout = useStore((state) => state.logout);
  const workspaces = useStore((state) => state.workspaces);
  const setWorkspaces = useStore((state) => state.setWorkspaces);
  const loadWorkspace = useStore((state) => state.loadWorkspace);
  const resetWorkspace = useStore((state) => state.resetWorkspace);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Creation modal/inline state
  const [createOpen, setCreateOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creating, setCreating] = useState(false);

  // Deletion state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/workspaces`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error('Failed to retrieve workspaces');
      }

      const data = await response.json();
      setWorkspaces(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkspaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch(`${backendUrl}/api/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newWorkspaceName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not create workspace');
      }

      setCreateOpen(false);
      setNewWorkspaceName('');
      
      // Load workspace directly in editor
      loadWorkspace(data);
    } catch (err) {
      console.error(err);
      alert('Error creating workspace: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenWorkspace = async (workspaceId) => {
    try {
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Could not load workspace');
      }

      loadWorkspace(data);
    } catch (err) {
      console.error(err);
      alert('Error opening workspace: ' + err.message);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      const response = await fetch(`${backendUrl}/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Could not delete workspace');
      }

      setDeleteConfirmId(null);
      fetchWorkspaces(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Error deleting workspace: ' + err.message);
    }
  };

  const handleCreateNewClick = () => {
    resetWorkspace();
    setCreateOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-icon">V</div>
          <span className="header-title">VectorShift Workspace</span>
          <span className="header-subtitle">Developer Dashboard</span>
        </div>
        <div className="header-right-user">
          <div className="user-profile">
            <span className="user-avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </header>

      {/* Main Dashboard Panel */}
      <main className="dashboard-main">
        <div className="dashboard-title-row">
          <div>
            <h1>Welcome back, {user?.name || 'Developer'}</h1>
            <p className="dashboard-desc">Select an active canvas workspace or construct a new flow pipeline.</p>
          </div>
          <button className="btn-create-workspace" onClick={handleCreateNewClick}>
            + Create Workspace
          </button>
        </div>

        {error && (
          <div className="dashboard-error-alert">
            <span>Error: {error}</span>
            <button className="btn-retry" onClick={fetchWorkspaces}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner"></div>
            <p>Loading your saved workspaces...</p>
          </div>
        ) : (
          <div className="workspace-grid">
            {/* Create Card Button */}
            <div className="workspace-card create-card" onClick={handleCreateNewClick}>
              <div className="create-card-content">
                <span className="create-plus-icon">+</span>
                <span className="create-label">New Canvas Workspace</span>
              </div>
            </div>

            {/* List saved workspaces */}
            {workspaces.map((ws) => (
              <div key={ws.id} className="workspace-card project-card">
                <div className="project-card-header">
                  <div className="project-icon-wrapper"></div>
                  <h3 className="project-name" title={ws.name}>{ws.name}</h3>
                </div>
                
                <div className="project-card-stats">
                  <div className="project-stat">
                    <span className="stat-label">Nodes</span>
                    <span className="stat-value">{ws.node_count}</span>
                  </div>
                  <div className="project-stat">
                    <span className="stat-label">Edges</span>
                    <span className="stat-value">{ws.edge_count}</span>
                  </div>
                </div>

                <div className="project-card-meta">
                  <span className="saved-at">Saved: {formatDate(ws.updated_at)}</span>
                </div>

                <div className="project-card-actions">
                  <button className="btn-open-workspace" onClick={() => handleOpenWorkspace(ws.id)}>
                    Open Flow
                  </button>
                  <button className="btn-delete-workspace" onClick={() => setDeleteConfirmId(ws.id)} title="Delete Workspace">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && workspaces.length === 0 && (
          <div className="empty-workspaces">
            <div className="empty-illustration"></div>
            <h3>No Workspaces Yet</h3>
            <p>Construct your first multi-node graph structure to get started.</p>
            <button className="btn-create-workspace-small" onClick={handleCreateNewClick}>
              Create Workspace
            </button>
          </div>
        )}
      </main>

      {/* Creation Modal */}
      {createOpen && (
        <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateWorkspace}>
              <div className="modal-header">
                <h3 className="modal-title">Create Workspace</h3>
                <button type="button" className="modal-close-btn" onClick={() => setCreateOpen(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group full-width" style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                  <label htmlFor="workspace-name">Workspace Name</label>
                  <input
                    id="workspace-name"
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="E.g., Customer Support Agent Flow"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{gap: '12px'}}>
                <button type="button" className="btn-modal-cancel" onClick={() => setCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-confirm" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title text-danger">Delete Workspace</h3>
              <button type="button" className="modal-close-btn" onClick={() => setDeleteConfirmId(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to permanently delete this workspace? This operation cannot be undone.</p>
            </div>
            <div className="modal-footer" style={{gap: '12px'}}>
              <button type="button" className="btn-modal-cancel" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button type="button" className="btn-modal-confirm-danger" onClick={() => handleDeleteWorkspace(deleteConfirmId)}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

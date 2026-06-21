import React, { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { AnimatedBackground } from './AnimatedBackground';
import { useStore } from './store';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const currentView = useStore((state) => state.currentView);
  const setCurrentView = useStore((state) => state.setCurrentView);
  const token = useStore((state) => state.token);
  
  // Workspace metadata and editor states
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const activeWorkspaceName = useStore((state) => state.activeWorkspaceName);
  const updateWorkspaceName = useStore((state) => state.updateWorkspaceName);
  
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const nodeIDs = useStore((state) => state.nodeIDs);
  const nodesCount = nodes.length;
  const edgesCount = edges.length;

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveWorkspace = async () => {
    if (!activeWorkspaceId) return;
    setSaveLoading(true);
    setSaveSuccess(false);
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${backendUrl}/api/workspaces/${activeWorkspaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: activeWorkspaceName,
          nodes,
          edges,
          nodeIDs
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to save workspace');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error(error);
      alert('Error saving workspace: ' + error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // State Routing Render
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'login' || currentView === 'register') {
    return <AuthPage mode={currentView} />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard />;
  }

  return (
    <div className="app-container">
      {/* Canvas interactive background */}
      <AnimatedBackground />

      <header className="app-header">
        <div className="header-left">
          <button className="btn-back-dashboard" onClick={() => setCurrentView('dashboard')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Dashboard
          </button>
          <div className="header-divider"></div>
          <div className="workspace-name-wrapper">
            <input
              className="workspace-name-input"
              type="text"
              value={activeWorkspaceName}
              onChange={(e) => updateWorkspaceName(e.target.value)}
              title="Click to rename workspace"
              placeholder="Untitled Workspace"
            />
            <span className="edit-pencil-icon">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </span>
          </div>
        </div>

        <div className="header-actions">
          {saveSuccess && <span className="save-success-badge">Saved!</span>}
          <button 
            className={`btn-save-workspace ${saveSuccess ? 'success' : ''}`}
            onClick={handleSaveWorkspace}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <span className="btn-spinner"></span>
            ) : saveSuccess ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save State
              </>
            )}
          </button>
          <div className="header-divider"></div>
          <SubmitButton />
        </div>
      </header>

      <PipelineToolbar />
      
      <PipelineUI />

      {/* Deploy-ready business status footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span className="status-dot-pulse"></span>
          <span className="status-text">Engine Status: Ready</span>
        </div>
        <div className="footer-middle">
          <span className="stat-badge">Active Nodes: <strong>{nodesCount}</strong></span>
          <span className="stat-badge">Connections: <strong>{edgesCount}</strong></span>
        </div>
        <div className="footer-right">
          <span className="footer-copyright">VectorShift Technical Assessment &copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

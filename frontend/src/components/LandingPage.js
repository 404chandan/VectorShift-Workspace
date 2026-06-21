import React from 'react';
import { useStore } from '../store';

export const LandingPage = () => {
  const setCurrentView = useStore((state) => state.setCurrentView);
  const token = useStore((state) => state.token);

  const handleGetStarted = () => {
    if (token) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('register');
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation header */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">V</div>
          <span className="logo-text">VectorShift</span>
        </div>
        <div className="nav-actions">
          {token ? (
            <button className="nav-btn-primary" onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          ) : (
            <>
              <button className="nav-btn-text" onClick={() => setCurrentView('login')}>Sign In</button>
              <button className="nav-btn-primary" onClick={() => setCurrentView('register')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-content">
          <div className="badge-glowing">Next-Gen Pipeline Builder</div>
          <h1 className="hero-title">
            Design & Analyze <br />
            <span className="text-gradient">AI Workflows Visually</span>
          </h1>
          <p className="hero-subtitle">
            An advanced drag-and-drop workflow editor for connecting LLMs, vector databases, custom code nodes, and API integrations. Validate graphs in real-time and save workspaces effortlessly.
          </p>
          <div className="hero-cta-group">
            <button className="btn-hero-primary" onClick={handleGetStarted}>
              Start Designing Free
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <a href="#features" className="btn-hero-secondary">Explore Features</a>
          </div>
        </div>

        {/* Visual Mockup Dashboard in Hero */}
        <div className="hero-visual">
          <div className="mockup-frame">
            <div className="mockup-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="mockup-title">Untitled Pipeline</span>
            </div>
            <div className="mockup-body">
              <div className="node-mockup input-node">
                <div className="node-header">User Input</div>
                <div className="node-fields">
                  <span className="field-label">Name:</span>
                  <span className="field-val">query</span>
                </div>
                <span className="node-handle-mockup right"></span>
              </div>

              <div className="node-mockup llm-node">
                <span className="node-handle-mockup left"></span>
                <div className="node-header">LLM Engine</div>
                <div className="node-fields">
                  <span className="field-label">Model:</span>
                  <span className="field-val">gpt-4o</span>
                </div>
                <span className="node-handle-mockup right"></span>
              </div>

              <div className="node-mockup output-node">
                <span className="node-handle-mockup left"></span>
                <div className="node-header">Output</div>
                <div className="node-fields">
                  <span className="field-label">Response</span>
                </div>
              </div>

              <svg className="mockup-connection-line">
                <path d="M 125,75 C 160,75 160,115 195,115" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="3" fill="none" strokeDasharray="5 5" />
                <path d="M 325,115 C 360,115 360,75 395,75" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="3" fill="none" strokeDasharray="5 5" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="landing-features">
        <h2 className="section-title">Engineered for Advanced Workflows</h2>
        <p className="section-subtitle">Everything you need to orchestrate complex AI logic and validate structure before production.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon drag"></div>
            <h3>Intelligent Editor</h3>
            <p>Drag and drop nodes ranging from simple inputs, alerts, database lookups, to complex AI integrations and filters.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon check"></div>
            <h3>DAG Validation</h3>
            <p>Automatic directed acyclic graph detection prevents infinite execution loops and invalid dependency cycles.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon save"></div>
            <h3>Workspace Persistence</h3>
            <p>Keep your workflows safely organized in MongoDB. Reload, duplicate, modify, or delete workspaces at any time.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon animate"></div>
            <h3>Rich Visual Feedback</h3>
            <p>Vibrant micro-animations, glassmorphism UI components, and real-time statistics updates on your graphs.</p>
          </div>
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <span className="footer-logo">VectorShift Workspace</span>
          <span className="footer-copyright">&copy; 2026 VectorShift Technical Assessment. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

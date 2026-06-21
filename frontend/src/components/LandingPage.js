import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { AnimatedBackground } from '../AnimatedBackground';

export const LandingPage = () => {
  const setCurrentView = useStore((state) => state.setCurrentView);
  const token = useStore((state) => state.token);
  
  // Interactive Simulator State
  const [simState, setSimState] = useState('idle'); // 'idle', 'input', 'llm', 'output', 'complete'
  const [terminalLogs, setTerminalLogs] = useState([]);
  
  // FAQ Collapsible State
  const [faqOpen, setFaqOpen] = useState({
    0: false,
    1: false,
    2: false,
    3: false
  });

  const handleGetStarted = () => {
    if (token) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('register');
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Run Canvas Simulation
  const runSimulation = () => {
    if (simState !== 'idle' && simState !== 'complete') return;
    
    setSimState('input');
    setTerminalLogs([
      '[System] Initializing simulation pipeline...',
      '[Input] Input node triggered with value: "Draft a client update email."'
    ]);
    
    setTimeout(() => {
      setSimState('llm');
      setTerminalLogs(prev => [
        ...prev,
        '[Flow] Data successfully sent to LLM port (Prompt: "Write email response...")',
        '[LLM] LLM model gpt-4o thinking... generating response tokens.'
      ]);
    }, 1500);

    setTimeout(() => {
      setSimState('output');
      setTerminalLogs(prev => [
        ...prev,
        '[Flow] LLM Response generated. Directing text stream to Output Port...',
        '[Output] Response received: "Dear Client, We are writing to update..."'
      ]);
    }, 3000);

    setTimeout(() => {
      setSimState('complete');
      setTerminalLogs(prev => [
        ...prev,
        '[System] Execution finished successfully. Graph validation: DAG Status Valid.',
        '[System] Node execution path: InputNode -> LLMNode -> OutputNode. Total time: 3.8s.'
      ]);
    }, 4200);
  };

  const resetSimulation = () => {
    setSimState('idle');
    setTerminalLogs([]);
  };

  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="landing-page">
      {/* Background Interactive particles */}
      <div className="landing-bg-overlay">
        <AnimatedBackground />
      </div>

      {/* Navigation header */}
      <nav className="landing-nav glassmorphism">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">V</div>
          <span className="logo-text">VectorShift</span>
        </div>
        
        <div className="nav-links">
          <button className="nav-link-btn" onClick={() => scrollToSection('features')}>Features</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('how-it-works')}>How it Works</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('playground')}>Interactive Demo</button>
          <button className="nav-link-btn" onClick={() => scrollToSection('faq')}>FAQ</button>
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
      <header className="landing-hero fade-in-section">
        <div className="hero-content">
          <div className="badge-glowing pulse">Next-Gen Pipeline Builder</div>
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
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button className="btn-hero-secondary" onClick={() => scrollToSection('features')}>Explore Features</button>
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
              <div className="node-mockup input-node float-animation-1">
                <div className="node-header">User Input</div>
                <div className="node-fields">
                  <span className="field-label">Name:</span>
                  <span className="field-val">query</span>
                </div>
                <span className="node-handle-mockup right glow-node"></span>
              </div>

              <div className="node-mockup llm-node float-animation-2">
                <span className="node-handle-mockup left glow-node"></span>
                <div className="node-header">LLM Engine</div>
                <div className="node-fields">
                  <span className="field-label">Model:</span>
                  <span className="field-val">gpt-4o</span>
                </div>
                <span className="node-handle-mockup right glow-node"></span>
              </div>

              <div className="node-mockup output-node float-animation-3">
                <span className="node-handle-mockup left glow-node"></span>
                <div className="node-header">Output</div>
                <div className="node-fields">
                  <span className="field-label">Response</span>
                </div>
              </div>

              <svg className="mockup-connection-line">
                <path d="M 125,75 C 160,75 160,115 195,115" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="3" fill="none" strokeDasharray="5 5" className="dash-flow" />
                <path d="M 325,115 C 360,115 360,75 395,75" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="3" fill="none" strokeDasharray="5 5" className="dash-flow-fast" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="landing-features fade-in-section">
        <h2 className="section-title">Engineered for Advanced Workflows</h2>
        <p className="section-subtitle">Everything you need to orchestrate complex AI logic and validate structure before production.</p>
        
        <div className="features-grid">
          <div className="feature-card glassmorphism">
            <div className="feature-icon drag"></div>
            <h3>Intelligent Editor</h3>
            <p>Drag and drop nodes ranging from simple inputs, alerts, database lookups, to complex AI integrations and filters.</p>
          </div>

          <div className="feature-card glassmorphism">
            <div className="feature-icon check"></div>
            <h3>DAG Validation</h3>
            <p>Automatic directed acyclic graph detection prevents infinite execution loops and invalid dependency cycles.</p>
          </div>

          <div className="feature-card glassmorphism">
            <div className="feature-icon save"></div>
            <h3>Workspace Persistence</h3>
            <p>Keep your workflows safely organized in MongoDB. Reload, duplicate, modify, or delete workspaces at any time.</p>
          </div>

          <div className="feature-card glassmorphism">
            <div className="feature-icon animate"></div>
            <h3>Rich Visual Feedback</h3>
            <p>Vibrant micro-animations, glassmorphism UI components, and real-time statistics updates on your graphs.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="landing-how-works fade-in-section">
        <h2 className="section-title">Workflow Lifecycle</h2>
        <p className="section-subtitle">Four simple phases to build, validate, and launch dynamic agent applications.</p>
        
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          <div className="timeline-step">
            <div className="step-number">1</div>
            <div className="step-content glassmorphism">
              <h4>Assemble Components</h4>
              <p>Drag specialized nodes from the options menu onto the canvas. Set prompts, thresholds, and variables.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">2</div>
            <div className="step-content glassmorphism">
              <h4>Establish Links</h4>
              <p>Connect source nodes to target nodes. Connect input prompts, conditional routing handles, or filters instantly.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">3</div>
            <div className="step-content glassmorphism">
              <h4>Validate Topology</h4>
              <p>Trigger parsing checks. The backend runs Kahn's algorithm in real time to verify your graph contains no cycles.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">4</div>
            <div className="step-content glassmorphism">
              <h4>Deploy Pipeline</h4>
              <p>Save states and execute endpoints. Trigger API actions or run logic seamlessly across integrated modules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Playground Simulator */}
      <section id="playground" className="landing-playground fade-in-section">
        <h2 className="section-title">Interactive Pipeline Preview</h2>
        <p className="section-subtitle">Simulate real-time token processing and loop-detection without registration.</p>

        <div className="playground-layout">
          {/* Simulator Canvas */}
          <div className="playground-canvas glassmorphism">
            <div className="canvas-header">
              <span className="badge-status-sim">Simulation Canvas</span>
              <div className="canvas-dots">
                <span className="dot-blink active"></span>
                <span>Active Simulator</span>
              </div>
            </div>
            
            <div className="canvas-body">
              {/* Input Node */}
              <div className={`sim-node input-node ${simState === 'input' ? 'active-glow' : ''}`}>
                <div className="sim-node-header">User Input</div>
                <div className="sim-node-body">
                  <span className="sim-label">Type:</span>
                  <span className="sim-value">Query Text</span>
                  {simState === 'input' && <span className="running-dot"></span>}
                </div>
                <div className="sim-handle right"></div>
              </div>

              {/* LLM Node */}
              <div className={`sim-node llm-node ${simState === 'llm' ? 'active-glow' : ''}`}>
                <div className="sim-handle left"></div>
                <div className="sim-node-header">LLM Engine</div>
                <div className="sim-node-body">
                  <span className="sim-label">Model:</span>
                  <span className="sim-value">gpt-4o</span>
                  {simState === 'llm' && <span className="thinking-spinner"></span>}
                </div>
                <div className="sim-handle right"></div>
              </div>

              {/* Output Node */}
              <div className={`sim-node output-node ${simState === 'output' || simState === 'complete' ? 'active-glow' : ''}`}>
                <div className="sim-handle left"></div>
                <div className="sim-node-header">Output</div>
                <div className="sim-node-body">
                  <span className="sim-label">Value:</span>
                  <span className="sim-value text-truncate">
                    {simState === 'idle' && '(waiting...)'}
                    {simState === 'input' && '(waiting...)'}
                    {simState === 'llm' && 'generating...'}
                    {(simState === 'output' || simState === 'complete') && 'Dear Client, We...'}
                  </span>
                  {simState === 'output' && <span className="running-dot"></span>}
                </div>
              </div>

              {/* SVG Connections with data pulses */}
              <svg className="sim-svg-connections">
                {/* Connection 1 */}
                <path id="sim-path-1" d="M 160,85 C 200,85 200,85 240,85" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2.5" />
                {simState === 'input' && (
                  <circle r="4.5" fill="#14b8a6">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 160,85 C 200,85 200,85 240,85" />
                  </circle>
                )}

                {/* Connection 2 */}
                <path id="sim-path-2" d="M 370,85 C 410,85 410,85 450,85" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2.5" />
                {simState === 'llm' && (
                  <circle r="4.5" fill="#818cf8">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 370,85 C 410,85 410,85 450,85" />
                  </circle>
                )}
              </svg>
            </div>

            {/* Play controls */}
            <div className="canvas-controls">
              <button 
                className="btn-sim-run" 
                onClick={runSimulation}
                disabled={simState !== 'idle' && simState !== 'complete'}
              >
                {simState === 'idle' || simState === 'complete' ? 'Run Simulation' : 'Running...'}
              </button>
              <button className="btn-sim-reset" onClick={resetSimulation} disabled={simState === 'idle'}>
                Reset
              </button>
            </div>
          </div>

          {/* Simulator Console Terminal */}
          <div className="playground-terminal glassmorphism">
            <div className="terminal-header">
              <span className="terminal-title">Execution Logs</span>
              <div className="terminal-actions">
                <span className="dot-action"></span>
                <span className="dot-action"></span>
                <span className="dot-action"></span>
              </div>
            </div>
            <div className="terminal-body">
              {terminalLogs.length === 0 ? (
                <div className="terminal-placeholder">
                  &gt; Click "Run Simulation" to execute the pipeline and inspect terminal outputs.
                </div>
              ) : (
                terminalLogs.map((log, i) => (
                  <div key={i} className="terminal-line">
                    <span className="terminal-prompt">&gt;</span> {log}
                  </div>
                ))
              )}
              {simState === 'input' && <div className="terminal-line animate-pulse">&gt; [Flow] Forwarding input payload...</div>}
              {simState === 'llm' && <div className="terminal-line animate-pulse">&gt; [LLM] Fetching weights and reasoning...</div>}
              {simState === 'output' && <div className="terminal-line animate-pulse">&gt; [Flow] Storing response data...</div>}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="landing-faq fade-in-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Learn more about the technical structure and features of VectorShift.</p>
        
        <div className="faq-list">
          <div className="faq-item glassmorphism">
            <div className="faq-question" onClick={() => toggleFaq(0)}>
              <h4>What is a DAG validation, and why does it matter?</h4>
              <span className={`faq-arrow ${faqOpen[0] ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`faq-answer ${faqOpen[0] ? 'open' : ''}`}>
              <p>
                A DAG (Directed Acyclic Graph) validation ensures that your pipelines do not contain infinite loops or circular dependencies. Before saving or executing, our engine analyses your topology using Kahn's algorithm to check that data only flows in one forward direction.
              </p>
            </div>
          </div>

          <div className="faq-item glassmorphism">
            <div className="faq-question" onClick={() => toggleFaq(1)}>
              <h4>What node types are available in the editor?</h4>
              <span className={`faq-arrow ${faqOpen[1] ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`faq-answer ${faqOpen[1] ? 'open' : ''}`}>
              <p>
                We currently support inputs (text parameters), LLM models (FastAPI LLM wrappers), output components, custom Javascript nodes, enrich nodes, alert filters, and database connector hooks.
              </p>
            </div>
          </div>

          <div className="faq-item glassmorphism">
            <div className="faq-question" onClick={() => toggleFaq(2)}>
              <h4>Is my workspace pipeline persistent?</h4>
              <span className={`faq-arrow ${faqOpen[2] ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`faq-answer ${faqOpen[2] ? 'open' : ''}`}>
              <p>
                Yes. Once registered, all canvas states, including node coordinates, names, connection handles, and settings, are stored in MongoDB. You can access, edit, rename, and delete them at any time.
              </p>
            </div>
          </div>

          <div className="faq-item glassmorphism">
            <div className="faq-question" onClick={() => toggleFaq(3)}>
              <h4>Is this application responsive?</h4>
              <span className={`faq-arrow ${faqOpen[3] ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`faq-answer ${faqOpen[3] ? 'open' : ''}`}>
              <p>
                Yes. The landing page, authentication system, workspaces panel, and editor wrappers are designed to scale cleanly across standard mobile devices, tablets, and desktop displays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-action Banner */}
      <section className="landing-cta-banner fade-in-section">
        <div className="cta-wrapper glassmorphism">
          <div className="cta-glow-effect"></div>
          <h2>Ready to Construct Complex AI Flows?</h2>
          <p>Join the next generation of visual workflow programming. Connect and deploy your structures instantly.</p>
          <button className="btn-hero-primary" onClick={handleGetStarted}>
            Create Free Account
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
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

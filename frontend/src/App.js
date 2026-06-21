import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { AnimatedBackground } from './AnimatedBackground';
import { useStore } from './store';

function App() {
  const nodesCount = useStore((state) => state.nodes.length);
  const edgesCount = useStore((state) => state.edges.length);

  return (
    <div className="app-container">
      {/* Canvas interactive background */}
      <AnimatedBackground />

      <header className="app-header">
        <div className="header-left">
          <div className="logo-icon">V</div>
          <span className="header-title">VectorShift Workspace</span>
          <span className="header-subtitle">Pipeline Editor v1.0</span>
        </div>
        <SubmitButton />
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


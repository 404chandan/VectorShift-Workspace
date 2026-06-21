import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pipeline', JSON.stringify({ nodes, edges }));

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/pipelines/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      setResult(data);
      setModalOpen(true);

    } catch (error) {
      console.error(error);
      alert('Error calling backend parser: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-container">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Analyzing...' : 'Run Pipeline Analysis'}
        </button>
      </div>

      {modalOpen && result && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Pipeline Analysis</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="modal-metric">
                <span className="metric-label">Nodes Count</span>
                <span className="metric-value">{result.num_nodes}</span>
              </div>
              <div className="modal-metric">
                <span className="metric-label">Edges Count</span>
                <span className="metric-value">{result.num_edges}</span>
              </div>
              <div className="modal-metric full-width">
                <span className="metric-label">Directed Acyclic Graph (DAG) Check</span>
                <div className={`dag-badge ${result.is_dag ? 'success' : 'danger'}`}>
                  {result.is_dag ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>Valid DAG (No Cycles)</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                      <span>Cyclic Graph Detected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-confirm-btn" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


import React, { useEffect } from 'react';
import { Handle, useUpdateNodeInternals, Position } from 'reactflow';
import { useStore } from '../store';
import './BaseNode.css';

export const BaseNode = ({
  id,
  title,
  icon,
  inputs = [],
  outputs = [],
  children,
  style = {},
  className = '',
  isConnectable = true,
}) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeField = useStore((state) => state.updateNodeField);
  const deleteNode = useStore((state) => state.deleteNode);

  // Retrieve custom ports from Zustand store
  const nodeData = useStore((state) => state.nodes.find((n) => n.id === id)?.data);
  const customInputs = nodeData?.customInputs || [];
  const customOutputs = nodeData?.customOutputs || [];

  // Update React Flow internals whenever handle lengths change
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, inputs.length, outputs.length, customInputs.length, customOutputs.length, updateNodeInternals]);

  // Combine default inputs with user custom inputs, calculating even vertical distribution
  const totalInputs = inputs.length + customInputs.length;
  const mergedInputs = [
    ...inputs.map((input, idx) => ({
      ...input,
      style: { top: `${((idx + 1) * 100) / (totalInputs + 1)}%` },
    })),
    ...customInputs.map((ci, idx) => ({
      id: ci.id,
      position: Position.Left,
      style: { top: `${((inputs.length + idx + 1) * 100) / (totalInputs + 1)}%` },
      label: ci.label,
    }))
  ];

  // Combine default outputs with user custom outputs, calculating even vertical distribution
  const totalOutputs = outputs.length + customOutputs.length;
  const mergedOutputs = [
    ...outputs.map((output, idx) => ({
      ...output,
      style: { top: `${((idx + 1) * 100) / (totalOutputs + 1)}%` },
    })),
    ...customOutputs.map((co, idx) => ({
      id: co.id,
      position: Position.Right,
      style: { top: `${((outputs.length + idx + 1) * 100) / (totalOutputs + 1)}%` },
      label: co.label,
    }))
  ];

  // Action Handlers
  const handleAddInput = () => {
    const nextIdx = customInputs.length + 1;
    const newPort = {
      id: `${id}-custom-in-${Date.now()}`,
      label: `In ${nextIdx}`,
    };
    updateNodeField(id, 'customInputs', [...customInputs, newPort]);
  };

  const handleRemoveInput = (portId) => {
    updateNodeField(id, 'customInputs', customInputs.filter((port) => port.id !== portId));
  };

  const handleAddOutput = () => {
    const nextIdx = customOutputs.length + 1;
    const newPort = {
      id: `${id}-custom-out-${Date.now()}`,
      label: `Out ${nextIdx}`,
    };
    updateNodeField(id, 'customOutputs', [...customOutputs, newPort]);
  };

  const handleRemoveOutput = (portId) => {
    updateNodeField(id, 'customOutputs', customOutputs.filter((port) => port.id !== portId));
  };
  
  const handleDelete = () => {
    deleteNode(id);
  };

  return (
    <div className={`base-node ${className}`} style={style}>
      {/* Header section */}
      <div className="node-header">
        <div className="node-header-title-container">
          {icon && <span className="node-icon">{icon}</span>}
          <span className="node-title">{title}</span>
        </div>
        <button onClick={handleDelete} className="delete-node-btn" type="button" title="Delete Node">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main node content */}
      <div className="node-content">
        {children}

        {/* Dynamic connection points controller UI */}
        <div className="custom-ports-section">
          <div className="custom-ports-header">
            <span>Custom Ports</span>
            <div className="custom-ports-actions">
              <button onClick={handleAddInput} className="add-port-btn" type="button">+ Input</button>
              <button onClick={handleAddOutput} className="add-port-btn" type="button">+ Output</button>
            </div>
          </div>
          
          {/* Lists of currently active custom ports with deletion options */}
          {(customInputs.length > 0 || customOutputs.length > 0) && (
            <div className="custom-ports-list">
              {customInputs.map((ci) => (
                <div key={ci.id} className="custom-port-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="port-dot input-dot"></span>
                    <span className="port-label">{ci.label}</span>
                  </div>
                  <button onClick={() => handleRemoveInput(ci.id)} className="remove-port-btn" type="button">&times;</button>
                </div>
              ))}
              {customOutputs.map((co) => (
                <div key={co.id} className="custom-port-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="port-dot output-dot"></span>
                    <span className="port-label">{co.label}</span>
                  </div>
                  <button onClick={() => handleRemoveOutput(co.id)} className="remove-port-btn" type="button">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Target (input) Handles */}
      {mergedInputs.map((input) => (
        <div key={input.id} className="handle-container input-handle-container" style={input.style}>
          <Handle
            type="target"
            position={input.position}
            id={input.id}
            className={`custom-handle input-handle ${input.className || ''}`}
            isConnectable={input.isConnectable !== undefined ? input.isConnectable : isConnectable}
          />
          {input.label && (
            <span className="handle-label input-label" style={input.labelStyle}>
              {input.label}
            </span>
          )}
        </div>
      ))}

      {/* Source (output) Handles */}
      {mergedOutputs.map((output) => (
        <div key={output.id} className="handle-container output-handle-container" style={output.style}>
          <Handle
            type="source"
            position={output.position}
            id={output.id}
            className={`custom-handle output-handle ${output.className || ''}`}
            isConnectable={output.isConnectable !== undefined ? output.isConnectable : isConnectable}
          />
          {output.label && (
            <span className="handle-label output-label" style={output.labelStyle}>
              {output.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

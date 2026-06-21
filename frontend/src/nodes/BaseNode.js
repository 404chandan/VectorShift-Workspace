import React from 'react';
import { Handle } from 'reactflow';
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
}) => {
  return (
    <div className={`base-node ${className}`} style={style}>
      {/* Header section */}
      <div className="node-header">
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title}</span>
      </div>

      {/* Main node content */}
      <div className="node-content">
        {children}
      </div>

      {/* Target (input) Handles */}
      {inputs.map((input) => (
        <div key={input.id} className="handle-container input-handle-container">
          <Handle
            type="target"
            position={input.position}
            id={input.id}
            style={input.style}
            className={`custom-handle input-handle ${input.className || ''}`}
          />
          {input.label && (
            <span className="handle-label input-label" style={input.labelStyle}>
              {input.label}
            </span>
          )}
        </div>
      ))}

      {/* Source (output) Handles */}
      {outputs.map((output) => (
        <div key={output.id} className="handle-container output-handle-container">
          <Handle
            type="source"
            position={output.position}
            id={output.id}
            style={output.style}
            className={`custom-handle output-handle ${output.className || ''}`}
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

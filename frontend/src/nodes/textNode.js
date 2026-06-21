import { useState, useEffect, useRef } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);

  // Extract variables of the format {{ varName }} where varName is a valid JS identifier
  const extractVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const vars = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const varName = match[1];
      if (!vars.includes(varName)) {
        vars.push(varName);
      }
    }
    return vars;
  };

  const variables = extractVariables(currText);

  // Synchronize height, width and update internals when content changes
  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea height
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      
      // Auto-resize textarea width based on line length
      const lines = currText.split('\n');
      const maxLineLength = Math.max(...lines.map(l => l.length));
      const calculatedWidth = Math.max(220, Math.min(450, maxLineLength * 7.5 + 32));
      textareaRef.current.style.width = `${calculatedWidth}px`;
    }
    
    // Notify React Flow that handles may have been added/removed or node resized
    updateNodeInternals(id);
  }, [id, currText, variables.length, updateNodeInternals]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    updateNodeField(id, 'text', val);
  };

  // Generate dynamic target handles based on detected variables
  const inputs = variables.map((varName, idx) => ({
    id: `${id}-${varName}`,
    position: Position.Left,
    style: { top: `${(idx + 1) * (100 / (variables.length + 1))}%` },
    label: varName,
    labelStyle: { top: `${(idx + 1) * (100 / (variables.length + 1))}%` }
  }));

  // Render a clean SVG icon for Text
  const textIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Text block"
      icon={textIcon}
      style={{ width: 'auto', height: 'auto' }}
      inputs={inputs}
      outputs={[{ id: `${id}-output`, position: Position.Right }]}
    >
      <label>
        Text Expression
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          rows={1}
          placeholder="Type text here..."
          style={{
            resize: 'none',
            overflow: 'hidden',
            boxSizing: 'border-box',
            width: '100%',
            minHeight: '40px',
            maxHeight: '300px',
            minWidth: '200px',
            lineHeight: '1.4'
          }}
        />
      </label>
    </BaseNode>
  );
}


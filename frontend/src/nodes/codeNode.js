import { useState } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const CodeNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [code, setCode] = useState(data?.code || '// Write JavaScript here\nreturn args;');

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCode(val);
    updateNodeField(id, 'code', val);
  };

  const codeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Code Runner"
      icon={codeIcon}
      style={{ width: 240 }}
      inputs={[{ id: `${id}-args`, position: Position.Left, label: 'Args' }]}
      outputs={[{ id: `${id}-result`, position: Position.Right, label: 'Result' }]}
    >
      <label>
        Script (JS)
        <textarea
          value={code}
          onChange={handleCodeChange}
          rows={4}
          placeholder="function run(args) { ... }"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '11px',
            background: '#0d1117',
            borderColor: '#30363d',
            lineHeight: '1.3'
          }}
        />
      </label>
    </BaseNode>
  );
};

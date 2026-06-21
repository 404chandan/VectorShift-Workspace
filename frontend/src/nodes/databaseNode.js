import { useState } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const DatabaseNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [dbType, setDbType] = useState(data?.dbType || 'postgres');
  const [tableName, setTableName] = useState(data?.tableName || '');

  const handleDbTypeChange = (e) => {
    const val = e.target.value;
    setDbType(val);
    updateNodeField(id, 'dbType', val);
  };

  const handleTableNameChange = (e) => {
    const val = e.target.value;
    setTableName(val);
    updateNodeField(id, 'tableName', val);
  };

  const dbIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Database Query"
      icon={dbIcon}
      style={{ width: 220 }}
      inputs={[
        { id: `${id}-query`, position: Position.Left, style: { top: '35%' }, label: 'SQL/Query', labelStyle: { top: '35%' } },
        { id: `${id}-payload`, position: Position.Left, style: { top: '65%' }, label: 'Params', labelStyle: { top: '65%' } }
      ]}
      outputs={[{ id: `${id}-records`, position: Position.Right, label: 'Result Set' }]}
    >
      <label>
        Database Type
        <select value={dbType} onChange={handleDbTypeChange}>
          <option value="postgres">PostgreSQL</option>
          <option value="mongodb">MongoDB</option>
          <option value="mysql">MySQL</option>
          <option value="redis">Redis</option>
        </select>
      </label>
      <label>
        Table / Collection
        <input 
          type="text" 
          value={tableName} 
          onChange={handleTableNameChange} 
          placeholder="e.g. users"
        />
      </label>
    </BaseNode>
  );
};

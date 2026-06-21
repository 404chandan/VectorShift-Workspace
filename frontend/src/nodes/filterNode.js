import { useState } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [operator, setOperator] = useState(data?.operator || 'contains');
  const [value, setValue] = useState(data?.value || '');

  const handleOperatorChange = (e) => {
    const val = e.target.value;
    setOperator(val);
    updateNodeField(id, 'operator', val);
  };

  const handleValueChange = (e) => {
    const val = e.target.value;
    setValue(val);
    updateNodeField(id, 'value', val);
  };

  const filterIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Filter Data"
      icon={filterIcon}
      style={{ width: 220 }}
      inputs={[
        { id: `${id}-input`, position: Position.Left, style: { top: '35%' }, label: 'Input', labelStyle: { top: '35%' } },
        { id: `${id}-condition`, position: Position.Left, style: { top: '65%' }, label: 'Rule', labelStyle: { top: '65%' } }
      ]}
      outputs={[
        { id: `${id}-true`, position: Position.Right, style: { top: '35%' }, label: 'True', labelStyle: { top: '35%' } },
        { id: `${id}-false`, position: Position.Right, style: { top: '65%' }, label: 'False', labelStyle: { top: '65%' } }
      ]}
    >
      <label>
        Operator
        <select value={operator} onChange={handleOperatorChange}>
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="starts_with">Starts With</option>
          <option value="gt">Greater Than</option>
          <option value="lt">Less Than</option>
        </select>
      </label>
      <label>
        Target Value
        <input 
          type="text" 
          value={value} 
          onChange={handleValueChange} 
          placeholder="e.g. active"
        />
      </label>
    </BaseNode>
  );
};

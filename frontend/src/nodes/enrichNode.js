import { useState } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const EnrichNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [provider, setProvider] = useState(data?.provider || 'clearbit');
  const [apiKey, setApiKey] = useState(data?.apiKey || '');

  const handleProviderChange = (e) => {
    const val = e.target.value;
    setProvider(val);
    updateNodeField(id, 'provider', val);
  };

  const handleApiKeyChange = (e) => {
    const val = e.target.value;
    setApiKey(val);
    updateNodeField(id, 'apiKey', val);
  };

  const enrichIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5 5 3Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Data Enricher"
      icon={enrichIcon}
      style={{ width: 220 }}
      inputs={[{ id: `${id}-source`, position: Position.Left, label: 'Data Key' }]}
      outputs={[
        { id: `${id}-profile`, position: Position.Right, style: { top: '35%' }, label: 'Profile', labelStyle: { top: '35%' } },
        { id: `${id}-status`, position: Position.Right, style: { top: '65%' }, label: 'Status', labelStyle: { top: '65%' } }
      ]}
    >
      <label>
        Provider
        <select value={provider} onChange={handleProviderChange}>
          <option value="clearbit">Clearbit Profile</option>
          <option value="ip_api">IP Geolocation</option>
          <option value="hunter">Hunter.io Verifier</option>
        </select>
      </label>
      <label>
        API Key
        <input 
          type="text" 
          value={apiKey} 
          onChange={handleApiKeyChange} 
          placeholder="optional token"
        />
      </label>
    </BaseNode>
  );
};

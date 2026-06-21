import { useState } from 'react';
import { Position } from 'reactflow';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const AlertNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [channel, setChannel] = useState(data?.channel || 'slack');
  const [target, setTarget] = useState(data?.target || '');

  const handleChannelChange = (e) => {
    const val = e.target.value;
    setChannel(val);
    updateNodeField(id, 'channel', val);
  };

  const handleTargetChange = (e) => {
    const val = e.target.value;
    setTarget(val);
    updateNodeField(id, 'target', val);
  };

  const alertIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Notification Node"
      icon={alertIcon}
      style={{ width: 220 }}
      inputs={[
        { id: `${id}-message`, position: Position.Left, style: { top: '35%' }, label: 'Message body', labelStyle: { top: '35%' } },
        { id: `${id}-recipient`, position: Position.Left, style: { top: '65%' }, label: 'Receiver', labelStyle: { top: '65%' } }
      ]}
      outputs={[{ id: `${id}-sent`, position: Position.Right, label: 'Success status' }]}
    >
      <label>
        Channel
        <select value={channel} onChange={handleChannelChange}>
          <option value="slack">Slack Channel</option>
          <option value="discord">Discord Webhook</option>
          <option value="email">SMTP Email</option>
          <option value="sms">SMS (Twilio)</option>
        </select>
      </label>
      <label>
        Webhook / Target ID
        <input 
          type="text" 
          value={target} 
          onChange={handleTargetChange} 
          placeholder="e.g. #general"
        />
      </label>
    </BaseNode>
  );
};

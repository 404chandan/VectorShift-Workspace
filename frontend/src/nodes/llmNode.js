import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  // Render a clean SVG icon for LLMs
  const llmIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 7.54 16.59c-.44.47-.69 1.11-.69 1.77A1.64 1.64 0 0 1 17.2 22H6.8a1.64 1.64 0 0 1-1.65-1.64c0-.66-.25-1.3-.69-1.77A10 10 0 0 1 12 2Z" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="LLM Model"
      icon={llmIcon}
      style={{ width: 220 }}
      inputs={[
        { id: `${id}-system`, position: Position.Left, style: { top: `${100 / 3}%` }, label: 'System', labelStyle: { top: `${100 / 3}%` } },
        { id: `${id}-prompt`, position: Position.Left, style: { top: `${200 / 3}%` }, label: 'Prompt', labelStyle: { top: `${200 / 3}%` } }
      ]}
      outputs={[{ id: `${id}-response`, position: Position.Right, label: 'Response' }]}
    >
      <div style={{ padding: '4px 0', color: '#9ca3af', lineHeight: '1.4' }}>
        Processes system and user prompt variables using a state-of-the-art LLM model to return structured responses.
      </div>
    </BaseNode>
  );
}


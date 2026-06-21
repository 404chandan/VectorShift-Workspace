// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div className="pipeline-toolbar">
            <h2 className="toolbar-title">Node Options</h2>
            <div className="toolbar-nodes-container">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='filterNode' label='Filter' />
                <DraggableNode type='enrichNode' label='Enrich' />
                <DraggableNode type='codeNode' label='Code' />
                <DraggableNode type='databaseNode' label='Database' />
                <DraggableNode type='alertNode' label='Alert' />
            </div>
        </div>
    );
};

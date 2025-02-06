import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Define colors for different node types.
const nodeColors = {
  prompt: '#ADD8E6', // Light Blue
  end: '#90EE90', // Light Green
  api: '#F08080', // Light Coral
  default: '#ffffff', // White
};

// Initial nodes: two sample nodes using two different node types.
const initialNodes = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 50 },
    data: {
      label: 'Prompt: "Hello, please say your account number."',
      nodeType: 'prompt',
    },
    style: { backgroundColor: nodeColors['prompt'] },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 200 },
    data: { label: 'End: "Thank you, goodbye!"', nodeType: 'end' },
    style: { backgroundColor: nodeColors['end'] },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'default',
  },
];

function WorkflowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState('prompt');
  const [nodeLabel, setNodeLabel] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [rfInstance, setRfInstance] = useState(null);

  // Allow connecting nodes with an edge.
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Update node positions and properties when nodes are moved or changed.
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // When the user clicks on the canvas while in "add node" mode.
  const onPaneClick = useCallback(
    (event) => {
      if (isAdding && rfInstance) {
        // Create a unique id based on the current number of nodes.
        const newId = (nodes.length + 1).toString();
        // Create the new node using the selected node type and label.
        const newNode = {
          id: newId,
          type: 'default',
          data: {
            label: nodeLabel || `${selectedNodeType} node`,
            nodeType: selectedNodeType,
          },
          position: rfInstance.project({ x: event.clientX, y: event.clientY }),
          style: { backgroundColor: nodeColors[selectedNodeType] },
        };
        // Add the new node to the nodes array.
        setNodes((nds) => nds.concat(newNode));
        // Exit "add mode" after placing the node.
        setIsAdding(false);
      }
    },
    [isAdding, rfInstance, nodes.length, nodeLabel, selectedNodeType]
  );

  return (
    <div>
      {/* Controls to select the node type, set the label, and enable add mode */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          Node Type:&nbsp;
          <select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
          >
            <option value="prompt">Prompt</option>
            <option value="end">End</option>
            <option value="api">API</option>
            <option value="default">Default</option>
          </select>
        </label>
        &nbsp;&nbsp;
        <label>
          Label:&nbsp;
          <input
            type="text"
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            placeholder="Node Label"
          />
        </label>
        &nbsp;&nbsp;
        <button onClick={() => setIsAdding(true)}>Add Node</button>
        {isAdding && (
          <span style={{ marginLeft: '10px' }}>
            Click on canvas to place node
          </span>
        )}
      </div>

      {/* ReactFlow component */}
      <div style={{ height: '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange} // <-- Handle node dragging and updates
          onConnect={onConnect}
          onPaneClick={onPaneClick}
          onInit={setRfInstance}
          fitView
        >
          <MiniMap nodeStrokeWidth={3} />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default WorkflowEditor;

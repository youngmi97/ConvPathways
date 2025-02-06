import nodes from '../models/workflow.js';

export function getCurrentNode(session) {
  return nodes[session.currentNode];
}

export function transitionToNextNode(session, transitionKey) {
  const currentNode = nodes[session.currentNode];
  // Look up the next node based on the transition key;
  // fall back to a default transition if not specified.
  const nextNodeId =
    currentNode.transitions[transitionKey] || currentNode.transitions.default;
  session.currentNode = nextNodeId;
  return nodes[nextNodeId];
}

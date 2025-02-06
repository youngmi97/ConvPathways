// SAMPLE
const workflow = {
  // Starting node
  initialNode: 'node1',
  nodes: {
    node1: {
      id: 'node1',
      type: 'prompt',
      content: 'Hello, please say your account number.',
      transitions: {
        default: 'node2',
      },
    },
    node2: {
      id: 'node2',
      type: 'end',
      content: 'Thank you. Goodbye!',
    },
  },
};

export default workflow;

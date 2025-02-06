const sessions = {};

/**
 * Create a new session for a call.
 * @param {string} callSid - The unique call identifier from Twilio.
 * @param {string} initialNode - The starting node of the workflow.
 */
export function createSession(callSid, initialNode) {
  sessions[callSid] = {
    currentNode: initialNode,
    context: {},
  };
}

/**
 * Retrieve an existing session.
 * @param {string} callSid
 */
export function getSession(callSid) {
  return sessions[callSid];
}

/**
 * Update the session with new data.
 * @param {string} callSid
 * @param {Object} newData
 */
export function updateSession(callSid, newData) {
  sessions[callSid] = { ...sessions[callSid], ...newData };
}

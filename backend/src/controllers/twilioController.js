import {
  createSession,
  getSession,
  updateSession,
} from '../models/callSessionStore.js';
import {
  getCurrentNode,
  transitionToNextNode,
} from '../services/workflowEngine.js';
import { generateTTS } from '../services/ttsService.js';
import { classifyIntent } from '../services/intentClassifier.js';
// import { twiml as _twiml } from 'twilio';
import twilio from 'twilio';
const { twiml: _twiml } = twilio;

const VoiceResponse = _twiml.VoiceResponse;

export async function handleIncomingCall(req, res) {
  const callSid = req.body.CallSid;

  // Create a new session if one doesn't exist
  let session = getSession(callSid);
  if (!session) {
    createSession(callSid, 'node1');
    session = getSession(callSid);
  }

  const currentNode = getCurrentNode(session);

  // Process a prompt node
  if (currentNode.type === 'prompt') {
    const audioUrl = await generateTTS(currentNode.content, {});
    const twiml = new VoiceResponse();
    // Play the generated audio
    twiml.play(audioUrl);
    // Use <Gather> to capture the caller's speech
    twiml.gather({
      input: 'speech',
      action: '/webhook/twilio/response',
      method: 'POST',
      timeout: 5,
    });
    res.type('text/xml');
    res.send(twiml.toString());
  } else if (currentNode.type === 'end') {
    // End-of-call node: say goodbye and hang up
    const twiml = new VoiceResponse();
    twiml.say(currentNode.content);
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  } else {
    res.status(400).send('Unsupported node type');
  }
}

export async function handleUserResponse(req, res) {
  const callSid = req.body.CallSid;
  const speechResult = req.body.SpeechResult || '';

  let session = getSession(callSid);
  if (!session) {
    res.status(404).send('Session not found');
    return;
  }

  // Classify the intent based on the caller's speech (here, we always return "default")
  const intent = await classifyIntent(speechResult);

  // Transition to the next node based on the intent
  const nextNode = transitionToNextNode(session, intent);

  // Update the session (in this simple example the session is in-memory)
  updateSession(callSid, session);

  if (nextNode.type === 'prompt') {
    const audioUrl = await generateTTS(nextNode.content, {});
    const twiml = new VoiceResponse();
    twiml.play(audioUrl);
    twiml.gather({
      input: 'speech',
      action: '/webhook/twilio/response',
      method: 'POST',
      timeout: 5,
    });
    res.type('text/xml');
    res.send(twiml.toString());
  } else if (nextNode.type === 'end') {
    const twiml = new VoiceResponse();
    twiml.say(nextNode.content);
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  } else {
    res.status(400).send('Unsupported node type');
  }
}

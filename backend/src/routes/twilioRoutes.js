import { Router } from 'express';
const router = Router();
import {
  handleIncomingCall,
  handleUserResponse,
} from '../controllers/twilioController.js';

// Endpoint for the initial webhook from Twilio (incoming call)
router.post('/', handleIncomingCall);

// Endpoint for handling gathered user responses
router.post('/response', handleUserResponse);

export default router;

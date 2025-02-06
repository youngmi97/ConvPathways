import express from 'express';
import bodyParser from 'body-parser';
const { urlencoded, json } = bodyParser;
import twilioRoutes from './routes/twilioRoutes.js';

const app = express();

// Parse application/x-www-form-urlencoded (Twilio sends data in this format)
app.use(urlencoded({ extended: false }));
// Parse application/json (if you send JSON)
app.use(json());

// Mount the Twilio webhook routes
app.use('/webhook/twilio', twilioRoutes);

// Export a listen function that wraps app.listen
export function listen(port, callback) {
  app.listen(port, callback);
}

export default app;

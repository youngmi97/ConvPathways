import { listen } from './app.js';
const PORT = process.env.PORT || 3000;

listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

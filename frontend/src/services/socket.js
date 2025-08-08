import { io } from 'socket.io-client';

// IMPORTANT: Use the VITE_API_URL for the WebSocket connection
const URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create and export the socket instance
export const socket = io(URL, {
  autoConnect: false // We will connect manually in the component
});
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // Import Node's built-in http module
import { Server } from 'socket.io'; // Import Server from socket.io
import connectDB from './config/db.js';
import conversationRoutes from './routes/conversations.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Create a new socket.io server and attach it to the http server
// CRITICAL: Configure CORS for socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // For simplicity, allow all origins. For production, you'd list your Vercel URL.
    methods: ["GET", "POST"]
  }
});

// Middleware to attach the io instance to each request
// This allows our controllers to access it and emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use the conversation routes
app.use('/api', conversationRoutes);

// --- WebSocket Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

// IMPORTANT: Use `server.listen` instead of `app.listen`
server.listen(PORT, () => console.log(`Server running with WebSocket support on port ${PORT}`));
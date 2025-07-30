import express, { Request, Response } from 'express';
import http from 'http';
import notesRouter from './routes/notes';
import authRouter from './routes/auth';
import { authMiddleware } from './middleware/auth';
import { createWebSocketServer } from './websocket';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', authMiddleware, notesRouter); // Secure the notes routes

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running' });
});

const server = http.createServer(app);

// Initialize WebSocket server
createWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

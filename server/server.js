import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes.js';
import { setupSocket } from './socket/gameSocket.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);

// Socket.IO setup
setupSocket(httpServer);

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

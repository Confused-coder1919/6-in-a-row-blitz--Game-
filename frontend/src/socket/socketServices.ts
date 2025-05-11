import { io, Socket } from 'socket.io-client';
import type { Game } from '../Types/GameTypes';

// Initialize Socket.IO client
const socket: Socket = io('https://six-in-a-row-blitz-game-da5x.onrender.com');

export const setupSocketListeners = (
  onConnect: () => void,
  onDisconnect: () => void,
  onGameState: (gameState: Game) => void,
  onPlayerDisconnected: (data: { playerNumber: number }) => void,
  onError: (data: { message: string }) => void
) => {
  socket.on('connect', () => {
    onConnect();
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    onDisconnect();
    console.log('Disconnected from server');
  });

  socket.on('gameState', (updatedGameState: Game) => {
    onGameState(updatedGameState);
  });

  socket.on('playerDisconnected', ({ playerNumber }) => {
    onPlayerDisconnected({ playerNumber });
  });

  socket.on('error', ({ message }) => {
    onError({ message });
  });

  // Return cleanup function
  return () => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('gameState');
    socket.off('playerDisconnected');
    // socket.off('error');
  };
};

export const connectToGame = (gameId: string, password: string) => {
  socket.emit('connectToGame', { gameId, password });
};

export const playMove = (gameId: string, password: string, columnIndex: number) => {
  socket.emit('playMove', { gameId, password, columnIndex });
};

export const disconnectFromGame = (gameId: string | undefined, password: string | undefined) => {
  if (gameId && password) {
    socket.emit('disconnectFromGame', { gameId, password });
  }
};
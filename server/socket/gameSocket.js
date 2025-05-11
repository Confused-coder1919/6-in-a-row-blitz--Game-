import { Server } from 'socket.io';
import { checkWinCondition } from '../gameLogic.js';
import { getGames, getPlayerPasswords } from '../controllers/gameController.js';

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["https://6-in-a-row-blitz-game-five.vercel.app/", "http://localhost:5173"],
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle socket connection for game moves
    socket.on('connectToGame', ({ gameId, password }) => {
      const games = getGames();
      const playerPasswords = getPlayerPasswords();
      const game = games.get(gameId);
      const passwords = playerPasswords.get(gameId);

      if (!game || !passwords) return;

      const isPlayer1 = passwords.player1 === password;
      const isPlayer2 = passwords.player2 === password;
      const playerNumber = isPlayer1 ? 1 : (isPlayer2 ? 2 : null);

      if (!playerNumber) return;

      // Update socket ID for the player
      game.players[playerNumber].socketId = socket.id;
      socket.join(gameId);

      // Start timer if game is ready to play
      if (game.status === 'playing') {
        startTimer(gameId, io);
      }
    });

    socket.on('playMove', ({ gameId, password, columnIndex }) => {
      const games = getGames();
      const playerPasswords = getPlayerPasswords();
      const game = games.get(gameId);
      const passwords = playerPasswords.get(gameId);
      
      if (!game || !passwords) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      if (game.status !== 'playing') {
        return socket.emit('error', { message: 'Game not active' });
      }
      
      const isPlayer1 = passwords.player1 === password;
      const isPlayer2 = passwords.player2 === password;
      const playerNumber = isPlayer1 ? 1 : (isPlayer2 ? 2 : null);
      
      if (!playerNumber) {
        return socket.emit('error', { message: 'Invalid password' });
      }
      
      if (playerNumber !== game.currentPlayer) {
        return socket.emit('error', { message: 'Not your turn' });
      }
      
      if (columnIndex < 0 || columnIndex >= 15) {
        return socket.emit('error', { message: 'Invalid column' });
      }
      
      let rowIndex = 14;
      while (rowIndex >= 0 && game.board[rowIndex][columnIndex] !== null) {
        rowIndex--;
      }
      
      if (rowIndex < 0) {
        return socket.emit('error', { message: 'Column is full' });
      }
      
      game.board[rowIndex][columnIndex] = playerNumber;
      game.movesLeft--;
      
      if (checkWinCondition(game.board, rowIndex, columnIndex, playerNumber)) {
        game.status = 'ended';
        game.winner = playerNumber;
        io.to(gameId).emit('gameState', game);
        return;
      }
      
      if (game.movesLeft === 0) {
        game.currentPlayer = game.currentPlayer === 1 ? 2 : 1;
        game.movesLeft = 3;
        game.lastMoveTime = Date.now();
      }
      
      io.to(gameId).emit('gameState', game);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      handleDisconnect(socket.id, io);
    });

    socket.on("disconnectFromGame", ({gameId, password}) => {

      const games = getGames();
      const playerPasswords = getPlayerPasswords();
      const game = games.get(gameId);
      const passwords = playerPasswords.get(gameId);
      if (!game || !passwords) {
        return socket.emit('error', { message: 'Game not found.' });
      }

      const isPlayer1 = passwords.player1 === password;
      const isPlayer2 = passwords.player2 === password;

      if( isPlayer2 && game.status === 'playing') {
        game.status = 'ended';
        game.winner = 1;
        io.to(gameId).emit('gameState', game);
      }else if( isPlayer1 && game.status === 'playing') {
        game.status = 'ended';
        game.winner = 2;
        io.to(gameId).emit('gameState', game);
      }

      games.delete(gameId);
      playerPasswords.delete(gameId);
      socket.leave(gameId);
      io.to(gameId).emit('gameState', game);
      console.log(`Game ${gameId} deleted`);

    })
    
  });

  return io;
}

function handleDisconnect(socketId, io) {
  const games = getGames();
  
  for (const [gameId, game] of games.entries()) {
    if (
      (game.players[1]?.socketId === socketId || 
       game.players[2]?.socketId === socketId) &&
      game.status === 'playing'
    ) {
      const disconnectedPlayer = game.players[1]?.socketId === socketId ? 1 : 2;
      const winningPlayer = disconnectedPlayer === 1 ? 2 : 1;
      
      game.status = 'ended';
      game.winner = winningPlayer;
      
      io.to(gameId).emit('gameState', game);
      io.to(gameId).emit('playerDisconnected', { playerNumber: disconnectedPlayer });
     
      games.delete(gameId);
      console.log(`Game ${gameId} deleted because player ${disconnectedPlayer} disconnected.`);
   }else if(game.players[1]?.socketId === socketId && game.status === 'waiting') {
      games.delete(gameId);
      io.to(gameId).emit('gameState', game);
      console.log(`Game ${gameId} deleted because player 1 disconnected.`);
   }
  }
  
  
}

function startTimer(gameId, io) {
  const games = getGames();
  const game = games.get(gameId);
  if (!game || game.status !== 'playing') return;
  
  const timerInterval = setInterval(() => {
    const game = games.get(gameId);
    
    if (!game || game.status !== 'playing') {
      clearInterval(timerInterval);
      return;
    }
    
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - game.lastMoveTime) / 1000);
    
    game.players[game.currentPlayer].timeRemaining -= 1;
    
    if (game.players[game.currentPlayer].timeRemaining <= 0) {
      game.status = 'ended';
      game.winner = game.currentPlayer === 1 ? 2 : 1;
      game.players[game.currentPlayer].timeRemaining = 0;
      
      io.to(gameId).emit('gameState', game);
      clearInterval(timerInterval);
      return;
    }
    
    game.lastMoveTime = currentTime;
    io.to(gameId).emit('gameState', game);
  }, 1000);
}
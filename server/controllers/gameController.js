import { v4 as uuidv4 } from 'uuid';

// In-memory storage
const games = new Map();
const playerPasswords = new Map();

export const createGame = (req, res) => {
  try {
    const { playerName, timeLimit } = req.body;
    const gameId = uuidv4();
    const player1Password = uuidv4();

    // Create game state
    const gameState = {
      id: gameId,
      board: Array(15).fill().map(() => Array(15).fill(null)),
      currentPlayer: 1,
      players: {
        1: {
          name: playerName,
          timeRemaining: parseInt(timeLimit, 10),
          socketId: null
        },
        2: {
          name: null,
          timeRemaining: parseInt(timeLimit, 10),   // convert string to number 10(decimal) based
          socketId: null
        }
      },
      timeLimit: parseInt(timeLimit, 10),
      movesLeft: 3,
      status: 'waiting',
      lastMoveTime: Date.now(),
      winner: null
    };

    // Store game state and password
    games.set(gameId, gameState);
    playerPasswords.set(gameId, {
      player1: player1Password,
      player2: null
    });

    res.status(201).json({
      gameId,
      password: player1Password,
      gameState
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
  }
};

export const joinGame = (req, res) => {
  try {
    const { gameId, playerName } = req.body;
    const game = games.get(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found.' });
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ error: 'Game already started or ended' });
    }

    // Generate password for player 2
    const player2Password = uuidv4();
    const passwords = playerPasswords.get(gameId);

    // Update game state
    game.players[2].name = playerName;
    game.status = 'playing';
    game.lastMoveTime = Date.now();

    // Update password map
    playerPasswords.set(gameId, {
      ...passwords,
      player2: player2Password
    });

    res.status(200).json({
      gameId,
      password: player2Password,
      gameState: game,
      playerNumber: 2
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join game' });
  }
};

export const getAvailableGames = (req, res) => {
  try {
    const availableGames = [];

    for (const [id, game] of games.entries()) {
      if (game.status === 'waiting' && game.players) {
        availableGames.push({
          id,
          creatorName: game.players[1].name,
          timeLimit: game.timeLimit
        });
      }
    }

    res.status(200).json(availableGames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available games' });
  }
};

export const getGames = () => games;
export const getPlayerPasswords = () => playerPasswords;
// Player information
export interface Player {
  name: string | null;
  timeRemaining: number;
  socketId: string | null;
}

// Game state interface
export interface Game {
  id: string;
  board: (number | null)[][];
  currentPlayer: 1 | 2;
  players: {
    1: Player;
    2: Player;
  };
  timeLimit: number;
  movesLeft: number;
  status: 'waiting' | 'playing' | 'ended';
  lastMoveTime: number;
  winner: number | null;
}

// Player credentials
export interface PlayerCredentials {
  gameId: string;
  password: string;
}
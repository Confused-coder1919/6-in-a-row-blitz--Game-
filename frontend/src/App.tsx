import { useState, useEffect } from 'react';
import GameMenu from './components/GameMenu';
import GameBoard from './components/GameBoard';
import type { Game, PlayerCredentials } from './Types/GameTypes';
import { setupSocketListeners, connectToGame, playMove, disconnectFromGame } from './socket/socketServices';

// API base URL
const API_URL = 'http://localhost:3001/api/games';

function App() {
  const [connected, setConnected] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [gameState, setGameState] = useState<Game | null>(null);
  const [credentials, setCredentials] = useState<PlayerCredentials | null>(null);
  const [playerNumber, setPlayerNumber] = useState<1 | 2 | null>(null);
  const [availableGames, setAvailableGames] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch available games periodically
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/available`);
        const games = await response.json();
        setAvailableGames(games);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      }
    };

    // Initial fetch
    fetchGames();

    // Poll every 1 second
    const interval = setInterval(fetchGames, 1000);

    return () => clearInterval(interval);
  }, []);

  // Setup socket event listeners
  useEffect(() => {
    const cleanup = setupSocketListeners(
      () => setConnected(true),
      () => setConnected(false),
      (updatedGameState) => setGameState(updatedGameState),
      ({ playerNumber }) => setError(`Player ${playerNumber} has disconnected.`),
      ({ message }) => {
        setError(message);
        setTimeout(() => setError(null), 3000);
      }
    );

    return cleanup;
  }, []);

  // Function to create a new game
  const createGame = async (playerName: string, timeLimit: number) => {
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName, timeLimit }),
      });

      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      const data = await response.json();
      
      setCredentials({ gameId: data.gameId, password: data.password });
      setGameState(data.gameState);
      setInGame(true);
      setPlayerNumber(1);

      // Connect socket to the game
      connectToGame(data.gameId, data.password);
    } catch (error) {
      setError('Failed to create game');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Function to join an existing game
  const joinGame = async (gameId: string, playerName: string) => {
    try {
      const response = await fetch(`${API_URL}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId, playerName }),
      });

      if (!response.ok) {
        throw new Error('Failed to join game');
      }

      const data = await response.json();
      
      setCredentials({ gameId: data.gameId, password: data.password });
      setGameState(data.gameState);
      setInGame(true);
      setPlayerNumber(data.playerNumber);

      // Connect socket to the game
      connectToGame(data.gameId, data.password);
    } catch (error) {
      setError('Failed to join game');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Function to make a move
  const makeMove = (columnIndex: number) => {
    if (!credentials) return;
    
    playMove(credentials.gameId, credentials.password, columnIndex);
  };

  // Return to main menu
  const returnToMenu = () => {
    disconnectFromGame(credentials?.gameId, credentials?.password);
    setInGame(false);
    setGameState(null);
    setCredentials(null);
    setPlayerNumber(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-500 mb-2">6 in a Row Blitz</h1>
        <p className="text-gray-300">A fast-paced strategic game</p>
      </header>

     {error && (
        <div className="fixed top-4 right-4 hidden bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )} 
      
      {!inGame && (
        <GameMenu 
          connected={connected}
          availableGames={availableGames}
          onCreateGame={createGame}
          onJoinGame={joinGame}
        />
      )}
      
      {inGame && gameState && playerNumber && (
        <GameBoard 
          gameState={gameState} 
          playerNumber={playerNumber}
          onMakeMove={makeMove}
          onReturnToMenu={returnToMenu}
        />
      )}
    </div>
  );
}

export default App;
import { useState } from 'react';
import { Users, Plus, Timer, User } from 'lucide-react';

interface GameMenuProps {
  connected: boolean;
  availableGames: any[];
  onCreateGame: (playerName: string, timeLimit: number) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ connected, availableGames, onCreateGame, onJoinGame }) => {
  const [view, setView] = useState<'main' | 'create' | 'join'>('main');
  const [playerName, setPlayerName] = useState('');
  const [timeLimit, setTimeLimit] = useState(300);
  const [joinGameId, setJoinGameId] = useState('');
  
  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && timeLimit > 0) {
      onCreateGame(playerName, timeLimit);
    }
  };
  
  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && joinGameId) {
      onJoinGame(joinGameId, playerName);
    }
  };
  
  // Select a game to join
  const selectGame = (gameId: string) => {
    setJoinGameId(gameId);
  };
  
  if (!connected) {
    return (
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">
        <p className="text-lg">Connecting to server...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md">
      {view === 'main' && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome to 6 in a Row Blitz</h2>
          
          <button
            onClick={() => setView('create')}
            className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg transition-colors w-full"
          >
            <Plus size={20} /> Create New Game
          </button>
          
          <button
            onClick={() => setView('join')}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors w-full"
          >
            <Users size={20} /> Join a Game
          </button>
        </div>
      )}
      
      {view === 'create' && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Create New Game</h2>
          
          <form onSubmit={handleCreateGame} className="space-y-4">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="timeLimit" className="block text-sm font-medium mb-1">
                Time Limit (seconds)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Timer size={16} />
                </span>
                <input
                  type="number"
                  id="timeLimit"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  min={30}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setView('main')}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors"
              >
                Create Game
              </button>
            </div>
          </form>
        </div>
      )}
      
      {view === 'join' && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Join a Game</h2>
          
          {availableGames.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400">No games available to join.</p>
              <p className="text-gray-400 text-sm mt-2">Create a new game or wait for someone to host.</p>
            </div>
          ) : (
            <div className="mb-4 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Available Games:</h3>
              <ul className="space-y-2">
                {availableGames.map((game) => (
                  <li 
                    key={game.id}
                    onClick={() => selectGame(game.id)}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      joinGameId === game.id ? 'bg-blue-900 border border-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <p>
                      <span className="font-medium">{game.creatorName}'s game</span>
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Timer size={14} /> {game.timeLimit} seconds
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleJoinGame} className="space-y-4">
            <div>
              <label htmlFor="joinPlayerName" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  id="joinPlayerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setView('main')}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!joinGameId || availableGames.length === 0}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-blue-900 disabled:opacity-50"
              >
                Join Game
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameMenu;
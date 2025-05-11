import React from 'react';
import { Trophy, Clock, Home, Frown } from 'lucide-react';
import type { Game } from '../Types/GameTypes';

interface GameOverModalProps {
  gameState: Game;
  playerNumber: 1 | 2;
  onClose: () => void;
  onReturnToMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  playerNumber,
  onClose,
  onReturnToMenu
}) => {
  // Determine if the current player won
  const isWinner = gameState.winner === playerNumber;
  
  // Get the reason for the game ending
  const getEndReason = () => {
    if (gameState.winner) {
      const winnerName = gameState.players[gameState.winner as 1 | 2].name;
      const isTimeout = gameState.players[gameState.winner === 1 ? 2 : 1].timeRemaining <= 0;
      
      if (isTimeout) {
        return `${winnerName} won by timeout!`;
      } else {
        return `${winnerName} connected 6 in a row!`;
      }
    }
    return "Game ended";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md transform animate-scale-in">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {isWinner ? (
              <Trophy className="text-yellow-500 w-16 h-16" />
            ) : (
              <Frown className="text-gray-500 w-16 h-16" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {isWinner ? 'You Won!' : 'You Lost!'}
          </h2>
          
          <p className="text-gray-300">{getEndReason()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-400 mb-1">Your Time</p>
            <div className="font-mono text-lg flex items-center justify-center gap-1">
              <Clock size={16} />
              {Math.floor(gameState.players[playerNumber].timeRemaining / 60)}:
              {(gameState.players[playerNumber].timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-400 mb-1">Opponent's Time</p>
            <div className="font-mono text-lg flex items-center justify-center gap-1">
              <Clock size={16} />
              {Math.floor(gameState.players[playerNumber === 1 ? 2 : 1].timeRemaining / 60)}:
              {(gameState.players[playerNumber === 1 ? 2 : 1].timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            Close
          </button>
          
          <button
            onClick={onReturnToMenu}
            className="flex-1 py-2 px-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Home size={16} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
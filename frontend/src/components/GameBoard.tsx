import React, { useState, useEffect } from 'react';
import { Home, Trophy, User } from 'lucide-react';
import GameCell from './GameCell';
import Timer from './Timer';
import GameOverModal from './GameOverModal';
import type { Game } from '../Types/GameTypes';

interface GameBoardProps {
  gameState: Game;
  playerNumber: 1 | 2;
  onMakeMove: (columnIndex: number) => void;
  onReturnToMenu: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  playerNumber, 
  onMakeMove,
  onReturnToMenu
}) => {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  
  // Player colors
  const playerColors = {
    1: 'bg-red-500',
    2: 'bg-yellow-500'
  };

  // Show game over modal when game ends
  useEffect(() => {
    if (gameState.status === 'ended' && !showGameOver) {
      setShowGameOver(true);
    }
  }, [gameState.status, showGameOver]);

  // Check if it's the current player's turn
  const isMyTurn = gameState.currentPlayer === playerNumber;
  
  // Handle column click
  const handleColumnClick = (columnIndex: number) => {
    if (
      gameState.status === 'playing' && 
      isMyTurn && 
      gameState.movesLeft > 0
    ) {
      onMakeMove(columnIndex);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-6 flex flex-col">
      {/* Game information section */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Player 1 info */}
        <div className={`p-3 rounded-lg flex flex-col sm:flex-row items-center ${gameState.currentPlayer === 1 ? 'bg-gray-700' : 'bg-gray-800'}`}>
          <div className={`w-6 h-6 rounded-full ${playerColors[1]} mr-2`}></div>
          <div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span className="font-medium">{gameState.players[1].name}</span>
              {playerNumber === 1 && <span className="text-xs text-gray-400 ml-1">(You)</span>}
            </div>
            <Timer 
              time={gameState.players[1].timeRemaining} 
              isActive={gameState.currentPlayer === 1 && gameState.status === 'playing'} 
            />
          </div>
        </div>
        
        {/* Game status */}
        <div className="bg-gray-800 p-3 rounded-lg text-center">
          {gameState.status === 'waiting' ? (
            <p>Waiting for opponent...</p>
          ) : gameState.status === 'playing' ? (
            <div>
              <p className="text-lg font-medium mb-1">
                {gameState.currentPlayer === playerNumber ? 'Your turn' : "Opponent's turn"}
              </p>
              <p className="text-sm text-gray-400">
                {gameState.movesLeft} {gameState.movesLeft === 1 ? 'move' : 'moves'} left
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              <p className="font-medium">Game Over</p>
            </div>
          )}
        </div>
        
        {/* Player 2 info */}
        <div className={`p-3 rounded-lg flex flex-col sm:flex-row items-center ${gameState.currentPlayer === 2 ? 'bg-gray-700' : 'bg-gray-800'}`}>
          <div className={`w-6 h-6 rounded-full ${playerColors[2]} mr-2`}></div>
          <div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span className="font-medium">
                {gameState.players[2].name || 'Waiting...'}
              </span>
              {playerNumber === 2 && <span className="text-xs text-gray-400 ml-1">(You)</span>}
            </div>
            <Timer 
              time={gameState.players[2].timeRemaining} 
              isActive={gameState.currentPlayer === 2 && gameState.status === 'playing'} 
            />
          </div>
        </div>
      </div>
      
      {/* Game board */}
      <div className="relative bg-gray-800 p-4 rounded-lg">
        <div 
          className="grid grid-cols-15 gap-3 m-auto w-full max-w-3xl"
          style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}
        >
          {gameState.board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <GameCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isHovered={colIndex === hoveredColumn}
                playerColors={playerColors}
                onClick={() => handleColumnClick(colIndex)}
                onMouseEnter={() => isMyTurn && gameState.status === 'playing' ? setHoveredColumn(colIndex) : null}
                onMouseLeave={() => setHoveredColumn(null)}
              />
            ))
          ))}
        </div>   

        {/* Column hover indicators */}
        {hoveredColumn !== null && isMyTurn && gameState.status === 'playing' && (
          <div 
            className="absolute top-0 h-full transition-all duration-300 ease-in-out border-t-4 border-white opacity-25"
            style={{ 
              left: `calc((100% / 15) * ${hoveredColumn} + 1rem)`, 
              width: `calc(100% / 15 - 0.5rem)`,
              pointerEvents: 'none'
            }}
          ></div>
        )}
      </div>
      
      {/* Back button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onReturnToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
        >
          <Home size={16} /> Return to Menu
        </button>
      </div>
      
      {/* Game over modal */}
      {showGameOver && (
        <GameOverModal
          gameState={gameState}
          playerNumber={playerNumber}
          onClose={() => {setShowGameOver(false); onReturnToMenu() }}
          onReturnToMenu={onReturnToMenu}
        />
      )}
    </div>
  );
};

export default GameBoard;
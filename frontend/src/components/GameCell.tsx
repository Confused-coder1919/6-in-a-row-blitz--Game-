import React from 'react';

interface GameCellProps {
  value: number | null;
  isHovered: boolean;
  playerColors: Record<number, string>;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const GameCell: React.FC<GameCellProps> = ({
  value,
  isHovered,
  playerColors,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      className={`aspect-square bg-gray-700 rounded-md flex items-center justify-center cursor-pointer transition-all duration-90 ${
        isHovered ? 'bg-gray-600' : ''
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {value !== null && (
        <div
          className={`w-4/5 h-4/5 rounded-full ${playerColors[value]} animate-drop shadow-md`}
          style={{
            animationDuration: '300ms',
          }}
        ></div>
      )}
    </div>
  );
};

export default GameCell;
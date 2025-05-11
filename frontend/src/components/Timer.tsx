import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  time: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ time, isActive }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  
  // Determine color based on time remaining
  let textColor = 'text-white';
  if (time <= 30) {
    textColor = 'text-red-500';
  } else if (time <= 60) {
    textColor = 'text-yellow-500';
  }
  
  return (
    <div className={`flex items-center gap-1 ${textColor} ${isActive ? 'animate-pulse' : ''}`}>
      <Clock size={14} />
      <span className="font-mono">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
};

export default Timer;
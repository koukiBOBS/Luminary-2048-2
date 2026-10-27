import React from 'react';
import { TileData, Theme } from '../types';

interface TileProps {
  tile: TileData;
  theme: Theme;
}

export const Tile: React.FC<TileProps> = ({ tile, theme }) => {
  // 100% / 4 = 25% per cell
  const x = tile.col * 25;
  const y = tile.row * 25;

  const colorClass = theme.tileColors[tile.value] || theme.tileColors[2048] || 'bg-gray-900';
  const textColorClass = theme.tileTextColors[tile.value] || 'text-white';
  
  // Font sizing based on number length
  const digits = tile.value.toString().length;
  let fontSize = 'text-3xl sm:text-4xl';
  if (digits === 3) fontSize = 'text-2xl sm:text-3xl';
  if (digits === 4) fontSize = 'text-xl sm:text-2xl';
  if (digits >= 5) fontSize = 'text-base sm:text-lg';

  return (
    <div
      className="absolute transition-transform duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] p-1 sm:p-2 will-change-transform pointer-events-none"
      style={{
        width: '25%',
        height: '25%',
        transform: `translate3d(${x * 4}%, ${y * 4}%, 0)`,
        left: 0,
        top: 0,
        zIndex: tile.isMerged ? 20 : (tile.isDying ? 5 : 10), 
      }}
    >
      <div
        className={`
          w-full h-full rounded-2xl sm:rounded-3xl flex items-center justify-center font-black select-none
          shadow-md transition-all duration-300
          ${colorClass} ${textColorClass} ${fontSize}
          ${tile.isNew ? 'animate-pop' : ''}
          ${tile.isMerged ? 'animate-merge' : ''}
        `}
      >
        {tile.value}
      </div>
    </div>
  );
};
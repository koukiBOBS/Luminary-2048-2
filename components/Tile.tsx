import React from 'react';
import { TileData, Theme } from '../types';

interface TileProps {
  tile: TileData;
  theme: Theme;
}

export const Tile: React.FC<TileProps> = ({ tile, theme }) => {
  // Calculate position percentage
  // 100% / 4 = 25%.
  const x = tile.col * 25;
  const y = tile.row * 25;

  const colorClass = theme.tileColors[tile.value] || theme.tileColors[2048] || 'bg-gray-900';
  const textColorClass = theme.tileTextColors[tile.value] || 'text-white';
  
  // Font sizing based on number length
  const digits = tile.value.toString().length;
  let fontSize = 'text-3xl md:text-4xl';
  if (digits === 3) fontSize = 'text-2xl md:text-3xl';
  if (digits >= 4) fontSize = 'text-xl md:text-2xl';

  return (
    <div
      className="absolute transition-transform duration-200 ease-in-out p-1 md:p-2"
      style={{
        width: '25%',
        height: '25%',
        transform: `translate(${x*4}%, ${y*4}%)`, // x*4 because x is 25, 50 etc. 25*4 = 100%
        left: 0,
        top: 0,
        zIndex: tile.isMerged ? 20 : 10, 
      }}
    >
      <div
        className={`
          w-full h-full rounded-lg md:rounded-xl flex items-center justify-center font-bold shadow-sm select-none
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
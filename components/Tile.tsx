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

  // Milestone styling for high-tier tiles (1024, 2048, and beyond)
  let milestoneClass = '';
  if (tile.value === 1024) {
    milestoneClass = 'ring-2 ring-amber-300/60 shadow-lg shadow-amber-500/20';
  } else if (tile.value === 2048) {
    milestoneClass = 'animate-tile-glow ring-2 ring-yellow-300/90 shadow-xl shadow-yellow-500/40';
  } else if (tile.value > 2048) {
    milestoneClass = 'animate-tile-glow ring-2 ring-violet-400/90 shadow-xl shadow-purple-500/40';
  }

  return (
    <div
      className={`absolute transition-[transform,opacity] duration-140 ease-[cubic-bezier(0.22,1,0.36,1)] p-1 sm:p-2 will-change-transform pointer-events-none ${
        tile.isDying ? 'opacity-0 scale-95 duration-120' : 'opacity-100 scale-100'
      }`}
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
          shadow-md transition-[background-color,color,box-shadow] duration-200
          ${colorClass} ${textColorClass} ${fontSize} ${milestoneClass}
          ${tile.isNew ? 'animate-pop' : ''}
          ${tile.isMerged ? 'animate-merge' : ''}
        `}
      >
        {tile.value}
      </div>
    </div>
  );
};
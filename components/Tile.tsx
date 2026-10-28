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
    milestoneClass = 'animate-tile-glow-subtle';
  } else if (tile.value === 2048) {
    milestoneClass = 'animate-tile-glow';
  } else if (tile.value > 2048) {
    milestoneClass = 'animate-tile-super-glow';
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
      {/* Outer animation wrapper for pop / merge scaling */}
      <div
        className={`w-full h-full ${tile.isNew ? 'animate-pop' : ''} ${tile.isMerged ? 'animate-merge' : ''}`}
      >
        {/* Tile face with dynamic theme glow custom properties */}
        <div
          className={`
            w-full h-full rounded-2xl sm:rounded-3xl flex items-center justify-center font-black select-none
            shadow-md transition-[background-color,color] duration-200
            ${colorClass} ${textColorClass} ${fontSize} ${milestoneClass}
          `}
          style={{
            ['--tile-glow-rgb' as any]: theme.glowRgb,
            ['--tile-glow-super-rgb' as any]: theme.glowSuperRgb || theme.glowRgb,
          }}
        >
          {tile.value}
        </div>
      </div>
    </div>
  );
};
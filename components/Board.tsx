import React from 'react';
import { TileData, Theme, Language } from '../types';
import { GRID_SIZE, TRANSLATIONS } from '../constants';
import { Tile } from './Tile';

interface BoardProps {
  tiles: TileData[];
  theme: Theme;
  gameOver: boolean;
  won: boolean;
  onTryAgain: () => void;
  onKeepGoing: () => void;
  lang: Language;
}

export const Board: React.FC<BoardProps> = ({ 
  tiles, 
  theme, 
  gameOver, 
  won, 
  onTryAgain,
  onKeepGoing,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  // Create background grid cells
  const gridCells = Array(GRID_SIZE * GRID_SIZE).fill(0);

  return (
    <div className={`relative w-full aspect-square rounded-xl md:rounded-2xl p-1 md:p-2 shadow-inner ${theme.gridBg}`}>
        {/* Background Grid - No Gap, use Padding to match Tile component */}
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
          {gridCells.map((_, i) => (
            <div 
              key={i} 
              className="w-full h-full p-1 md:p-2" // Matches Tile.tsx padding
            >
              <div className={`w-full h-full rounded-lg md:rounded-xl ${theme.emptyCellBg}`} />
            </div>
          ))}
        </div>

        {/* Floating Tiles */}
        <div className="absolute inset-0 p-1 md:p-2">
            <div className="relative w-full h-full">
                {tiles.map(tile => (
                    <Tile key={tile.id} tile={tile} theme={theme} />
                ))}
            </div>
        </div>

        {/* Overlay for Game Over / Won */}
        {(gameOver || won) && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl animate-pop">
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${theme.textColor}`}>
              {won ? t.youWin : t.gameOver}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={onTryAgain}
                className={`px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition ${theme.buttonBg} ${theme.buttonText}`}
              >
                {t.tryAgain}
              </button>
              {won && (
                 <button
                 onClick={onKeepGoing}
                 className={`px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition bg-gray-500 text-white`}
               >
                 {t.keepGoing}
               </button>
              )}
            </div>
          </div>
        )}
      </div>
  );
};
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
  const gridCells = Array(GRID_SIZE * GRID_SIZE).fill(0);

  return (
    <div 
      className={`relative w-full aspect-square rounded-3xl sm:rounded-[36px] p-2 sm:p-3 shadow-xl transition-colors duration-300 cursor-grab active:cursor-grabbing ${theme.gridBg}`}
      style={{
        ['--tile-glow-rgb' as any]: theme.glowRgb,
        ['--tile-glow-super-rgb' as any]: theme.glowSuperRgb || theme.glowRgb,
      }}
    >
      {/* Background Grid Cells */}
      <div className="grid grid-cols-4 grid-rows-4 w-full h-full">
        {gridCells.map((_, i) => (
          <div key={i} className="w-full h-full p-1 sm:p-2">
            <div className={`w-full h-full rounded-2xl sm:rounded-3xl transition-colors duration-300 ${theme.emptyCellBg} shadow-inner opacity-80`} />
          </div>
        ))}
      </div>

      {/* Floating Dynamic Tiles */}
      <div className="absolute inset-0 p-2 sm:p-3">
        <div className="relative w-full h-full">
          {tiles.map(tile => (
            <Tile key={tile.id} tile={tile} theme={theme} />
          ))}
        </div>
      </div>

      {/* Win or Game Over Overlay */}
      {(gameOver || won) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/45 backdrop-blur-md rounded-3xl sm:rounded-[36px] p-6 text-center animate-overlay-in">
          <div className="bg-white/95 dark:bg-slate-900/95 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-xs sm:max-w-sm w-full mx-4 border border-white/20 flex flex-col items-center animate-modal-up">
            {/* SVG Icon instead of emoji */}
            <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10">
              {won ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
                  <path d="M6 4h12v7a6 6 0 0 1-12 0V4z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              {won ? t.youWin : t.gameOver}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              {won ? (lang === 'zh' ? '太棒了！你已成功合成 2048 方块！' : 'You have reached the legendary 2048 tile!') : (lang === 'zh' ? '棋盘已满且无有效移动方向。' : 'No more legal moves left on the board.')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onTryAgain}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 cursor-pointer ${theme.buttonBg} ${theme.buttonText} ${theme.buttonHoverBg || ''}`}
              >
                {t.tryAgain}
              </button>
              {won && (
                <button
                  onClick={onKeepGoing}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold shadow-lg transition-transform active:scale-95 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white"
                >
                  {t.keepGoing}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
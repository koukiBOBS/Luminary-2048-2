import React, { useState, useEffect, useCallback, useRef } from 'react';
import { THEMES, TRANSLATIONS } from './constants';
import { getInitialState, moveTiles } from './services/gameLogic';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { SaveModal } from './components/SaveModal';
import { Direction, GameState, Theme, Language } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [theme, setTheme] = useState<Theme>(THEMES.classic);
  const [lang, setLang] = useState<Language>('en'); // Default language
  const [isKeepGoing, setIsKeepGoing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const movingRef = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[lang];

  // Keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (movingRef.current) return;
    if (isSaveModalOpen) return;
    
    let direction: Direction | null = null;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) direction = 'UP';
    else if (['ArrowDown', 's', 'S'].includes(e.key)) direction = 'DOWN';
    else if (['ArrowLeft', 'a', 'A'].includes(e.key)) direction = 'LEFT';
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) direction = 'RIGHT';

    if (direction) {
      e.preventDefault();
      movingRef.current = true;
      setGameState(prev => moveTiles(prev, direction!));
      setTimeout(() => { movingRef.current = false; }, 150); // Matches animation duration
    }
  }, [isSaveModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    board.addEventListener('touchmove', preventDefault, { passive: false });
    return () => board.removeEventListener('touchmove', preventDefault);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSaveModalOpen) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSaveModalOpen) return;
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) { 
      let direction: Direction | null = null;
      if (absDx > absDy) {
        direction = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        direction = dy > 0 ? 'DOWN' : 'UP';
      }
      
      if (direction) {
         setGameState(prev => moveTiles(prev, direction!));
      }
    }
    touchStartRef.current = null;
  };

  const resetGame = () => {
    setGameState(getInitialState());
    setIsKeepGoing(false);
  };

  const keepGoing = () => {
    setIsKeepGoing(true);
    setGameState(prev => ({ ...prev, won: false }));
  };
  
  const handleLoadGame = (newState: GameState) => {
    setGameState(newState);
    setIsKeepGoing(false);
  };

  const showWon = gameState.won && !isKeepGoing;
  const showOver = gameState.over;

  return (
    <div 
      className={`fixed inset-0 w-full h-full flex items-center justify-center p-4 transition-colors duration-500 ${theme.appBg} overflow-hidden`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full flex flex-col landscape:flex-row items-center justify-center gap-6 md:gap-12 landscape:gap-8 max-w-[500px] landscape:max-w-none">
        
        {/* Left/Top Column: Header, Scores, Controls */}
        <div className="w-full flex flex-col gap-4 landscape:w-72 landscape:h-full landscape:justify-center shrink-0 z-10">
          
          <div className="flex justify-between items-center landscape:flex-col landscape:items-start landscape:gap-4">
             <h1 className={`text-5xl md:text-6xl font-extrabold ${theme.textColor} landscape:text-5xl xl:text-7xl`}>2048</h1>
             
             <div className="flex gap-2 w-full landscape:justify-start">
                <div className={`${theme.scoreBg} flex-1 p-2 px-3 rounded-xl min-w-[70px] text-center shadow-sm`}>
                   <div className={`text-[10px] font-bold uppercase ${theme.scoreText} opacity-70`}>{t.score}</div>
                   <div className={`text-xl font-bold ${theme.scoreText}`}>{gameState.score}</div>
                </div>
                <div className={`${theme.scoreBg} flex-1 p-2 px-3 rounded-xl min-w-[70px] text-center shadow-sm`}>
                   <div className={`text-[10px] font-bold uppercase ${theme.scoreText} opacity-70`}>{t.best}</div>
                   <div className={`text-xl font-bold ${theme.scoreText}`}>{gameState.bestScore}</div>
                </div>
             </div>
          </div>

          <ControlPanel 
            onNewGame={resetGame} 
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            currentTheme={theme} 
            setTheme={setTheme}
            lang={lang}
            setLang={setLang}
          />
          
          <div className={`hidden landscape:block mt-auto text-left ${theme.textColor} opacity-60 text-xs font-medium`}>
             <p>{t.howToPlay}</p>
             <p>{t.howToPlay2}</p>
          </div>
        </div>

        {/* Right/Bottom Column: Board */}
        {/* 
            Board container constraints:
            Portrait: Width drives size (w-full). Height is determined by Board's aspect-square.
            Landscape: Height drives size (h-[85vh]). Width is determined by aspect-square.
        */}
        <div 
            ref={boardRef}
            className="relative shrink-0 w-full max-w-[500px] portrait:max-w-[65vh] landscape:h-[85vh] landscape:w-auto landscape:aspect-square landscape:max-w-none landscape:max-h-[90vw]"
        >
          <Board 
            tiles={gameState.tiles} 
            theme={theme} 
            gameOver={showOver} 
            won={showWon}
            onTryAgain={resetGame}
            onKeepGoing={keepGoing}
            lang={lang}
          />
        </div>
        
        {/* Mobile Portrait Instructions */}
        <div className={`landscape:hidden mt-2 text-center ${theme.textColor} opacity-60 text-sm font-medium z-10`}>
           <p>{t.howToPlayMobile}</p>
        </div>

      </div>
      
      <SaveModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        gameState={gameState} 
        onLoadGame={handleLoadGame} 
        theme={theme}
        lang={lang}
      />
    </div>
  );
}

export default App;
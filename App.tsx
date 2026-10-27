import React, { useState, useEffect, useCallback, useRef } from 'react';
import { THEMES, TRANSLATIONS } from './constants';
import { getInitialState, moveTiles, undoMove, restoreIdCounter } from './services/gameLogic';
import { sound } from './services/soundService';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { SaveModal } from './components/SaveModal';
import { SettingsModal } from './components/SettingsModal';
import { Direction, GameState, Theme, Language } from './types';

function App() {
  // Theme state with local persistence
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedThemeId = localStorage.getItem('luminary2048-theme');
      if (savedThemeId && THEMES[savedThemeId]) {
        return THEMES[savedThemeId];
      }
    } catch {
      // fallback
    }
    return THEMES.classic;
  });

  // Language state with browser preference detection
  const [lang, setLang] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('luminary2048-lang');
      if (savedLang === 'zh' || savedLang === 'en') return savedLang;
      if (typeof navigator !== 'undefined' && navigator.language?.startsWith('zh')) {
        return 'zh';
      }
    } catch {
      // fallback
    }
    return 'zh';
  });

  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [isKeepGoing, setIsKeepGoing] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [recentScoreGain, setRecentScoreGain] = useState<number | null>(null);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const movingRef = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];
  const isModalOpen = isSaveModalOpen || isSettingsModalOpen;

  // Persist theme & lang
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('luminary2048-theme', newTheme.id);
    } catch {
      // ignore
    }
  };

  // Synchronize dark class to document root for Tailwind dark mode
  useEffect(() => {
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.isDark]);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('luminary2048-lang', newLang);
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  // Perform directional move
  const executeMove = useCallback((direction: Direction) => {
    if (movingRef.current) return;
    if (gameState.over) return;

    movingRef.current = true;
    setGameState(prev => {
      const result = moveTiles(prev, direction);
      if (result.moved) {
        if (result.scoreToAdd > 0) {
          sound.playMerge(result.scoreToAdd);
          setRecentScoreGain(result.scoreToAdd);
          setTimeout(() => setRecentScoreGain(null), 800);
        } else {
          sound.playMove();
        }

        if (result.nextState.won && !prev.won) {
          sound.playWin();
        }
      }
      return result.nextState;
    });

    setTimeout(() => {
      movingRef.current = false;
    }, 150);
  }, [gameState.over]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isModalOpen) return;
    
    let direction: Direction | null = null;
    if (['ArrowUp', 'w', 'W'].includes(e.key)) direction = 'UP';
    else if (['ArrowDown', 's', 'S'].includes(e.key)) direction = 'DOWN';
    else if (['ArrowLeft', 'a', 'A'].includes(e.key)) direction = 'LEFT';
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) direction = 'RIGHT';

    if (direction) {
      e.preventDefault();
      executeMove(direction);
    }
  }, [isModalOpen, executeMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent default scroll on board touch
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const preventScroll = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    board.addEventListener('touchmove', preventScroll, { passive: false });
    return () => board.removeEventListener('touchmove', preventScroll);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isModalOpen) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isModalOpen || !touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 25) { 
      let direction: Direction | null = null;
      if (absDx > absDy) {
        direction = dx > 0 ? 'RIGHT' : 'LEFT';
      } else {
        direction = dy > 0 ? 'DOWN' : 'UP';
      }
      
      if (direction) {
        executeMove(direction);
      }
    }
    touchStartRef.current = null;
  };

  const resetGame = () => {
    setGameState(getInitialState());
    setIsKeepGoing(false);
  };

  const handleUndo = () => {
    setGameState(prev => undoMove(prev));
    sound.playMove();
  };

  const keepGoing = () => {
    setIsKeepGoing(true);
    setGameState(prev => ({ ...prev, won: false }));
  };
  
  const handleLoadGame = (newState: GameState) => {
    restoreIdCounter(newState.tiles);
    setGameState(newState);
    setIsKeepGoing(false);
  };

  const showWon = gameState.won && !isKeepGoing;
  const showOver = gameState.over;

  return (
    <div 
      className={`fixed inset-0 w-full h-full flex items-center justify-center p-3 sm:p-5 transition-colors duration-500 ${theme.appBg} overflow-hidden select-none`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full flex flex-col landscape:flex-row items-center justify-center gap-4 sm:gap-6 landscape:gap-8 max-w-[460px] landscape:max-w-none">
        
        {/* Left / Top Column: Header, Scores, Controls */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 landscape:w-80 landscape:h-full landscape:justify-center shrink-0 z-10">
          
          {/* Header Row: Title & Scores */}
          <div className="flex items-center justify-between landscape:flex-col landscape:items-start landscape:gap-3">
            <div className="flex items-baseline gap-2">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${theme.textColor}`}>
                2048
              </h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 ${theme.textColor} opacity-75`}>
                {lang === 'zh' ? theme.nameZh : theme.name}
              </span>
            </div>
             
            {/* Score & Best Cards */}
            <div className="flex gap-2 min-w-[170px] sm:min-w-[190px]">
              {/* Score */}
              <div className={`relative ${theme.scoreBg} flex-1 py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-2xl text-center shadow-sm`}>
                <div className={`text-[10px] font-black uppercase tracking-wider ${theme.scoreText} opacity-75`}>
                  {t.score}
                </div>
                <div className={`text-lg sm:text-xl font-black ${theme.scoreText}`}>
                  {gameState.score}
                </div>
                {/* Floating Score Popup */}
                {recentScoreGain && (
                  <div className="absolute -top-3 right-2 text-xs font-black text-emerald-500 animate-pop">
                    +{recentScoreGain}
                  </div>
                )}
              </div>

              {/* Best */}
              <div className={`${theme.scoreBg} flex-1 py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-2xl text-center shadow-sm`}>
                <div className={`text-[10px] font-black uppercase tracking-wider ${theme.scoreText} opacity-75`}>
                  {t.best}
                </div>
                <div className={`text-lg sm:text-xl font-black ${theme.scoreText}`}>
                  {gameState.bestScore}
                </div>
              </div>
            </div>
          </div>

          {/* Rounded Control Panel with 8 Themes */}
          <ControlPanel 
            onNewGame={resetGame}
            onUndo={handleUndo}
            canUndo={(gameState.history?.length || 0) > 0}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            currentTheme={theme} 
            setTheme={handleSetTheme}
            lang={lang}
            setLang={handleSetLang}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
          
          {/* Landscape Instructions */}
          <div className={`hidden landscape:block mt-auto text-left ${theme.textColor} opacity-60 text-xs font-medium`}>
            <p className="font-bold">{t.howToPlay}</p>
            <p>{t.howToPlay2}</p>
          </div>
        </div>

        {/* Right / Bottom Column: Game Board */}
        <div 
          ref={boardRef}
          className="relative shrink-0 w-full max-w-[420px] portrait:max-w-[70vh] landscape:h-[82vh] landscape:w-auto landscape:aspect-square landscape:max-w-none landscape:max-h-[88vw]"
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
        <div className={`landscape:hidden text-center ${theme.textColor} opacity-60 text-xs font-bold z-10`}>
          <p>{t.howToPlayMobile}</p>
        </div>

      </div>
      
      {/* Save / Archive Modal */}
      <SaveModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        gameState={gameState} 
        onLoadGame={handleLoadGame} 
        theme={theme}
        lang={lang}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        setTheme={handleSetTheme}
        lang={lang}
        setLang={handleSetLang}
        gameState={gameState}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </div>
  );
}

export default App;
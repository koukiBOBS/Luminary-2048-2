import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTheme, TRANSLATIONS } from './constants';
import { getInitialState, moveTiles, undoMove, restoreIdCounter } from './services/gameLogic';
import { sound } from './services/soundService';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { SaveModal } from './components/SaveModal';
import { SettingsModal } from './components/SettingsModal';
import { Direction, GameState, Language } from './types';

function App() {
  // Theme ID state with local persistence
  const [themeId, setThemeId] = useState<string>(() => {
    try {
      const savedThemeId = localStorage.getItem('luminary2048-theme');
      if (savedThemeId && ['classic', 'ocean', 'forest', 'peach', 'lavender', 'coral'].includes(savedThemeId)) {
        return savedThemeId;
      }
    } catch {
      // fallback
    }
    return 'classic';
  });

  // Day/Night mode state with local persistence and system preference fallback
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('luminary2048-darkmode');
      if (saved !== null) return saved === 'true';
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      }
    } catch {
      // fallback
    }
    return false;
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
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboKey, setComboKey] = useState<number>(0);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const movingRef = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const comboCountRef = useRef<number>(0);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearCombo = useCallback(() => {
    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
      comboTimerRef.current = null;
    }
    comboCountRef.current = 0;
    setComboCount(0);
  }, []);

  // Cleanup combo timer on unmount
  useEffect(() => {
    return () => {
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
    };
  }, []);

  const t = TRANSLATIONS[lang];
  const isModalOpen = isSaveModalOpen || isSettingsModalOpen;

  // Active computed theme
  const theme = getTheme(themeId, isDarkMode);

  const handleSelectThemeId = (newId: string) => {
    setThemeId(newId);
    try {
      localStorage.setItem('luminary2048-theme', newId);
    } catch {
      // ignore
    }
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('luminary2048-darkmode', String(next));
      } catch {
        // ignore
      }
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Synchronize dark class to document root for Tailwind dark mode on mount or state change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
          // Clear previous combo countdown and bump combo counter
          if (comboTimerRef.current) {
            clearTimeout(comboTimerRef.current);
          }
          const nextCombo = comboCountRef.current + 1;
          comboCountRef.current = nextCombo;
          setComboCount(nextCombo);
          setComboKey(k => k + 1);

          comboTimerRef.current = setTimeout(() => {
            comboCountRef.current = 0;
            setComboCount(0);
          }, 2200);

          sound.playMerge(result.scoreToAdd, nextCombo);
          setRecentScoreGain(result.scoreToAdd);
          setTimeout(() => setRecentScoreGain(null), 800);
        } else {
          sound.playMove();
        }

        if (result.nextState.over) {
          if (comboTimerRef.current) {
            clearTimeout(comboTimerRef.current);
          }
          comboCountRef.current = 0;
          setComboCount(0);
        } else if (result.nextState.won && !prev.won) {
          sound.playWin();
        }
      }
      return result.nextState;
    });

    setTimeout(() => {
      movingRef.current = false;
    }, 140);
  }, [gameState.over]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isModalOpen) return;
    
    // Ignore keystrokes when typing inside text inputs or textareas
    const target = e.target as HTMLElement;
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
    
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
    // Do not trigger swipe moves when touching interactive buttons or inputs
    const target = e.target as HTMLElement;
    if (target && target.closest('button, input, textarea, a, select')) {
      touchStartRef.current = null;
      return;
    }
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
    clearCombo();
    setGameState(getInitialState());
    setIsKeepGoing(false);
  };

  const handleUndo = () => {
    clearCombo();
    setGameState(prev => undoMove(prev));
    sound.playMove();
  };

  const keepGoing = () => {
    setIsKeepGoing(true);
    setGameState(prev => ({ ...prev, won: false }));
  };
  
  const handleLoadGame = (newState: GameState) => {
    clearCombo();
    restoreIdCounter(newState.tiles);
    setGameState(newState);
    setIsKeepGoing(false);
  };

  const showWon = gameState.won && !isKeepGoing;
  const showOver = gameState.over;

  return (
    <div 
      className={`fixed inset-0 w-full h-full flex items-center justify-center p-3 sm:p-5 transition-colors duration-500 ${theme.appBg} overflow-hidden select-none`}
      style={{
        ['--tile-glow-rgb' as any]: theme.glowRgb,
        ['--tile-glow-super-rgb' as any]: theme.glowSuperRgb || theme.glowRgb,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full flex flex-col landscape:flex-row items-center justify-center gap-4 sm:gap-6 landscape:gap-8 max-w-[460px] landscape:max-w-none">
        
        {/* Left / Top Column: Header, Scores, Controls */}
        <div className="w-full flex flex-col gap-3 sm:gap-4 landscape:w-80 landscape:h-full landscape:justify-center shrink-0 z-10">
          
          {/* Header Row: Title & Scores (No theme names) */}
          <div className="flex items-center justify-between landscape:flex-col landscape:items-start landscape:gap-3">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${theme.textColor}`}>
              2048
            </h1>
             
            {/* Score & Best Cards */}
            <div className="flex gap-2 min-w-[170px] sm:min-w-[190px]">
              {/* Score */}
              <div className={`relative ${theme.scoreBg} flex-1 py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-2xl text-center shadow-sm transition-all duration-150 ${recentScoreGain ? 'animate-score-bump' : ''} ${comboCount >= 2 ? 'ring-2 ring-amber-400/60 shadow-amber-500/25' : ''}`}>
                {/* Floating Combo Badge */}
                {comboCount >= 2 && (
                  <div
                    key={`combo-badge-${comboKey}`}
                    className={`absolute -top-3.5 sm:-top-4 -left-2 sm:-left-3 z-20 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full shadow-lg text-white font-black text-[10px] sm:text-xs tracking-wider animate-combo-pop select-none filter drop-shadow-md border border-white/30 whitespace-nowrap overflow-hidden pointer-events-none ${
                      comboCount >= 5
                        ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 shadow-purple-500/40 ring-1 ring-purple-300/50'
                        : comboCount >= 3
                        ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 shadow-orange-500/40 ring-1 ring-orange-300/50'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/40 ring-1 ring-amber-300/50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm animate-pulse leading-none">
                      {comboCount >= 5 ? '⚡' : comboCount >= 3 ? '🔥' : '✨'}
                    </span>
                    <span className="leading-none drop-shadow-sm">{t.combo}</span>
                    <span className="text-yellow-200 font-black text-xs sm:text-sm leading-none drop-shadow-sm">
                      ×{comboCount}
                    </span>
                    {/* Countdown indicator */}
                    <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-white/70 animate-combo-timer rounded-full" />
                  </div>
                )}

                <div className={`text-[10px] font-black uppercase tracking-wider ${theme.scoreText} opacity-75`}>
                  {t.score}
                </div>
                <div className={`text-lg sm:text-xl font-black ${theme.scoreText}`}>
                  {gameState.score}
                </div>
                {/* Floating Score Popup */}
                {recentScoreGain && (
                  <div
                    key={`score-gain-${gameState.score}`}
                    className="absolute -top-1.5 right-2 text-xs sm:text-sm font-black text-emerald-500 dark:text-emerald-400 animate-score-float filter drop-shadow-sm select-none"
                  >
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

          {/* Rounded Control Panel with Tone Swatches & Day/Night Toggle */}
          <ControlPanel 
            onNewGame={resetGame}
            onUndo={handleUndo}
            canUndo={(gameState.history?.length || 0) > 0}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            currentTheme={theme} 
            onSelectThemeId={handleSelectThemeId}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
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
        onSelectThemeId={handleSelectThemeId}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
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
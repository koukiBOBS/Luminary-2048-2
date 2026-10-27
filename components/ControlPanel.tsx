import React from 'react';
import { THEME_SWATCHES, TRANSLATIONS } from '../constants';
import { Theme, Language } from '../types';

interface ControlPanelProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onOpenSaveModal: () => void;
  onOpenSettingsModal: () => void;
  currentTheme: Theme;
  onSelectThemeId: (themeId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onNewGame,
  onUndo,
  canUndo,
  onOpenSaveModal,
  onOpenSettingsModal,
  currentTheme, 
  onSelectThemeId,
  isDarkMode,
  onToggleDarkMode,
  lang,
  setLang,
  isMuted,
  onToggleMute,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="flex flex-col gap-3 w-full relative z-20">
      {/* Primary Action Buttons: New Game & Undo */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className={`py-3 px-4 rounded-2xl font-black shadow-md transition-all active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHoverBg || ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          <span>{t.newGame}</span>
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`py-3 px-4 rounded-2xl font-black shadow-md transition-all active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer ${
            canUndo 
              ? `${currentTheme.secondaryButtonBg} text-white hover:opacity-95 shadow-lg` 
              : 'bg-black/10 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
          }`}
          title={t.undo}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4"/>
            <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
          <span>{t.undo}</span>
        </button>
      </div>

      {/* Tone Swatches Bar + Day/Night Toggle (No Theme Names) */}
      <div className="flex flex-col gap-2 p-2.5 rounded-2xl bg-black/5 dark:bg-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between px-1">
          <span className={`text-[11px] font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5 ${currentTheme.textColor}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
            </svg>
            <span>{t.themeSelector}</span>
          </span>

          {/* Day / Night Mode Switch Button with SVG */}
          <button
            onClick={onToggleDarkMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
              isDarkMode 
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-400/30 hover:bg-indigo-600/40' 
                : 'bg-amber-500/20 text-amber-800 border border-amber-500/30 hover:bg-amber-500/30'
            }`}
            title={isDarkMode ? t.dayMode : t.nightMode}
          >
            {isDarkMode ? (
              /* Moon SVG Icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              /* Sun SVG Icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
            <span>{isDarkMode ? t.nightMode : t.dayMode}</span>
          </button>
        </div>

        {/* Circular Color Swatches (No Text / No Names) */}
        <div className="flex items-center justify-between gap-2 py-1 px-1">
          {THEME_SWATCHES.map((swatch) => {
            const isSelected = currentTheme.id === swatch.id;
            return (
              <button
                key={swatch.id}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectThemeId(swatch.id);
                }}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'scale-115 shadow-md ring-2 ring-white/90 dark:ring-white/80 ring-offset-2 ring-offset-black/20'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  backgroundColor: swatch.dotColor,
                }}
                aria-label={swatch.id}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Bar: Save, Sound, Lang, Settings */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-black/5 dark:bg-white/10 backdrop-blur-md">
        <button
          onClick={onOpenSaveModal}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/25 cursor-pointer ${currentTheme.textColor}`}
          title={t.archive}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          <span>{t.archive}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/25 cursor-pointer ${currentTheme.textColor}`}
          title={isMuted ? t.soundOff : t.soundOn}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"/>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className={`h-9 px-3 flex items-center justify-center rounded-xl font-black text-xs shadow-sm transition-all active:scale-95 bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/25 cursor-pointer ${currentTheme.textColor}`}
          title={t.language}
        >
          {lang === 'en' ? '中文' : 'EN'}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettingsModal}
          className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 bg-black/10 dark:bg-white/15 hover:bg-black/20 dark:hover:bg-white/25 cursor-pointer ${currentTheme.textColor}`}
          title={t.settings}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
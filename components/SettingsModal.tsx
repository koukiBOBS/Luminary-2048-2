import React from 'react';
import { GameState, Theme, Language } from '../types';
import { THEME_SWATCHES, TRANSLATIONS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onSelectThemeId: (themeId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  gameState: GameState;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  onSelectThemeId,
  isDarkMode,
  onToggleDarkMode,
  lang, 
  setLang, 
  isMuted, 
  onToggleMute 
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-overlay-in">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl ${theme.cardBg} ${theme.textColor} border-2 border-black/10 dark:border-white/10 max-h-[90vh] flex flex-col overflow-hidden animate-modal-up`}>
        {/* Header */}
        <div className="p-6 pb-3 shrink-0 flex justify-between items-center z-10 bg-inherit border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            {/* Cog SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>{t.settings}</span>
          </h2>
          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div 
          data-scrollable="true"
          className="p-6 pt-4 overflow-y-auto flex-1 space-y-6 touch-pan-y overscroll-contain"
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Tone Swatches (No Names) */}
          <div>
            <h3 className="text-sm font-black uppercase opacity-75 tracking-wider mb-3 flex items-center gap-2">
              {/* Palette SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
              </svg>
              <span>{t.themeSelector}</span>
            </h3>
            
            {/* Visual Swatch Grid (No Names) */}
            <div className="grid grid-cols-6 gap-2.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              {THEME_SWATCHES.map((swatch) => {
                const isSelected = theme.id === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    onClick={() => onSelectThemeId(swatch.id)}
                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'scale-110 shadow-lg ring-2 ring-white/90 ring-offset-2 ring-offset-black/20'
                        : 'opacity-75 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.dotColor }}
                    aria-label={swatch.id}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-white shadow-md" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences: Day/Night, Sound, Language */}
          <div>
            <h3 className="text-sm font-black uppercase opacity-75 tracking-wider mb-3 flex items-center gap-2">
              {/* Sliders SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              <span>{lang === 'zh' ? '基础选项' : 'Preferences'}</span>
            </h3>
            
            <div className="space-y-2.5">
              {/* Day / Night Mode Toggle */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors duration-200 ${
                isDarkMode ? 'bg-white/10' : 'bg-black/5'
              }`}>
                <span className="font-bold text-sm flex items-center gap-2">
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
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
                </span>
                <button
                  onClick={onToggleDarkMode}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-amber-500 text-white hover:bg-amber-400'
                  }`}
                >
                  <span>{isDarkMode ? t.nightMode : t.dayMode}</span>
                </button>
              </div>

              {/* Sound */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors duration-200 ${
                isDarkMode ? 'bg-white/10' : 'bg-black/5'
              }`}>
                <span className="font-bold text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                  <span>{t.sound}</span>
                </span>
                <button
                  onClick={onToggleMute}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
                    !isMuted 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-400 text-white'
                  }`}
                >
                  {!isMuted ? (lang === 'zh' ? '已开启' : 'ON') : (lang === 'zh' ? '已静音' : 'MUTED')}
                </button>
              </div>

              {/* Language */}
              <div className={`flex items-center justify-between p-3.5 rounded-2xl transition-colors duration-200 ${
                isDarkMode ? 'bg-white/10' : 'bg-black/5'
              }`}>
                <span className="font-bold text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span>{t.language}</span>
                </span>
                <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-xl">
                  <button 
                    onClick={() => setLang('zh')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      lang === 'zh' 
                        ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    中文
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      lang === 'en' 
                        ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorial & Rules */}
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/10 dark:border-white/10 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>{t.tutorial}</span>
            </h4>
            <p className="text-xs opacity-80 leading-relaxed">{t.tutorialText}</p>
            <p className="text-xs opacity-80 leading-relaxed">{t.tutorialGoal}</p>
            <p className="text-xs opacity-75 leading-relaxed font-semibold">{t.tutorialControl}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-inherit border-t border-black/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer ${theme.buttonBg} ${theme.buttonText}`}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
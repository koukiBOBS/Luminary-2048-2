import React from 'react';
import { GameState, Theme, Language } from '../types';
import { THEMES, TRANSLATIONS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
  setTheme,
  lang, 
  setLang,
  isMuted,
  onToggleMute
}) => {
  const t = TRANSLATIONS[lang];
  const allThemes = Object.values(THEMES);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl ${theme.cardBg} ${theme.textColor} border-2 border-black/10 dark:border-white/10 max-h-[90vh] flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-6 pb-3 shrink-0 flex justify-between items-center z-10 bg-inherit border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            {/* Cog SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
        <div className="p-6 pt-4 overflow-y-auto flex-1 space-y-6">
          {/* Theme Palette Gallery (切换色调) */}
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
            <div className="grid grid-cols-2 gap-2.5">
              {allThemes.map((item) => {
                const isSelected = theme.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item)}
                    className={`p-3 rounded-2xl flex items-center gap-2.5 text-left border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-current bg-black/10 dark:bg-white/15 shadow-md scale-[1.02]'
                        : 'border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full shrink-0 shadow-sm border border-black/10" 
                      style={{ backgroundColor: item.dotColor }}
                    />
                    <div className="truncate">
                      <div className="font-bold text-xs truncate">
                        {lang === 'zh' ? item.nameZh : item.name}
                      </div>
                      <div className="text-[10px] opacity-60 truncate">
                        {item.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Language Toggles */}
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
              {/* Sound */}
              <div className="flex items-center justify-between bg-black/5 dark:bg-white/10 p-3.5 rounded-2xl">
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
              <div className="flex items-center justify-between bg-black/5 dark:bg-white/10 p-3.5 rounded-2xl">
                <span className="font-bold text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span>{t.language}</span>
                </span>
                <div className="flex bg-black/10 dark:bg-black/30 p-1 rounded-xl">
                  <button 
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      lang === 'en' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLang('zh')}
                    className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      lang === 'zh' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    中文
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorial / Rules */}
          <div>
            <h3 className="text-sm font-black uppercase opacity-75 tracking-wider mb-3 flex items-center gap-2">
              {/* Book SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <span>{t.tutorial}</span>
            </h3>
            <div className="bg-black/5 dark:bg-white/10 rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2">
              <p className="font-bold">{t.tutorialText}</p>
              <ul className="list-disc list-inside opacity-85 space-y-1.5 ml-1">
                <li>{t.tutorialControl}</li>
                <li>{t.tutorialGoal}</li>
                <li>{lang === 'zh' ? '支持多次“撤销”走法，随时步步回退挽救失误。' : 'Multiple undos available to step back and rescue accidental moves.'}</li>
              </ul>
            </div>
          </div>

          {/* About */}
          <div className="text-center opacity-50 text-xs pt-2 pb-1">
            <p className="font-bold">Luminary 2048</p>
            <p>{t.version}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
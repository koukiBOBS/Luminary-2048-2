import React from 'react';
import { THEMES, TRANSLATIONS } from '../constants';
import { Theme, Language } from '../types';

interface ControlPanelProps {
  onNewGame: () => void;
  onOpenSaveModal: () => void;
  onOpenSettingsModal: () => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onNewGame, 
  onOpenSaveModal,
  onOpenSettingsModal,
  currentTheme, 
  setTheme,
  lang,
  setLang
}) => {
  const t = TRANSLATIONS[lang];

  // Define fixed order for themes: Classic, Pink (Bubblegum), Green (Forest), Blue (Midnight)
  const themeKeys = ['classic', 'bubblegum', 'forest', 'midnight'];

  return (
    <div className="flex flex-col gap-4 w-full relative z-20">
      <div className="flex flex-col gap-4">
        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
            <button
            onClick={onNewGame}
            className={`flex-1 px-4 py-3 rounded-xl font-bold shadow-md transition transform active:scale-95 text-sm md:text-base whitespace-nowrap ${currentTheme.buttonBg} ${currentTheme.buttonText}`}
            >
            {t.newGame}
            </button>
            <button
            onClick={onOpenSaveModal}
            className={`flex-1 px-4 py-3 rounded-xl font-bold shadow-md transition transform active:scale-95 text-sm md:text-base bg-gray-500 text-white`}
            >
            {t.archive}
            </button>
        </div>
        
        {/* Toggles Row */}
        <div className="flex gap-2 items-center justify-between bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            
            {/* Theme Toggles */}
            <div className="flex gap-2 flex-wrap">
                {themeKeys.map((key) => {
                    const themeOption = THEMES[key];
                    if (!themeOption) return null;

                    const bgClass = themeOption.buttonBg;
                    const isSelected = currentTheme.name === themeOption.name;
                    
                    return (
                        <button
                            key={key}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTheme(themeOption);
                            }}
                            aria-label={`Switch to ${themeOption.name} theme`}
                            className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${bgClass} ${isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                            title={themeOption.name}
                        />
                    )
                })}
            </div>

            <div className="flex gap-2 items-center">
                {/* Language Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLang(lang === 'en' ? 'zh' : 'en');
                    }}
                    className={`h-8 px-3 flex items-center justify-center rounded-lg shadow-sm transition-colors cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} opacity-90 hover:opacity-100 font-bold text-xs`}
                    title={t.language}
                >
                    {lang === 'en' ? '中' : 'EN'}
                </button>

                {/* Settings Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onOpenSettingsModal();
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm transition-colors cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} opacity-90 hover:opacity-100`}
                    title={t.settings}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
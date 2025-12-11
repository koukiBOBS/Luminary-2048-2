import React from 'react';
import { THEMES, TRANSLATIONS } from '../constants';
import { Theme, Language } from '../types';

interface ControlPanelProps {
  onNewGame: () => void;
  onOpenSaveModal: () => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onNewGame, 
  onOpenSaveModal,
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

                    // Use the main button color as the preview color so it matches the theme's vibe (Pink, Green, Blue)
                    // explicitly instead of the 2048 tile color which might differ.
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

            {/* Language Toggle */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLang(lang === 'en' ? 'zh' : 'en');
                }}
                className={`px-3 py-1 rounded-lg font-bold text-xs shadow-sm transition-colors cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} opacity-90 hover:opacity-100`}
            >
                {lang === 'en' ? '中' : 'EN'}
            </button>
        </div>
      </div>
    </div>
  );
};
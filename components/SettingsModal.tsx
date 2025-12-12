import React, { useState } from 'react';
import { GameState, Theme, Language } from '../types';
import { TRANSLATIONS } from '../constants';
// import { getAIHint } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  lang: Language;
  setLang: (lang: Language) => void;
  gameState: GameState;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  lang, 
  setLang,
  gameState
}) => {
  const t = TRANSLATIONS[lang];
  // const [hint, setHint] = useState<string | null>(null);
  // const [loadingHint, setLoadingHint] = useState(false);

  if (!isOpen) return null;

  /*
  const handleGetHint = async () => {
    setLoadingHint(true);
    setHint(null);
    const hintText = await getAIHint(gameState.tiles, gameState.score);
    setHint(hintText);
    setLoadingHint(false);
  };
  */

  const borderColor = theme.gridBg.replace('bg-', 'border-');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl ${theme.appBg} ${theme.textColor} border-4 ${borderColor} max-h-[90vh] flex flex-col overflow-hidden`}>
        
        {/* Fixed Header */}
        <div className="p-6 pb-2 shrink-0 flex justify-between items-center z-10 bg-inherit">
          <h2 className="text-2xl font-bold">{t.settings}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 pt-2 overflow-y-auto flex-1">
            
            {/* Tutorial Section */}
            <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 border-b border-gray-400/20 pb-2">{t.tutorial}</h3>
            <div className="bg-white/10 rounded-xl p-4 text-sm leading-relaxed space-y-2">
                <p><strong>{t.tutorialText}</strong></p>
                <ul className="list-disc list-inside opacity-90 space-y-1 ml-1">
                <li>{t.tutorialControl}</li>
                <li>{t.tutorialGoal}</li>
                </ul>
            </div>
            </div>

            {/* AI Assistant Section (Temporarily Disabled) */}
            {/* 
            <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 border-b border-gray-400/20 pb-2">{t.aiAssistant}</h3>
            <div className="flex flex-col gap-3">
                <button 
                onClick={handleGetHint}
                disabled={loadingHint}
                className={`w-full py-3 rounded-xl font-bold shadow-md transition transform active:scale-95 ${theme.buttonBg} ${theme.buttonText} disabled:opacity-50`}
                >
                {loadingHint ? t.aiThinking : t.askAi}
                </button>
                
                {hint && (
                <div className="bg-white/10 rounded-xl p-4 animate-pop">
                    <p className="text-xs font-bold uppercase opacity-60 mb-1">{t.aiHintTitle}</p>
                    <p className="text-sm font-medium">{hint}</p>
                </div>
                )}
            </div>
            </div>
            */}

            {/* General Settings */}
            <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 border-b border-gray-400/20 pb-2">{t.settings}</h3>
            
            <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl">
                <span className="font-bold text-sm">{t.language}</span>
                <div className="flex bg-black/10 p-1 rounded-lg">
                    <button 
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-black shadow-sm' : 'text-current opacity-50'}`}
                    >
                    English
                    </button>
                    <button 
                    onClick={() => setLang('zh')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'zh' ? 'bg-white text-black shadow-sm' : 'text-current opacity-50'}`}
                    >
                    中文
                    </button>
                </div>
            </div>
            </div>

            {/* About / Version */}
            <div className="text-center opacity-50 text-xs pb-4">
                <p>{t.about} - Luminary 2048</p>
                <p>{t.version}</p>
            </div>

        </div>

      </div>
    </div>
  );
};
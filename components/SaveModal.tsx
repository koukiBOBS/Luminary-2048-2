import React, { useState, useEffect } from 'react';
import { GameState, Theme, Language } from '../types';
import { serializeGameState, deserializeGameState } from '../services/gameLogic';
import { TRANSLATIONS } from '../constants';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onLoadGame: (state: GameState) => void;
  theme: Theme;
  lang: Language;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, gameState, onLoadGame, theme, lang }) => {
  const [saveCode, setSaveCode] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [error, setError] = useState('');
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen) {
      setSaveCode(serializeGameState(gameState));
      setLoadCode('');
      setError('');
      setCopyStatus(t.copy);
    }
  }, [isOpen, gameState, lang, t.copy]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(saveCode);
    setCopyStatus(t.copied);
    setTimeout(() => setCopyStatus(t.copy), 2000);
  };

  const handleLoad = () => {
    const state = deserializeGameState(loadCode);
    if (state) {
      onLoadGame(state);
      onClose();
    } else {
      setError(t.invalidCode);
    }
  };

  const handleLocalSave = () => {
     localStorage.setItem('luminary2048-save', serializeGameState(gameState));
     alert(t.savedToLocal);
  };

  const handleLocalLoad = () => {
      const saved = localStorage.getItem('luminary2048-save');
      if (saved) {
          const state = deserializeGameState(saved);
          if (state) {
              onLoadGame(state);
              onClose();
          }
      } else {
          setError(t.noLocalSave);
      }
  }

  // Helper to get border color from bg color class string
  const borderColor = theme.gridBg.replace('bg-', 'border-');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
        <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl ${theme.appBg} ${theme.textColor} border-4 ${borderColor}`}>
            <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
                <span>{t.saveModalTitle}</span>
                <button 
                  onClick={onClose} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition"
                >
                  &times;
                </button>
            </h2>

            {/* Local Storage Section */}
             <div className="mb-6 pb-6 border-b border-gray-400/20">
                <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider mb-3">{t.quickSave}</h3>
                <div className="flex gap-3">
                    <button onClick={handleLocalSave} className={`flex-1 py-3 rounded-xl font-bold ${theme.buttonBg} ${theme.buttonText} shadow-md opacity-90 hover:opacity-100 transition transform hover:scale-[1.02]`}>
                        {t.save}
                    </button>
                    <button onClick={handleLocalLoad} className={`flex-1 py-3 rounded-xl font-bold bg-gray-500 text-white shadow-md opacity-90 hover:opacity-100 transition transform hover:scale-[1.02]`}>
                        {t.load}
                    </button>
                </div>
            </div>

            {/* Save Code Section */}
            <div className="mb-6">
                <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider mb-2">{t.currentSaveCode}</h3>
                <div className="flex gap-2">
                    <input 
                        readOnly 
                        value={saveCode} 
                        className="w-full bg-white/10 border border-black/10 rounded-xl px-4 py-2 text-xs font-mono truncate"
                    />
                    <button onClick={handleCopy} className={`px-4 py-2 text-xs font-bold rounded-xl ${theme.buttonBg} ${theme.buttonText} shadow-sm min-w-[80px]`}>
                        {copyStatus}
                    </button>
                </div>
            </div>

            {/* Load Code Section */}
            <div>
                 <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider mb-2">{t.loadSaveCode}</h3>
                 <textarea 
                    value={loadCode}
                    onChange={(e) => setLoadCode(e.target.value)}
                    placeholder={t.pastePlaceholder}
                    className="w-full bg-white/10 border border-black/10 rounded-xl px-4 py-3 text-xs font-mono h-24 resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-current"
                 />
                 {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
                 <button 
                    onClick={handleLoad}
                    className={`w-full mt-4 py-3 rounded-xl font-bold ${theme.buttonBg} ${theme.buttonText} shadow-lg transition transform hover:scale-[1.02]`}
                 >
                    {t.loadGameCode}
                 </button>
            </div>
        </div>
    </div>
  );
};
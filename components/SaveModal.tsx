import React, { useState, useEffect, useRef } from 'react';
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

export const SaveModal: React.FC<SaveModalProps> = ({ 
  isOpen, 
  onClose, 
  gameState, 
  onLoadGame, 
  theme, 
  lang 
}) => {
  const [saveCode, setSaveCode] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen) {
      setSaveCode(serializeGameState(gameState));
      setLoadCode('');
      setError('');
      setCopyStatus(t.copy);
      setToastMessage(null);
    }
  }, [isOpen, gameState, lang, t.copy]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = () => {
    if (!saveCode) return;
    navigator.clipboard.writeText(saveCode);
    setCopyStatus(t.copied);
    showToast(t.copied);
    setTimeout(() => setCopyStatus(t.copy), 2000);
  };

  const handleLoad = () => {
    if (!loadCode.trim()) {
      setError(t.invalidCode);
      return;
    }
    const state = deserializeGameState(loadCode);
    if (state) {
      onLoadGame(state);
      onClose();
    } else {
      setError(t.invalidCode);
    }
  };

  const handleLocalSave = () => {
    try {
      localStorage.setItem('luminary2048-save', serializeGameState(gameState));
      showToast(t.savedToLocal);
    } catch {
      setError('Storage write error');
    }
  };

  const handleLocalLoad = () => {
    try {
      const saved = localStorage.getItem('luminary2048-save');
      if (saved) {
        const state = deserializeGameState(saved);
        if (state) {
          onLoadGame(state);
          onClose();
        } else {
          setError(t.invalidCode);
        }
      } else {
        setError(t.noLocalSave);
      }
    } catch {
      setError(t.noLocalSave);
    }
  };

  const handleDownload = () => {
    try {
      const jsonString = atob(saveCode);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `luminary-2048-save-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Download started!');
    } catch (e) {
      console.error("Download failed", e);
      setError(t.fileError);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const base64 = btoa(result);
        const state = deserializeGameState(base64);
        if (state) {
          onLoadGame(state);
          onClose();
        } else {
          setError(t.invalidCode);
        }
      } catch (err) {
        console.error(err);
        setError(t.fileError);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className={`w-full max-w-md p-6 sm:p-7 rounded-3xl shadow-2xl ${theme.cardBg} ${theme.textColor} border-2 border-black/10 dark:border-white/10 max-h-[92vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2.5">
            {/* Floppy Disk Save SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>{t.saveModalTitle}</span>
          </h2>
          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* In-modal Toast Banner */}
        {toastMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-pop border border-emerald-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Quick Local Storage Save & Load */}
        <div className="mb-5 pb-5 border-b border-black/10 dark:border-white/10">
          <h3 className="text-xs font-black uppercase opacity-60 tracking-wider mb-2.5">
            {t.quickSave}
          </h3>
          <div className="flex gap-2.5">
            <button 
              onClick={handleLocalSave} 
              className={`flex-1 py-3 px-4 rounded-2xl font-bold ${theme.buttonBg} ${theme.buttonText} shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>{t.save}</span>
            </button>
            <button 
              onClick={handleLocalLoad} 
              className="flex-1 py-3 px-4 rounded-2xl font-bold bg-slate-600 hover:bg-slate-500 text-white shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
              <span>{t.load}</span>
            </button>
          </div>
        </div>

        {/* File Backup & Export */}
        <div className="mb-5 pb-5 border-b border-black/10 dark:border-white/10">
          <h3 className="text-xs font-black uppercase opacity-60 tracking-wider mb-2.5">
            {t.fileSave}
          </h3>
          <div className="flex gap-2.5">
            <button 
              onClick={handleDownload} 
              className={`flex-1 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm ${theme.buttonBg} ${theme.buttonText} shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>{t.downloadSave}</span>
            </button>
            <button 
              onClick={handleUploadClick} 
              className="flex-1 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-600 hover:bg-slate-500 text-white shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>{t.uploadSave}</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Copy Current Save Code */}
        <div className="mb-5">
          <h3 className="text-xs font-black uppercase opacity-60 tracking-wider mb-2">
            {t.currentSaveCode}
          </h3>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={saveCode} 
              className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs font-mono truncate select-all"
            />
            <button 
              onClick={handleCopy} 
              className={`px-4 py-2.5 text-xs font-black rounded-2xl ${theme.buttonBg} ${theme.buttonText} shadow-sm shrink-0 cursor-pointer active:scale-95`}
            >
              {copyStatus}
            </button>
          </div>
        </div>

        {/* Restore from Code */}
        <div>
          <h3 className="text-xs font-black uppercase opacity-60 tracking-wider mb-2">
            {t.loadSaveCode}
          </h3>
          <textarea 
            value={loadCode}
            onChange={(e) => {
              setLoadCode(e.target.value);
              setError('');
            }}
            placeholder={t.pastePlaceholder}
            className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl px-3.5 py-3 text-xs font-mono h-20 resize-none focus:outline-none focus:ring-2 focus:ring-current"
          />
          {error && <p className="text-rose-500 text-xs mt-1.5 font-bold">{error}</p>}
          <button 
            onClick={handleLoad}
            className={`w-full mt-3 py-3 rounded-2xl font-black ${theme.buttonBg} ${theme.buttonText} shadow-lg transition-transform active:scale-95 cursor-pointer`}
          >
            {t.loadGameCode}
          </button>
        </div>
      </div>
    </div>
  );
};
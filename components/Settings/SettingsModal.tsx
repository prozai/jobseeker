import React from 'react';
import { LogoIcon, CloseIcon } from '../Icons';
import { useTheme } from '../../contexts/ThemeContext';
import AppearanceSettings from './AppearanceSettings';
import ConnectionSettings from './ConnectionSettings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string | null;
  onUrlChange: (url: string | null) => void;
  onUrlReset: () => void;
}

const SettingsModal: React.FC<SettingsProps> = ({ isOpen, onClose, currentUrl, onUrlChange, onUrlReset }) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className={`w-full max-w-md p-8 space-y-6 ${theme.background.modal} rounded-2xl shadow-2xl ${theme.accent.shadow} relative overflow-y-auto max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close settings"
        >
            <CloseIcon className="h-6 w-6" />
        </button>

        <div className="text-center">
            <LogoIcon className={`mx-auto h-12 w-12 ${theme.accent.text}`} />
          <h2 id="settings-title" className="mt-6 text-3xl font-extrabold text-white">
            Settings
          </h2>
        </div>
        
        <AppearanceSettings />
        
        <ConnectionSettings 
            currentUrl={currentUrl}
            onUrlChange={onUrlChange}
            onUrlReset={onUrlReset}
            onSave={onClose}
        />
      </div>
    </div>
  );
};

export default SettingsModal;
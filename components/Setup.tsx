
import React, { useState, useEffect } from 'react';
import { LogoIcon, CloseIcon } from './Icons';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string | null;
  onUrlSubmit: (url: string) => void;
  onUrlReset: () => void;
}

const Setup: React.FC<SettingsProps> = ({ isOpen, onClose, currentUrl, onUrlSubmit, onUrlReset }) => {
  const [url, setUrl] = useState(currentUrl || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        setUrl(currentUrl || '');
        setError('');
    }
  }, [isOpen, currentUrl]);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() === '') {
      setError('Webhook URL cannot be empty.');
      return;
    }
    try {
      new URL(url); // Validate URL format
      onUrlSubmit(url);
    } catch (e) {
      setError('Please enter a valid URL.');
    }
  };

  const handleReset = () => {
    onUrlReset();
    onClose();
  }

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 relative"
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
            <LogoIcon className="mx-auto h-12 w-12 text-cyan-400" />
          <h2 id="settings-title" className="mt-6 text-3xl font-extrabold text-white">
            Agent Settings
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Configure your n8n webhook URL to connect to your agent.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="webhook-url" className="sr-only">
                n8n Webhook URL
              </label>
              <input
                id="webhook-url"
                name="url"
                type="url"
                autoComplete="off"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-900 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="https://your-n8n-instance.com/webhook/..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
            >
              Save & Connect
            </button>
          </div>
        </form>
        {currentUrl && (
             <div className="pt-4 text-center border-t border-slate-700/50">
                <button 
                    onClick={handleReset}
                    type="button"
                    className="text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
                >
                    Clear Webhook URL
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Setup;

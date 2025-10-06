import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { testN8nConnection } from '../../services/n8nService';
import TestResultIndicator from './TestResultIndicator';

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

interface ConnectionSettingsProps {
    currentUrl: string | null;
    onUrlChange: (url: string | null) => void;
    onUrlReset: () => void;
    onSave: () => void;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ currentUrl, onUrlChange, onUrlReset, onSave }) => {
    const { theme } = useTheme();
    const [error, setError] = useState('');
    const [testStatus, setTestStatus] = useState<TestStatus>('idle');
    const [testError, setTestError] = useState('');
    
    const urlValue = currentUrl || '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (urlValue.trim() !== '' && !validateUrl(urlValue)) {
            return;
        }
        onSave();
    };

    const handleReset = () => {
        onUrlReset();
        onSave();
    };

    const validateUrl = (urlToValidate: string): boolean => {
         if (urlToValidate.trim() === '') {
            setError('Webhook URL cannot be empty.');
            return false;
        }
        try {
            new URL(urlToValidate);
            setError('');
            return true;
        } catch (e) {
            setError('Please enter a valid URL.');
            return false;
        }
    }

    const handleTestConnection = async () => {
        if (!validateUrl(urlValue)) return;

        setTestStatus('testing');
        setTestError('');
        const result = await testN8nConnection(urlValue);
        if (result.success) {
            setTestStatus('success');
        } else {
            setTestStatus('error');
            setTestError(result.error || 'An unknown error occurred.');
        }
    };
    
    return (
        <div className="space-y-6 pt-6 border-t border-slate-700/50">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">
              Agent Connection
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Configure your n8n webhook URL to connect to your agent.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="webhook-url" className="sr-only">
                  n8n Webhook URL
                </label>
                <input
                  id="webhook-url"
                  name="url"
                  type="url"
                  autoComplete="off"
                  className={`appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 ${theme.background.input} placeholder-slate-500 text-white focus:outline-none focus:ring-2 ${theme.accent.focusRing} ${theme.accent.border} sm:text-sm`}
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  value={urlValue}
                  onChange={(e) => {
                    onUrlChange(e.target.value);
                    if (error) setError('');
                    if (testStatus !== 'idle') setTestStatus('idle');
                  }}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-400 -mt-2">{error}</p>}

            <TestResultIndicator status={testStatus} error={testError} />

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className={`group relative w-full flex justify-center py-3 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors ${
                    testStatus === 'testing'
                        ? 'bg-slate-600 border-slate-500 text-slate-400 cursor-not-allowed'
                        : `border-slate-500 text-slate-300 hover:bg-slate-700 hover:border-slate-400 ${theme.accent.focusRing}`
                }`}
              >
                Test
              </button>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${theme.button.background} ${theme.button.backgroundHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${theme.accent.focusRing} transition-colors`}
              >
                Save & Connect
              </button>
            </div>
          </form>
          {currentUrl && (
              <div className="text-center">
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
    );
};

export default ConnectionSettings;

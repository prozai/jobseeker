import React from 'react';
import { CheckIcon } from '../Icons';
import { useTheme, themes, backgrounds } from '../../contexts/ThemeContext';

const AppearanceSettings: React.FC = () => {
    const { theme, setTheme, themeKey, backgroundKey, setBackgroundKey } = useTheme();

    return (
        <div className="space-y-6 pt-6 border-t border-slate-700/50">
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300">Color Palette</p>
                <div className="flex justify-center space-x-3">
                    {Object.entries(themes).map(([key, themeOption]) => (
                        <button
                            key={key}
                            onClick={() => setTheme(key)}
                            className={`h-8 w-8 rounded-full ${themeOption.swatch.background} flex items-center justify-center ring-2 ring-offset-2 ring-offset-slate-800 transition ${
                                themeKey === key ? themeOption.swatch.ring : 'ring-transparent'
                            }`}
                            aria-label={`Select ${themeOption.name} theme`}
                        >
                          {themeKey === key && <CheckIcon className="h-5 w-5 text-white" />}
                        </button>
                    ))}
                </div>
            </div>
             <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300">Background Style</p>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(backgrounds).map(([key, bgOption]) => (
                        <button
                            key={key}
                            onClick={() => setBackgroundKey(key)}
                            className={`relative h-16 rounded-lg p-2 text-left ring-2 ring-offset-2 ring-offset-slate-800 transition ${
                                backgroundKey === key ? theme.swatch.ring : 'ring-slate-700'
                            }`}
                            aria-label={`Select ${bgOption.name} background`}
                        >
                          <div className={`absolute inset-0 rounded-md ${bgOption.className}`}></div>
                          <span className="relative text-xs font-semibold text-white">{bgOption.name}</span>
                          {backgroundKey === key && (
                            <div className="absolute top-1 right-1 bg-black/30 rounded-full">
                              <CheckIcon className={`h-4 w-4 ${theme.accent.text}`} />
                            </div>
                          )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppearanceSettings;

import React, { createContext, useContext, useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface ThemeClasses {
  name: string;
  accent: {
    text: string;
    textHover: string;
    border: string;
    borderHover: string;
    focusRing: string;
    shadow: string;
    shadowHover: string;
  };
  background: {
    main: string;
    sidebar: string;
    sidebarMobile: string;
    modal: string;
    input: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  button: {
    background: string;
    backgroundHover: string;
  };
  userMessage: {
    background: string;
  };
  aiIcon: {
    background: string;
  };
  loading: {
    background: string;
  };
  skillTag: {
    background: string;
    text: string;
  };
  swatch: {
    background: string;
    ring: string;
  };
}

interface Background {
    name: string;
    className: string;
}

export const themes: Record<string, ThemeClasses> = {
  cyan: {
    name: 'Cyan',
    accent: {
      text: 'text-cyan-400',
      textHover: 'hover:text-cyan-300',
      border: 'focus:border-cyan-500',
      borderHover: 'hover:border-cyan-500/50',
      focusRing: 'focus:ring-cyan-500',
      shadow: 'shadow-cyan-500/10',
      shadowHover: 'hover:shadow-cyan-500/10',
    },
    background: {
      main: 'bg-slate-800/60',
      sidebar: 'md:bg-slate-800/50 md:backdrop-blur-none',
      sidebarMobile: 'bg-slate-800/95 backdrop-blur-md',
      modal: 'bg-slate-800',
      input: 'bg-slate-900',
    },
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-400',
      tertiary: 'text-slate-300',
    },
    button: {
      background: 'bg-cyan-600',
      backgroundHover: 'hover:bg-cyan-700',
    },
    userMessage: {
      background: 'bg-blue-600/80',
    },
    aiIcon: {
      background: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
    loading: {
      background: 'bg-cyan-400',
    },
    skillTag: {
      background: 'bg-cyan-900/50',
      text: 'text-cyan-300',
    },
    swatch: {
      background: 'bg-cyan-500',
      ring: 'ring-cyan-500',
    },
  },
  violet: {
    name: 'Violet',
    accent: {
      text: 'text-violet-400',
      textHover: 'hover:text-violet-300',
      border: 'focus:border-violet-500',
      borderHover: 'hover:border-violet-500/50',
      focusRing: 'focus:ring-violet-500',
      shadow: 'shadow-violet-500/10',
      shadowHover: 'hover:shadow-violet-500/10',
    },
    background: {
      main: 'bg-slate-800/60',
      sidebar: 'md:bg-slate-800/50 md:backdrop-blur-none',
      sidebarMobile: 'bg-slate-800/95 backdrop-blur-md',
      modal: 'bg-slate-800',
      input: 'bg-slate-900',
    },
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-400',
      tertiary: 'text-slate-300',
    },
    button: {
      background: 'bg-violet-600',
      backgroundHover: 'hover:bg-violet-700',
    },
    userMessage: {
      background: 'bg-indigo-600/80',
    },
    aiIcon: {
      background: 'bg-gradient-to-br from-violet-500 to-indigo-600',
    },
    loading: {
      background: 'bg-violet-400',
    },
    skillTag: {
      background: 'bg-violet-900/50',
      text: 'text-violet-300',
    },
    swatch: {
      background: 'bg-violet-500',
      ring: 'ring-violet-500',
    },
  },
  emerald: {
    name: 'Emerald',
    accent: {
      text: 'text-emerald-400',
      textHover: 'hover:text-emerald-300',
      border: 'focus:border-emerald-500',
      borderHover: 'hover:border-emerald-500/50',
      focusRing: 'focus:ring-emerald-500',
      shadow: 'shadow-emerald-500/10',
      shadowHover: 'hover:shadow-emerald-500/10',
    },
    background: {
      main: 'bg-gray-800/60',
      sidebar: 'md:bg-gray-800/50 md:backdrop-blur-none',
      sidebarMobile: 'bg-gray-800/95 backdrop-blur-md',
      modal: 'bg-gray-800',
      input: 'bg-gray-900',
    },
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
      tertiary: 'text-gray-300',
    },
    button: {
      background: 'bg-emerald-600',
      backgroundHover: 'hover:bg-emerald-700',
    },
    userMessage: {
      background: 'bg-teal-600/80',
    },
    aiIcon: {
      background: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    loading: {
      background: 'bg-emerald-400',
    },
    skillTag: {
      background: 'bg-emerald-900/50',
      text: 'text-emerald-300',
    },
    swatch: {
      background: 'bg-emerald-500',
      ring: 'ring-emerald-500',
    },
  },
  rose: {
    name: 'Rose',
    accent: {
      text: 'text-rose-400',
      textHover: 'hover:text-rose-300',
      border: 'focus:border-rose-500',
      borderHover: 'hover:border-rose-500/50',
      focusRing: 'focus:ring-rose-500',
      shadow: 'shadow-rose-500/10',
      shadowHover: 'hover:shadow-rose-500/10',
    },
    background: {
      main: 'bg-zinc-800/60',
      sidebar: 'md:bg-zinc-800/50 md:backdrop-blur-none',
      sidebarMobile: 'bg-zinc-800/95 backdrop-blur-md',
      modal: 'bg-zinc-800',
      input: 'bg-zinc-900',
    },
    text: {
      primary: 'text-zinc-100',
      secondary: 'text-zinc-400',
      tertiary: 'text-zinc-300',
    },
    button: {
      background: 'bg-rose-600',
      backgroundHover: 'hover:bg-rose-700',
    },
    userMessage: {
      background: 'bg-pink-600/80',
    },
    aiIcon: {
      background: 'bg-gradient-to-br from-rose-500 to-pink-600',
    },
    loading: {
      background: 'bg-rose-400',
    },
    skillTag: {
      background: 'bg-rose-900/50',
      text: 'text-rose-300',
    },
    swatch: {
      background: 'bg-rose-500',
      ring: 'ring-rose-500',
    },
  },
};

export const backgrounds: Record<string, Background> = {
    plain: {
        name: 'Plain Dark',
        className: 'bg-slate-900'
    },
    dots: {
        name: 'Dot Matrix',
        className: 'bg-slate-900 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:1.5rem_1.5rem]'
    },
    grid: {
        name: 'Grid Lines',
        className: 'bg-slate-900 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:2rem_2rem]'
    },
    cosmic: {
        name: 'Cosmic Void',
        className: 'bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]'
    }
}


interface ThemeContextType {
  themeKey: string;
  setTheme: (key: string) => void;
  theme: ThemeClasses;
  backgroundKey: string;
  setBackgroundKey: (key: string) => void;
  background: Background;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKey] = useLocalStorage<string>('appTheme', 'cyan');
  const [backgroundKey, setBackgroundKey] = useLocalStorage<string>('appBackground', 'plain');


  const theme = useMemo(() => themes[themeKey] || themes.cyan, [themeKey]);
  const background = useMemo(() => backgrounds[backgroundKey] || backgrounds.plain, [backgroundKey]);


  return (
    <ThemeContext.Provider value={{ themeKey, setTheme: setThemeKey, theme, backgroundKey, setBackgroundKey, background }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
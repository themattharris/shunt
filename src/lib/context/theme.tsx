'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | null>(null);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const applied = newTheme === 'system' ? (prefersDark ? 'dark' : 'light') : newTheme;

    root.setAttribute('data-theme', applied);
    root.classList.remove('light', 'dark');
    root.removeAttribute('class');

    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme | null) || 'system';
    applyTheme(stored);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        applyTheme((e.newValue as Theme | null) || 'system');
      }
    };

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      const storedTheme = (localStorage.getItem('theme') as Theme | null) || 'system';
      if (storedTheme === 'system') applyTheme('system');
    };

    window.addEventListener('storage', onStorage);
    mq.addEventListener?.('change', onSystemChange);

    return () => {
      window.removeEventListener('storage', onStorage);
      mq.removeEventListener?.('change', onSystemChange);
    };
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

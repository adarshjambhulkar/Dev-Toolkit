import { useState, useEffect } from 'react';
import type { Theme } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) ?? 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply on mount immediately
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) ?? 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return { theme, toggleTheme };
}

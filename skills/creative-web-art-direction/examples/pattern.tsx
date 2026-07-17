import { useEffect, useState } from 'react';

export const useThemeManager = () => {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => document.documentElement.removeAttribute('data-theme');
  }, [theme]);
  return { theme, setTheme };
};

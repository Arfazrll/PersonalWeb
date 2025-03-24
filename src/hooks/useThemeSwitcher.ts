// src/hooks/useThemeSwitcher.ts
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export const useThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update theme if it's set to 'system'
      if (theme === 'system') {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add event listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, setTheme]);

  return { theme, setTheme };
};
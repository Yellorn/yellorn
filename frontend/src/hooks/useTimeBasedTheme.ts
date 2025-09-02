import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

export interface TimeBasedThemeConfig {
  darkModeStart: number; // Hour (0-23) when dark mode should start
  darkModeEnd: number;   // Hour (0-23) when dark mode should end
}

const DEFAULT_CONFIG: TimeBasedThemeConfig = {
  darkModeStart: 18, // 6 PM
  darkModeEnd: 6,    // 6 AM
};

export function useTimeBasedTheme(config: TimeBasedThemeConfig = DEFAULT_CONFIG) {
  const [theme, setTheme] = useState<Theme>('dark');

  const getCurrentTheme = useCallback((): Theme => {
    const now = new Date();
    const currentHour = now.getHours();

    // Check if current time is in dark mode range
    if (config.darkModeStart > config.darkModeEnd) {
      // Dark mode spans midnight (e.g., 18:00 to 06:00)
      if (currentHour >= config.darkModeStart || currentHour < config.darkModeEnd) {
        return 'dark';
      }
    } else {
      // Dark mode doesn't span midnight (e.g., 20:00 to 22:00)
      if (currentHour >= config.darkModeStart && currentHour < config.darkModeEnd) {
        return 'dark';
      }
    }
    
    return 'light';
  }, [config]);

  const applyTheme = useCallback((newTheme: Theme) => {
    // Remove existing theme classes
    document.body.classList.remove('theme-light', 'theme-dark');
    
    // Apply new theme class
    document.body.classList.add(`theme-${newTheme}`);
    
    setTheme(newTheme);
  }, []);

  useEffect(() => {
    // Set initial theme
    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme);

    // Update theme every minute to check for time changes
    const interval = setInterval(() => {
      const currentTheme = getCurrentTheme();
      if (currentTheme !== theme) {
        applyTheme(currentTheme);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [getCurrentTheme, applyTheme, theme]);

  return {
    theme,
    setTheme: applyTheme,
    getCurrentTheme,
    config,
  };
}

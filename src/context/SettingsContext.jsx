import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loadPreferences, loadTheme, savePreferences, saveTheme } from '../services/storage.js';

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(loadTheme);
  const [preferences, setPreferences] = useState(loadPreferences);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    [],
  );

  const setCompactCards = useCallback(
    (compactCards) => setPreferences((current) => ({ ...current, compactCards })),
    [],
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, compactCards: preferences.compactCards, setCompactCards }),
    [theme, toggleTheme, preferences.compactCards, setCompactCards],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

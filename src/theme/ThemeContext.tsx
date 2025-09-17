import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Preset = 'neonNight' | 'auroraCalm' | 'midnightPeach' | 'forestGlow';
type Ctx = { preset: Preset; setPreset: (p: Preset) => void };

const ThemeCtx = createContext<Ctx | undefined>(undefined);
const KEY = '@no-contact/preset';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPreset] = useState<Preset>('neonNight');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved) setPreset(saved as Preset);
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(KEY, preset).catch(()=>{});
  }, [preset]);

  return <ThemeCtx.Provider value={{ preset, setPreset }}>{children}</ThemeCtx.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

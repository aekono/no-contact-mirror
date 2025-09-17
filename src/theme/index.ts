import { Colors, Typography, Spacing, Radius, Shadow } from '../types';

export type ThemePreset = 'neonNight' | 'auroraCalm' | 'midnightPeach' | 'forestGlow';

export const presets: Record<ThemePreset, Colors> = {
  neonNight: {
    bg: '#0E1116',
    card: '#131823',
    text: '#E6EAF2',
    subtext: '#A9B2C3',
    accent: '#6CA0FF',
    danger: '#FF6B6B',
    chip: '#1A2130',
    border: '#1F2633',
    success: '#5ED3A8',
    muted: '#0B0F16',
  },
  auroraCalm: {
    bg: '#071417',
    card: '#0F1E23',
    text: '#E5FBFF',
    subtext: '#A9C7CF',
    accent: '#5AD0C8',
    danger: '#FF7A7A',
    chip: '#0E2529',
    border: '#123039',
    success: '#5ED3A8',
    muted: '#08171A',
  },
  midnightPeach: {
    bg: '#110D12',
    card: '#18131C',
    text: '#F9EAF7',
    subtext: '#C9B6C6',
    accent: '#C07CFF',
    danger: '#FF7A92',
    chip: '#25182E',
    border: '#2C1F36',
    success: '#7ED7B7',
    muted: '#0E0A10',
  },
  forestGlow: {
    bg: '#0C1110',
    card: '#121A17',
    text: '#E6F5ED',
    subtext: '#A8C1B2',
    accent: '#5FDB8A',
    danger: '#FF6B6B',
    chip: '#0F1E19',
    border: '#143026',
    success: '#61E3A1',
    muted: '#09120F',
  },
};

export function getColors(preset: ThemePreset = 'neonNight'): Colors {
  return presets[preset];
}

// Backward compatibility - export default colors for existing imports
export const colors = getColors('neonNight');

export const spacing: Spacing = (n: number) => n * 8;

export const radius: Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
};

export const shadow: Shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};

export const typography: Typography = {
  h1: { 
    fontSize: 48, 
    fontWeight: '700' as const, 
    letterSpacing: 0.3,
    allowFontScaling: true,
  },
  h2: { 
    fontSize: 22, 
    fontWeight: '700' as const, 
    letterSpacing: 0.2,
    allowFontScaling: true,
  },
  h3: { 
    fontSize: 18, 
    fontWeight: '600' as const,
    allowFontScaling: true,
  },
  body: { 
    fontSize: 16, 
    fontWeight: '500' as const,
    allowFontScaling: true,
  },
  small: { 
    fontSize: 13, 
    color: '#A9B2C3',
    allowFontScaling: true,
  },
};

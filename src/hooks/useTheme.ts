import { getColors } from '../theme';
import { useThemeContext } from '../theme/ThemeContext';

export function useTheme() {
  let preset: any = 'neonNight';
  try {
    preset = useThemeContext().preset;
  } catch {
    // provider not mounted yet; fall back
  }
  const colors = getColors(preset as any);
  return { colors };
}
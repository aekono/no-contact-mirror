import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useHapticFeedback = () => {
  const { settings } = useAppStore();
  
  const triggerHaptic = useCallback(async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    // Only trigger haptics if enabled in settings
    if (!settings.hapticFeedback) {
      return;
    }
    
    // Haptic feedback is disabled for now due to compatibility issues
    // This can be re-enabled later with proper native module setup
    // When enabled, this would call the appropriate haptic method based on type
  }, [settings.hapticFeedback]);

  return { triggerHaptic };
};

import { Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { CheckIn, SlipUp } from '../types';

interface DebugReportData {
  appVersion: string;
  platform: string;
  locale: string;
  checkInsCount: number;
  slipUpsCount: number;
  reasonsCount: number;
  goalsCount: number;
  achievementsCount: number;
  lastContactAt: string | null;
  currentStreakDays: number;
  longestStreakDays: number;
  notificationsEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  settings: {
    hapticFeedback: boolean;
    soundEffects: boolean;
    animations: boolean;
    followSystemTheme?: boolean;
    highContrast?: boolean;
    reduceMotion?: boolean;
  };
  featureFlags: {
    hasCustomTheme: boolean;
    hasGoals: boolean;
    hasAchievements: boolean;
    hasAnalytics: boolean;
  };
}

export const generateDebugReport = (): string => {
  const store = useAppStore.getState();
  const { 
    lastContactAt, 
    checkIns, 
    slipUps, 
    reasons, 
    goals, 
    achievements,
    notificationsEnabled,
    reminderHour,
    reminderMinute,
    settings
  } = store;

  // Calculate streak data
  const currentStreakDays = (() => {
    if (!lastContactAt) return 0;
    const now = Date.now();
    const start = new Date(lastContactAt).getTime();
    const diff = now - start;
    if (diff < 86400000) return 0;
    return Math.floor(diff / 86400000);
  })();

  const longestStreakDays = (() => {
    if (!slipUps || slipUps.length === 0) {
      return currentStreakDays;
    }
    const events = [...slipUps].sort((a,b) => a.atISO.localeCompare(b.atISO));
    let maxDays = 0;
    let prev = null as string | null;
    for (const e of events) {
      if (prev) {
        const gap = Math.max(0, Math.floor((new Date(e.atISO).getTime() - new Date(prev).getTime()) / 86400000));
        if (gap > maxDays) maxDays = gap;
      }
      prev = e.atISO;
    }
    const last = events[events.length - 1]?.atISO;
    if (last) {
      const gapNow = Math.max(0, Math.floor((Date.now() - new Date(last).getTime()) / 86400000));
      if (gapNow > maxDays) maxDays = gapNow;
    }
    return maxDays;
  })();

  const data: DebugReportData = {
    appVersion: '1.0.0', // Could be read from package.json or app.json
    platform: Platform.OS,
    locale: 'en-US', // Platform.locale not available in React Native
    checkInsCount: checkIns?.length || 0,
    slipUpsCount: slipUps?.length || 0,
    reasonsCount: reasons?.length || 0,
    goalsCount: goals?.length || 0,
    achievementsCount: achievements?.length || 0,
    lastContactAt: lastContactAt ? new Date(lastContactAt).toISOString().split('T')[0] : null,
    currentStreakDays,
    longestStreakDays,
    notificationsEnabled,
    reminderHour,
    reminderMinute,
    settings: {
      hapticFeedback: settings?.hapticFeedback || false,
      soundEffects: settings?.soundEffects || false,
      animations: settings?.animations || false,
      followSystemTheme: settings?.followSystemTheme || false,
      highContrast: settings?.highContrast || false,
      reduceMotion: settings?.reduceMotion || false,
    },
    featureFlags: {
      hasCustomTheme: !!store.customTheme,
      hasGoals: (goals?.length || 0) > 0,
      hasAchievements: (achievements?.length || 0) > 0,
      hasAnalytics: (checkIns?.length || 0) > 0,
    }
  };

  const report = `NO-CONTACT APP DEBUG REPORT
Generated: ${new Date().toISOString()}

APP INFO
- Version: ${data.appVersion}
- Platform: ${data.platform}
- Locale: ${data.locale}

DATA COUNTS
- Check-ins: ${data.checkInsCount}
- Slip-ups: ${data.slipUpsCount}
- Reasons: ${data.reasonsCount}
- Goals: ${data.goalsCount}
- Achievements: ${data.achievementsCount}

STREAK DATA
- Last contact: ${data.lastContactAt || 'Never'}
- Current streak: ${data.currentStreakDays} days
- Longest streak: ${data.longestStreakDays} days

NOTIFICATIONS
- Enabled: ${data.notificationsEnabled}
- Reminder time: ${data.reminderHour.toString().padStart(2, '0')}:${data.reminderMinute.toString().padStart(2, '0')}

SETTINGS
- Haptic feedback: ${data.settings.hapticFeedback}
- Sound effects: ${data.settings.soundEffects}
- Animations: ${data.settings.animations}
- Follow system theme: ${data.settings.followSystemTheme}
- High contrast: ${data.settings.highContrast}
- Reduce motion: ${data.settings.reduceMotion}

FEATURE USAGE
- Custom theme: ${data.featureFlags.hasCustomTheme}
- Goals active: ${data.featureFlags.hasGoals}
- Achievements earned: ${data.featureFlags.hasAchievements}
- Analytics data: ${data.featureFlags.hasAnalytics}

---
This report contains no personal information or journal content.`;

  return report;
};

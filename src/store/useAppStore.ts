import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, CheckIn, SlipUp, ExportData } from '../types';

interface Goal {
  id: string;
  title: string;
  targetDays: number;
  currentDays: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface CustomTheme {
  mode: 'dark' | 'light' | 'auto';
  primaryColor: string;
  accentColor: string;
  successColor: string;
  dangerColor: string;
}

type BackgroundStyle = 'nature' | 'tasteful' | 'bokeh' | 'clean';

// Export persist key for reuse in resetAll
export const PERSIST_KEY = 'no-contact-storage';

// Default state for reset
const DEFAULT_STATE: AppState = {
  lastContactAt: null, // Day 0 state - no streak started yet
  reasons: [
    "I deserve better than this relationship",
    "I'm working on my self-respect and boundaries",
    "Every day of no contact is a step toward healing"
  ],
  checkIns: [],
  slipUps: [],
  notificationsEnabled: false,
  reminderHour: 20,
  reminderMinute: 0,
  _version: 0,
  // Advanced features
  goals: [],
  customTheme: {
    mode: 'dark',
    primaryColor: '#6CA0FF',
    accentColor: '#6CA0FF',
    successColor: '#5ED3A8',
    dangerColor: '#FF6B6B',
  },
  achievements: [],
  backgroundStyle: 'nature' as BackgroundStyle,
  settings: {
    hapticFeedback: true,
    soundEffects: true,
    animations: true,
    reminderMessages: [
      "Remember your reasons. You're healing.",
      "Stay strong. This feeling will pass.",
      "You're doing great. Keep going!",
    ],
  },
};

// Helper function to check if we're in zero state
const isZeroState = (lastContactAt: string | null): boolean => {
  return lastContactAt === null;
};

// Helper function to convert milliseconds to days (floor, clamped to 0)
const msToDaysFloor = (ms: number): number => {
  return Math.max(0, Math.floor(ms / 86400000));
};

// Helper function to get display day count
const getDisplayDayCount = (lastContactAt: string | null, now: number = Date.now()): number => {
  if (isZeroState(lastContactAt)) {
    return 0;
  }
  
  const start = new Date(lastContactAt!).getTime();
  const diffMs = now - start;
  
  // Return 0 until a full 24 hours (86400000 ms) have passed
  if (diffMs < 86400000) {
    return 0;
  }
  
  return msToDaysFloor(diffMs);
};

// Helper function to get current streak days - minute-based, clamped to 0
const getCurrentStreakDays = (lastContactAt: string | null): number => {
  if (!lastContactAt) return 0; // Day 0 state
  
  const start = new Date(lastContactAt).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.floor((now - start) / 60000)); // Convert to minutes
  const days = Math.floor(diffMinutes / 1440); // Convert minutes to days (1440 = 24 * 60)
  
  return Math.max(0, days); // Clamp to >= 0
};

// Helper function to get longest streak days - minute-based, clamped to 0
const getLongestStreakDays = (lastContactAt: string | null, slipUps: SlipUp[]): number => {
  if (slipUps.length === 0 && lastContactAt) {
    // No slip-ups, just count from last contact to now
    return getCurrentStreakDays(lastContactAt);
  }

  if (slipUps.length === 0) {
    return 0; // No slip-ups and no lastContactAt = Day 0
  }

  // Sort slip-ups by date (oldest first)
  const sortedSlipUps = [...slipUps].sort((a, b) => 
    new Date(a.atISO).getTime() - new Date(b.atISO).getTime()
  );

  let maxStreak = 0;

  // Calculate intervals between consecutive slip-ups using minute-based math
  for (let i = 1; i < sortedSlipUps.length; i++) {
    const prevSlipUp = sortedSlipUps[i - 1];
    const currentSlipUp = sortedSlipUps[i];
    
    const prevTime = new Date(prevSlipUp.atISO).getTime();
    const currentTime = new Date(currentSlipUp.atISO).getTime();
    const diffMinutes = Math.max(0, Math.floor((currentTime - prevTime) / 60000));
    const streakDays = Math.floor(diffMinutes / 1440);
    
    maxStreak = Math.max(maxStreak, streakDays);
  }

  // Consider the interval from the most recent slip-up to now
  if (sortedSlipUps.length > 0) {
    const lastSlipUp = sortedSlipUps[sortedSlipUps.length - 1];
    const currentStreak = getCurrentStreakDays(lastSlipUp.atISO);
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  return Math.max(0, maxStreak); // Clamp to >= 0
};

interface AppStore extends AppState {
  // Actions
  setReasons: (reasons: string[]) => void;
  setLastContactNow: () => void;
  resetWithSlipUp: (trigger: string, note?: string) => void;
  addCheckIn: (mood: number, note?: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReminderTime: (hour: number, minute: number) => void;
  deleteCheckIn: (id: string) => void;
  deleteSlipUp: (id: string) => void;
  exportJson: () => string;
  resetAll: () => Promise<void>;
  importData: (importedData: Partial<ExportData>) => boolean;
  
  // Advanced features
  addGoal: (title: string, targetDays: number) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setCustomTheme: (theme: CustomTheme) => void;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  
  // Computed getters
  isZeroState: boolean;
  displayDayCount: number;
  currentStreakDays: number;
  longestStreakDays: number;
  backgroundStyle: BackgroundStyle;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setReasons: (reasons: string[]) => set({ reasons }),
      
      setLastContactNow: () => {
        const now = new Date().toISOString();
        set({ lastContactAt: now });
      },
      
      resetWithSlipUp: (trigger: string, note?: string) => {
        const now = new Date().toISOString();
        const slipUp: SlipUp = {
          id: Date.now().toString(),
          atISO: now,
          trigger: trigger || 'Unknown trigger',
          note
        };
        
        set(state => ({
          lastContactAt: null, // Reset to Day 0 (zero state) - user must manually start again
          slipUps: [...state.slipUps, slipUp],
          _version: state._version + 1
        }));
      },

      addCheckIn: (mood: number, note?: string) => {
        const now = new Date().toISOString();
        const today = new Date().toISOString().split('T')[0];
        
        // Check if there's already a check-in for today
        const existingCheckInIndex = get().checkIns.findIndex(
          checkIn => checkIn.dateISO.startsWith(today)
        );

        const newCheckIn: CheckIn = {
          id: Date.now().toString(),
          dateISO: now,
          mood,
          note
        };

        if (existingCheckInIndex >= 0) {
          // Replace existing check-in for today
          set(state => ({
            checkIns: [
              ...state.checkIns.slice(0, existingCheckInIndex),
              newCheckIn,
              ...state.checkIns.slice(existingCheckInIndex + 1)
            ]
          }));
        } else {
          // Add new check-in
          set(state => ({
            checkIns: [...state.checkIns, newCheckIn]
          }));
        }
      },

      setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),
      
      setReminderTime: (hour: number, minute: number) => set({ reminderHour: hour, reminderMinute: minute }),

      deleteCheckIn: (id: string) => {
        set(state => ({
          checkIns: state.checkIns.filter(checkIn => checkIn.id !== id)
        }));
      },

      deleteSlipUp: (id: string) => {
        set(state => ({
          slipUps: state.slipUps.filter(slipUp => slipUp.id !== id)
        }));
      },

      exportJson: (): string => {
        const state = get();
        const exportData: ExportData = {
          lastContactAt: state.lastContactAt,
          reasons: state.reasons,
          checkIns: state.checkIns,
          slipUps: state.slipUps,
          notificationsEnabled: state.notificationsEnabled,
          reminderHour: state.reminderHour,
          reminderMinute: state.reminderMinute,
          exportDate: new Date().toISOString(),
          currentStreakDays: getCurrentStreakDays(state.lastContactAt),
          longestStreakDays: getLongestStreakDays(state.lastContactAt, state.slipUps)
        };
        return JSON.stringify(exportData, null, 2);
      },

      resetAll: async (): Promise<void> => {
        try {
          // Clear persisted storage
          await AsyncStorage.removeItem(PERSIST_KEY);
          
          // Reset in-memory state to defaults with version bump
          const newState = {
            ...DEFAULT_STATE,
            _version: (get()._version || 0) + 1
          };
          
          set(newState);
        } catch (error) {
          console.error('Error during reset:', error);
          // Fallback: just reset in-memory state
          const fallbackState = {
            ...DEFAULT_STATE,
            _version: (get()._version || 0) + 1
          };
          set(fallbackState);
        }
      },

      importData: (importedData: Partial<ExportData>): boolean => {
        try {
          // Validate the imported data
          const requiredFields = ['lastContactAt', 'reasons', 'checkIns', 'slipUps'];
          const hasRequiredFields = requiredFields.every(field => importedData.hasOwnProperty(field));
          
          if (!hasRequiredFields) {
            throw new Error('Invalid data structure');
          }

          // Import the data with version bump to trigger re-renders
          set({
            lastContactAt: importedData.lastContactAt || null,
            reasons: importedData.reasons || DEFAULT_STATE.reasons,
            checkIns: importedData.checkIns || [],
            slipUps: importedData.slipUps || [],
            notificationsEnabled: importedData.notificationsEnabled || false,
            reminderHour: importedData.reminderHour || 20,
            reminderMinute: importedData.reminderMinute || 0,
            _version: (get()._version || 0) + 1
          });

          return true;
        } catch (error) {
          console.error('Error importing data:', error);
          return false;
        }
      },

      // Advanced features
      addGoal: (title: string, targetDays: number) => {
        const newGoal: Goal = {
          id: Date.now().toString(),
          title,
          targetDays,
          currentDays: 0,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          goals: [...state.goals, newGoal]
        }));
      },

      updateGoal: (id: string, updates: Partial<Goal>) => {
        set(state => ({
          goals: state.goals.map(goal => 
            goal.id === id ? { ...goal, ...updates } : goal
          )
        }));
      },

      deleteGoal: (id: string) => {
        set(state => ({
          goals: state.goals.filter(goal => goal.id !== id)
        }));
      },

      setCustomTheme: (theme: CustomTheme) => {
        set({ customTheme: theme });
      },

      setBackgroundStyle: (style: BackgroundStyle) => {
        set({ backgroundStyle: style });
      },

      updateSettings: (settings: Partial<AppState['settings']>) => {
        set(state => ({
          settings: { ...state.settings, ...settings }
        }));
      },

      // Computed getters
      get isZeroState() {
        return isZeroState(get().lastContactAt);
      },

      get displayDayCount() {
        return getDisplayDayCount(get().lastContactAt);
      },

      get currentStreakDays() {
        return getCurrentStreakDays(get().lastContactAt);
      },

      get longestStreakDays() {
        return getLongestStreakDays(get().lastContactAt, get().slipUps);
      }
    }),
    {
      name: PERSIST_KEY,
      version: 3, // Bump version to force migration
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            notificationsEnabled: false,
            reminderHour: 20,
            reminderMinute: 0,
          };
        }
        if (version === 1) {
          return {
            ...persistedState,
            _version: 0,
          };
        }
        if (version === 2) {
          return {
            ...persistedState,
            _version: (persistedState._version || 0) + 1,
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => state, // Ensure all state is persisted
    }
  )
);

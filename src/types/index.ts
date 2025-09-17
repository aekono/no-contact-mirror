// Core app types
export interface CheckIn {
  id: string;
  dateISO: string;
  mood: number; // 1-5 scale
  note?: string;
}

export interface SlipUp {
  id: string;
  atISO: string;
  trigger: string;
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetDays: number;
  currentDays: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CustomTheme {
  mode: 'dark' | 'light' | 'auto';
  primaryColor: string;
  accentColor: string;
  successColor: string;
  dangerColor: string;
}

export interface AppSettings {
  hapticFeedback: boolean;
  soundEffects: boolean;
  animations: boolean;
  reminderMessages: string[];
  followSystemTheme?: boolean;
  highContrast?: boolean;
  reduceMotion?: boolean;
}

export interface AppState {
  lastContactAt: string | null;
  reasons: string[];
  checkIns: CheckIn[];
  slipUps: SlipUp[];
  notificationsEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  _version: number;
  // Advanced features
  goals: Goal[];
  customTheme: CustomTheme;
  achievements: string[];
  settings: AppSettings;
}

// Navigation types
export type RootStackParamList = {
  Tabs: undefined;
  Home: undefined;
  Journal: undefined;
  History: undefined;
  EditReasons: undefined;
  Settings: undefined;
  Analytics: undefined;
  AdvancedSettings: undefined;
  ThemePresets: undefined;
  Achievements: undefined;
  About: undefined;
  Feedback: undefined;
  SOS: undefined;
};

// Component prop types
export interface EmojiSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export interface SlipUpModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (trigger: string, note?: string) => void;
}

// Hook types
export interface UseTimerReturn {
  days: number;
  hours: number;
  minutes: number;
}

export interface UseDebouncedActionReturn {
  (...args: any[]): void;
}

// Theme types
export interface Colors {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  accent: string;
  danger: string;
  chip: string;
  border: string;
  success: string;
  muted: string;
  buttonText?: string;
  textOnAccent?: string;
  inverseText?: string;
}

export interface Typography {
  h1: {
    fontSize: number;
    fontWeight: '700';
    letterSpacing: number;
    allowFontScaling?: boolean;
  };
  h2: {
    fontSize: number;
    fontWeight: '700';
    letterSpacing: number;
    allowFontScaling?: boolean;
  };
  h3: {
    fontSize: number;
    fontWeight: '600';
    allowFontScaling?: boolean;
  };
  body: {
    fontSize: number;
    fontWeight: '500';
    allowFontScaling?: boolean;
  };
  small: {
    fontSize: number;
    color: string;
    allowFontScaling?: boolean;
  };
}

export interface Spacing {
  (n: number): number;
}

export interface Radius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Shadow {
  card: object;
  soft: object;
}

// Notification types
export interface NotificationConfig {
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
}

// Export/Import types
export interface ExportData {
  lastContactAt: string | null;
  reasons: string[];
  checkIns: CheckIn[];
  slipUps: SlipUp[];
  notificationsEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  exportDate: string;
  currentStreakDays: number;
  longestStreakDays: number;
}

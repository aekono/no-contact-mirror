import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radius } from '../theme';
import { useAppStore } from '../store/useAppStore';

const QUOTES = {
  early: [
    'Every day of no contact is a step toward healing.',
    'You can miss the past and still choose your future.',
    'Discomfort is temporary. Peace is permanent.',
    'Protect your energy. Progress loves boundaries.',
  ],
  mid: [
    'Momentum beats motivation. One day at a time.',
    'You\'re building a life that fits you better. Keep going.',
    'Clarity grows in quiet spaces. Guard yours.',
  ],
  late: [
    'Your peace is precious. Treat it like it is.',
    'Healing compounds—today adds to the whole.',
    'You\'re not who you were. That\'s progress.',
  ],
  veteran: [
    'Quiet is a superpower. You\'ve earned it.',
    'Boundaries are love for yourself.',
    'Your future self is grateful for this streak.',
  ]
} as const;

function pickBand(days: number | null) {
  if (!days || days < 7) return 'early' as const;
  if (days < 30) return 'mid' as const;
  if (days < 90) return 'late' as const;
  return 'veteran' as const;
}

function RightDoodle() {
  // A small abstract corner doodle, tinted by theme
  const { colors } = useTheme();
  return (
    <Svg width={90} height={64} viewBox="0 0 90 64" style={{ position:'absolute', right: spacing(1), bottom: spacing(1), opacity: 0.25 }}>
      <Path d="M10 40 C20 10, 70 10, 80 40 S70 60, 45 52 0 55, 10 40 Z" fill={colors.bg} />
    </Svg>
  );
}

export default function QuoteBanner() {
  const { colors } = useTheme();
  const { lastContactAt, reasons } = useAppStore();

  const days = useMemo(() => {
    if (!lastContactAt) return 0;
    const diff = Date.now() - new Date(lastContactAt).getTime();
    return Math.max(0, Math.floor(diff / 86400000));
  }, [lastContactAt]);

  const quote = useMemo(() => {
    const band = pickBand(days);
    const pool = QUOTES[band];
    const dailyIndex = new Date().getDate() % pool.length;
    // Every 5th day, surface a user reason if available
    if ((new Date().getDate() % 5 === 0) && reasons && reasons.length > 0) {
      const r = reasons[new Date().getDate() % reasons.length];
      return `Remember: ${r}`;
    }
    return pool[dailyIndex];
  }, [days, reasons]);

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.08)', // Light/translucent surface
        borderColor: colors.forest?.[700] || colors.border,
      }
    ]}>
      <RightDoodle />
      <Text 
        style={[typography.h3 as any, { color: colors.text }]}
        numberOfLines={3} // Consistent numberOfLines={3}
      >
        {quote}
      </Text>
      <Text style={[typography.body, { color: colors.subtext, marginTop: spacing(0.5) }]}>
        Stay the course. Future‑you is grateful.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing(2),
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 44, // Min 44px tap target
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

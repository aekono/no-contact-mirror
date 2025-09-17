import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

type Kind = 'analytics' | 'history' | 'achievements';
export default function EmptyStateArt({ kind = 'analytics' as Kind }) {
  const { colors } = useTheme();
  if (kind === 'analytics') {
    return (
      <Svg width={68} height={48} viewBox="0 0 68 48">
        <Rect x="2" y="18" width="12" height="26" rx="3" fill={colors.card} stroke={colors.border} />
        <Rect x="20" y="10" width="12" height="34" rx="3" fill={colors.card} stroke={colors.border} />
        <Rect x="38" y="24" width="12" height="20" rx="3" fill={colors.card} stroke={colors.border} />
        <Path d="M4 36 L26 20 L44 28 L64 14" stroke={colors.accent} strokeWidth={2} fill="none" />
        <Circle cx="64" cy="14" r="3" fill={colors.accent} />
      </Svg>
    );
  }
  if (kind === 'achievements') {
    return (
      <Svg width={60} height={48} viewBox="0 0 60 48">
        <Circle cx="30" cy="18" r="14" stroke={colors.border} fill={colors.card} />
        <Path d="M30 8 A10 10 0 0 1 40 18" stroke={colors.accent} strokeWidth={2} fill="none" />
        <Path d="M22 34 L38 34 L36 42 L24 42 Z" fill={colors.card} stroke={colors.border} />
      </Svg>
    );
  }
  // history
  return (
    <Svg width={64} height={48} viewBox="0 0 64 48">
      <Circle cx="24" cy="24" r="16" stroke={colors.border} fill={colors.card} />
      <Path d="M24 16 L24 24 L30 24" stroke={colors.accent} strokeWidth={2} fill="none" />
      <Path d="M44 8 L56 8 L56 40 L44 40 Z" fill={colors.card} stroke={colors.border} />
      <Circle cx="50" cy="12" r="2" fill={colors.accent} />
    </Svg>
  );
}

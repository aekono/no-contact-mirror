import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, shadow, typography } from '../theme';

interface Props {
  label: string;
  value: string;
  hint?: string;
}

export default function KpiCard({ label, value, hint }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[
      {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing(2),
        borderWidth: 1,
        borderColor: colors.border
      },
      shadow.soft
    ]}>
      <Text style={[typography.small as any, { color: colors.subtext }]}>{label}</Text>
      <Text style={[typography.h2 as any, { color: colors.text, marginTop: spacing(0.5) }]}>{value}</Text>
      {hint ? <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>{hint}</Text> : null}
    </View>
  );
}

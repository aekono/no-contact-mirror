import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing, radius, typography, shadow } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function MiniPreviewCard({ title, subtitle, icon, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={title}
      style={({ pressed }) => ([
        {
          flex: 1,
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing(2),
          borderWidth: 1,
          borderColor: colors.border,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        shadow.soft
      ])}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={22} color={colors.accent} />
        <Text style={[typography.h3 as any, { color: colors.text, marginLeft: spacing(1) }]}>{title}</Text>
      </View>
      {subtitle ? (
        <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>{subtitle}</Text>
      ) : null}
    </Pressable>
  );
}

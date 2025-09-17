import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../theme';

interface PanicActionProps {
  onPress: () => void;
}

export function PanicAction({ onPress }: PanicActionProps) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.forest?.[600] || '#1F4A2A', // Deeper Nature green token
          minHeight: spacing(6), // >= spacing.xl
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} // hitSlop 8-12
      accessible
      accessibilityRole="button"
      accessibilityLabel="I'm struggling - get help now"
    >
      <Text style={[
        typography.body, // Button typography token
        styles.buttonText,
        { color: colors.text }
      ]}>
        I'm struggling
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

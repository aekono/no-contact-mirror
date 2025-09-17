import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { EmojiSliderProps } from '../types';

const EMOJIS = [
  { emoji: '😭', label: 'Terrible', value: 1 },
  { emoji: '😢', label: 'Bad', value: 2 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😄', label: 'Great', value: 5 },
];

const EmojiSliderComponent: React.FC<EmojiSliderProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1.5), textAlign: 'center' }]}>
        How are you feeling today?
      </Text>
      <View style={styles.emojiRow}>
        {EMOJIS.map(({ emoji, label, value: moodValue }) => (
          <Pressable
            key={moodValue}
            style={[
              styles.emojiButton,
              value === moodValue && styles.selectedEmoji
            ]}
            onPress={() => onChange(moodValue)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${label} mood`}
            accessibilityHint={`Currently ${value === moodValue ? 'selected' : 'not selected'}`}
            accessibilityState={{ selected: value === moodValue }}
            testID={`emoji-${moodValue}`}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={[
              styles.emojiLabel,
              value === moodValue && styles.selectedEmojiLabel
            ]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export const EmojiSlider = memo(EmojiSliderComponent);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(2),
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emojiButton: {
    alignItems: 'center',
    padding: spacing(1),
    borderRadius: radius.md,
    minWidth: 60,
    minHeight: 44, // Minimum touch target
  },
  selectedEmoji: {
    backgroundColor: colors.accent,
  },
  emoji: {
    fontSize: 32,
    marginBottom: spacing(0.5),
  },
  emojiLabel: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
  },
  selectedEmojiLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});

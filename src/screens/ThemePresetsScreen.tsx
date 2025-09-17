import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useThemeContext } from '../theme/ThemeContext';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Button } from '../components/UI';

const THEME_PRESETS = [
  {
    id: 'neonNight',
    name: 'Calm',
    description: 'Soft and peaceful',
    colors: ['#6CA0FF', '#5ED3A8', '#FF6B6B', '#A9B2C3']
  },
  {
    id: 'auroraCalm',
    name: 'Midnight',
    description: 'Dark and focused',
    colors: ['#5AD0C8', '#5ED3A8', '#FF7A7A', '#A9C7CF']
  },
  {
    id: 'midnightPeach',
    name: 'Forest',
    description: 'Natural and earthy',
    colors: ['#5FDB8A', '#61E3A1', '#FF6B6B', '#A8C1B2']
  },
  {
    id: 'forestGlow',
    name: 'Orchid',
    description: 'Warm and cozy',
    colors: ['#C07CFF', '#7ED7B7', '#FF7A92', '#C9B6C6']
  }
] as const;

export default function ThemePresetsScreen() {
  const { colors: themeColors } = useTheme();
  const { preset, setPreset } = useThemeContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ padding: spacing(2) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center' }]}>
            Theme presets
          </Text>
          <Text style={[typography.body, { color: themeColors.subtext, textAlign: 'center', marginTop: spacing(1) }]}>
            Pick a look. You can fine-tune in Advanced Settings.
          </Text>
        </View>

        <View style={styles.presetsGrid}>
          {THEME_PRESETS.map((presetItem) => (
            <Card 
              key={presetItem.id} 
              style={[
                styles.presetCard,
                preset === presetItem.id && styles.selectedPresetCard,
                { borderColor: preset === presetItem.id ? themeColors.accent : themeColors.border }
              ]}
            >
              <Pressable
                onPress={() => setPreset(presetItem.id)}
                style={styles.presetPressable}
                testID={`preset-${presetItem.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Select ${presetItem.name} theme`}
                accessibilityState={{ selected: preset === presetItem.id }}
              >
                <View style={styles.colorSwatches}>
                  {presetItem.colors.map((color, index) => (
                    <View
                      key={index}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color }
                      ]}
                    />
                  ))}
                </View>
                <Text style={[typography.h3, { color: themeColors.text, marginTop: spacing(1) }]}>
                  {presetItem.name}
                </Text>
                <Text style={[typography.small, { color: themeColors.subtext }]}>
                  {presetItem.description}
                </Text>
                {preset === presetItem.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: themeColors.accent }]}>
                    <Text style={[typography.small, { color: themeColors.bg }]}>
                      Selected
                    </Text>
                  </View>
                )}
              </Pressable>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: spacing(3),
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  presetCard: {
    width: '47%',
    minHeight: 120,
  },
  selectedPresetCard: {
    borderWidth: 2,
  },
  presetPressable: {
    alignItems: 'center',
    padding: spacing(1.5),
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: spacing(0.5),
    marginBottom: spacing(0.5),
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing(0.5),
    right: spacing(0.5),
    paddingHorizontal: spacing(0.5),
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
});

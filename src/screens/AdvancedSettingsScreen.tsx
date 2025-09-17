import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Button, Col, SectionTitle } from '../components/UI';
import { 
  getAllSurfaces, 
  getAllCategories, 
  getCategoriesForSurface, 
  getMessagesByCategory,
  initializeContentStore,
  isContentLoaded 
} from '../content/contentStore';

export default function AdvancedSettingsScreen() {
  const { 
    settings, 
    updateSettings
  } = useAppStore();
  
  const { colors: themeColors } = useTheme();
  const navigation = useNavigation<any>();
  const [showContentDebug, setShowContentDebug] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  
  const handleSettingToggle = useCallback((key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  useEffect(() => {
    const checkContentLoaded = async () => {
      await initializeContentStore();
      setContentLoaded(isContentLoaded());
    };
    checkContentLoaded();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ padding: spacing(2) }}
        showsVerticalScrollIndicator={false}
      >
        <Col gap={2}>
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center' }]}>
            Advanced appearance
          </Text>
          <Text style={[typography.body, { color: themeColors.subtext, textAlign: 'center', marginBottom: spacing(1) }]}>
            Fine-tune how the app looks and feels.
          </Text>

          {/* App Preferences */}
          <Card>
            <SectionTitle>App Preferences</SectionTitle>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[typography.body, { color: themeColors.text }]}>
                  Follow system theme
                </Text>
                <Text style={[typography.small, { color: themeColors.subtext }]}>
                  Automatically switch between light and dark mode
                </Text>
              </View>
              <Switch
                value={settings.followSystemTheme || false}
                onValueChange={(value) => handleSettingToggle('followSystemTheme', value)}
                trackColor={{ false: themeColors.border, true: themeColors.accent }}
                thumbColor={settings.followSystemTheme ? themeColors.text : themeColors.subtext}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[typography.body, { color: themeColors.text }]}>
                  High contrast
                </Text>
                <Text style={[typography.small, { color: themeColors.subtext }]}>
                  Increase contrast for better readability
                </Text>
              </View>
              <Switch
                value={settings.highContrast || false}
                onValueChange={(value) => handleSettingToggle('highContrast', value)}
                trackColor={{ false: themeColors.border, true: themeColors.accent }}
                thumbColor={settings.highContrast ? themeColors.text : themeColors.subtext}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[typography.body, { color: themeColors.text }]}>
                  Reduce motion
                </Text>
                <Text style={[typography.small, { color: themeColors.subtext }]}>
                  Minimize animations and transitions
                </Text>
              </View>
              <Switch
                value={settings.reduceMotion || false}
                onValueChange={(value) => handleSettingToggle('reduceMotion', value)}
                trackColor={{ false: themeColors.border, true: themeColors.accent }}
                thumbColor={settings.reduceMotion ? themeColors.text : themeColors.subtext}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[typography.body, { color: themeColors.text }]}>
                  Haptic feedback
                </Text>
                <Text style={[typography.small, { color: themeColors.subtext }]}>
                  Feel vibrations when interacting with the app
                </Text>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => handleSettingToggle('hapticFeedback', value)}
                trackColor={{ false: themeColors.border, true: themeColors.accent }}
                thumbColor={settings.hapticFeedback ? themeColors.text : themeColors.subtext}
              />
            </View>
          </Card>

          {/* Theme Presets Link */}
          <Card>
            <SectionTitle>Theme Presets</SectionTitle>
            <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(2) }]}>
              Choose from curated theme presets designed for different moods and preferences.
            </Text>
            <Button
              label="Choose a theme preset"
              tone="accent"
              onPress={() => navigation.navigate('ThemePresets')}
              full
            />
          </Card>

          {/* Dev-only Content Debug */}
          {__DEV__ && (
            <Card>
              <SectionTitle>Content Debug (Dev Only)</SectionTitle>
              <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(2) }]}>
                Content loaded: {contentLoaded ? 'Yes' : 'No'}
              </Text>
              <Button
                label={showContentDebug ? "Hide Content Debug" : "Show Content Debug"}
                tone="neutral"
                onPress={() => setShowContentDebug(!showContentDebug)}
                full
              />
              
              {showContentDebug && (
                <View style={styles.debugContent}>
                  <Text style={[typography.h3, { color: themeColors.text, marginTop: spacing(2) }]}>
                    Surfaces & Categories
                  </Text>
                  {getAllSurfaces().map(surface => {
                    const categories = getCategoriesForSurface(surface);
                    return (
                      <View key={surface} style={styles.debugSection}>
                        <Text style={[typography.body, { color: themeColors.accent, fontWeight: '600' }]}>
                          {surface}
                        </Text>
                        <Text style={[typography.small, { color: themeColors.subtext }]}>
                          Categories: {categories.join(', ')}
                        </Text>
                        {categories.slice(0, 2).map(category => {
                          const messages = getMessagesByCategory(category);
                          return (
                            <View key={category} style={styles.debugCategory}>
                              <Text style={[typography.small, { color: themeColors.text, fontWeight: '500' }]}>
                                {category} ({messages.length} messages)
                              </Text>
                              {messages.slice(0, 2).map(msg => (
                                <Text key={msg.id} style={[typography.small, { color: themeColors.subtext, marginLeft: spacing(1) }]}>
                                  • {msg.text}
                                </Text>
                              ))}
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              )}
            </Card>
          )}
        </Col>
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing(2),
  },
  debugContent: {
    marginTop: spacing(1),
  },
  debugSection: {
    marginBottom: spacing(2),
    padding: spacing(1.5),
    backgroundColor: colors.muted,
    borderRadius: radius.md,
  },
  debugCategory: {
    marginTop: spacing(1),
    marginLeft: spacing(1),
  },
});
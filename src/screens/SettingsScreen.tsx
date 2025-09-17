import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { Card, SectionTitle, Col } from '../components/UI';
import { useTheme } from '../hooks/useTheme';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { colors: themeColors } = useTheme();

  const SettingRow = ({ title, onPress, icon }: { title: string; onPress: () => void; icon: string }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={styles.settingContent}>
        <Ionicons name={icon as any} size={20} color={themeColors.text} />
        <Text style={[typography.body, { color: themeColors.text, marginLeft: spacing(1) }]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={themeColors.subtext} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Col gap={2}>
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center' }] as any}>
            Settings
          </Text>
          
          <Card>
            <SettingRow
              title="Theme presets"
              onPress={() => navigation.navigate('ThemePresets')}
              icon="color-palette"
            />
            <SettingRow
              title="Advanced settings"
              onPress={() => navigation.navigate('AdvancedSettings')}
              icon="settings"
            />
            <SettingRow
              title="Crisis Resources (SOS)"
              onPress={() => navigation.navigate('SOS')}
              icon="medical"
            />
            <SettingRow
              title="Feedback & Support"
              onPress={() => navigation.navigate('Feedback')}
              icon="chatbubble"
            />
            <SettingRow
              title="About"
              onPress={() => navigation.navigate('About')}
              icon="information-circle"
            />
          </Card>
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
  content: {
    padding: spacing(2),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

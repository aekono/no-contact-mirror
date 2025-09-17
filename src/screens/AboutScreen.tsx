import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, typography } from '../theme';
import { Card, Col } from '../components/UI';

export default function AboutScreen() {
  const { colors: themeColors } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Col gap={2}>
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center' }] as any}>
            About
          </Text>
          
          <Card>
            <Text style={[typography.h3, { color: themeColors.text, marginBottom: spacing(1) }] as any}>
              No-Contact App
            </Text>
            <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(2) }] as any}>
              A supportive companion for your no-contact journey. Track your progress, 
              log daily check-ins, and stay motivated with gentle reminders of your reasons.
            </Text>
            <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(1) }] as any}>
              Version 1.0.0
            </Text>
            <Text style={[typography.small, { color: themeColors.subtext }] as any}>
              Built with React Native and Expo
            </Text>
          </Card>

          <Card>
            <Text style={[typography.h3, { color: themeColors.text, marginBottom: spacing(1) }] as any}>
              Privacy
            </Text>
            <Text style={[typography.body, { color: themeColors.subtext }] as any}>
              Your data is stored locally on your device and never shared with third parties. 
              You have full control over your information.
            </Text>
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
});

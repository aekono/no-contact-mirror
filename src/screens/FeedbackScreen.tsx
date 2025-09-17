import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  Clipboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Button, SectionTitle, Col } from '../components/UI';
import { generateDebugReport } from '../helpers/debugReport';

export default function FeedbackScreen() {
  const { colors: themeColors } = useTheme();
  const insets = useSafeAreaInsets();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const subjectInputRef = useRef<TextInput>(null);
  const messageInputRef = useRef<TextInput>(null);

  const handleSendEmail = () => {
    if (!message.trim()) {
      Alert.alert('Message required', 'Please enter a message before sending feedback.');
      return;
    }

    const emailSubject = subject.trim() || 'No-Contact App Feedback';
    const emailBody = `Hi there,

${message.trim()}

---
Sent from No-Contact App`;

    const mailtoUrl = `mailto:support@no-contact-app.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    Linking.openURL(mailtoUrl).catch((err) => {
      Alert.alert('Error', 'Could not open email client. Please try again.');
      console.error('Failed to open mailto:', err);
    });
  };

  const handleSaveLocally = () => {
    if (!message.trim()) {
      Alert.alert('Message required', 'Please enter a message before saving feedback.');
      return;
    }

    // In a real app, this would save to a local database
    // For now, we'll just show a confirmation
    Alert.alert(
      'Feedback saved',
      'Your feedback has been saved locally. Thank you for your input!',
      [{ text: 'OK' }]
    );

    // Clear the form
    setSubject('');
    setMessage('');
  };

  const handleCopyDebugReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      const report = generateDebugReport();
      await Clipboard.setString(report);
      
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy debug report to clipboard.');
      console.error('Failed to copy debug report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bg }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + spacing(2) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Col gap={2}>
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center' }]}>
            Feedback & Support
          </Text>
          
          <Text style={[typography.body, { color: themeColors.subtext, textAlign: 'center', marginBottom: spacing(1) }]}>
            We'd love to hear from you! Send us feedback or get help with the app.
          </Text>

          {/* Feedback Form */}
          <Card>
            <SectionTitle>Send Feedback</SectionTitle>
            
            <View style={styles.inputGroup}>
              <Text style={[typography.body, { color: themeColors.text, marginBottom: spacing(0.5) }]}>
                Subject (optional)
              </Text>
              <TextInput
                ref={subjectInputRef}
                style={[styles.input, { 
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                  color: themeColors.text
                }]}
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your feedback"
                placeholderTextColor={themeColors.subtext}
                returnKeyType="next"
                onSubmitEditing={() => messageInputRef.current?.focus()}
                accessibilityLabel="Feedback subject"
                testID="feedback-subject-input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[typography.body, { color: themeColors.text, marginBottom: spacing(0.5) }]}>
                Message *
              </Text>
              <TextInput
                ref={messageInputRef}
                style={[styles.textArea, { 
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                  color: themeColors.text
                }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us what's on your mind..."
                placeholderTextColor={themeColors.subtext}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                accessibilityLabel="Feedback message"
                testID="feedback-message-input"
              />
            </View>

            <View style={styles.buttonRow}>
              <Button
                label="Send via email"
                tone="accent"
                onPress={handleSendEmail}
                style={{ flex: 1, marginRight: spacing(1) }}
                accessibilityLabel="Send feedback via email"
              />
              <Button
                label="Save locally"
                tone="neutral"
                onPress={handleSaveLocally}
                style={{ flex: 1, marginLeft: spacing(1) }}
                accessibilityLabel="Save feedback locally"
              />
            </View>
          </Card>

          {/* Debug Report */}
          <Card>
            <SectionTitle>Debug Information</SectionTitle>
            
            <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(1) }]}>
              If you're experiencing issues, you can copy a debug report to share with support. 
              This report contains app statistics and settings (no personal data).
            </Text>

            <Button
              label={isGeneratingReport ? 'Generating...' : 'Copy debug report'}
              tone="neutral"
              onPress={handleCopyDebugReport}
              disabled={isGeneratingReport}
              full
              accessibilityLabel="Copy debug report to clipboard"
            />

            {showCopiedToast && (
              <View style={[styles.toast, { backgroundColor: themeColors.success }]}>
                <Text style={[typography.body, { color: themeColors.text, textAlign: 'center' }]}>
                  ✓ Debug report copied to clipboard
                </Text>
              </View>
            )}
          </Card>

          {/* Support Information */}
          <Card>
            <SectionTitle>Other Ways to Get Help</SectionTitle>
            
            <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(1) }]}>
              • Check the About screen for app information
              • Review your settings in Advanced Settings
              • Restart the app if you're experiencing issues
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
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing(2),
  },
  inputGroup: {
    marginBottom: spacing(2),
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing(2),
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing(2),
    fontSize: 16,
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing(1),
  },
  toast: {
    marginTop: spacing(1),
    padding: spacing(1.5),
    borderRadius: radius.md,
  },
});

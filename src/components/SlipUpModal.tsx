import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebouncedAction } from '../hooks/useDebouncedAction';
import { useSurfaceMessage } from '../hooks/useSurfaceMessage';
import { colors, spacing, radius, shadow, typography } from '../theme';
import { Card, Button, Col } from './UI';
import { SlipUpModalProps } from '../types';

export default function SlipUpModal({ visible, onClose, onSave }: SlipUpModalProps) {
  const insets = useSafeAreaInsets();
  const [trigger, setTrigger] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const triggerInputRef = useRef<TextInput>(null);
  const noteInputRef = useRef<TextInput>(null);
  
  // Get reset message for slip flow
  const { message: resetMessage } = useSurfaceMessage("Slip / Reset Flow");

  // Create debounced save action
  const debouncedSave = useDebouncedAction(async (triggerText: string, noteText: string) => {
    if (!triggerText.trim()) return;
    
    setSaving(true);
    try {
      // Call the store action
      onSave(triggerText.trim(), noteText.trim());
      
      // Clear form
      setTrigger('');
      setNote('');
      
      // Close modal immediately
      onClose();
      
      // Optional: Show confirmation (platform-safe)
      if (Platform.OS === 'ios') {
        Alert.alert('Saved', 'Timer has been reset');
      }
    } catch (error) {
      console.error('Error saving slip-up:', error);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }, 400);

  // Autofocus trigger input when modal opens
  useEffect(() => {
    if (visible && triggerInputRef.current) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        triggerInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleSave = () => {
    debouncedSave(trigger, note);
  };

  const handleClose = () => {
    setTrigger('');
    setNote('');
    onClose();
  };

  const handleTriggerSubmit = () => {
    noteInputRef.current?.focus();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
          >
            <SafeAreaView style={styles.sheet}>
              <View style={styles.headerRow}>
                <Text style={[typography.h2, { color: colors.text }]}>Slip-Up Reflection</Text>
                <Pressable onPress={handleClose} accessibilityLabel="Close">
                  <Text style={[typography.h1, { color: colors.subtext, fontSize: 32 }]}>×</Text>
                </Pressable>
              </View>

              <ScrollView 
                style={styles.content}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
              >
                <Col gap={2}>
                  {/* Reset message */}
                  {resetMessage && (
                    <View style={[styles.resetMessage, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
                      <Text style={[typography.body, { color: colors.accent, textAlign: 'center', fontWeight: '500' }]}>
                        {resetMessage.text}
                      </Text>
                    </View>
                  )}
                  
                  <Text style={[typography.body, { color: colors.subtext }]}>
                    What triggered you to reach out? Understanding this helps prevent future slip-ups.
                  </Text>

                  <View>
                    <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
                      What triggered this?
                    </Text>
                    <TextInput
                      ref={triggerInputRef}
                      style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                      placeholder="e.g., saw their social media, felt lonely, had a bad day..."
                      placeholderTextColor={colors.subtext}
                      value={trigger}
                      onChangeText={setTrigger}
                      onSubmitEditing={handleTriggerSubmit}
                      returnKeyType="next"
                      maxLength={100}
                      accessibilityLabel="Slip-up trigger"
                      accessibilityHint="Describe what caused you to want to reach out"
                    />
                  </View>

                  <View>
                    <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
                      Additional notes (optional)
                    </Text>
                    <TextInput
                      ref={noteInputRef}
                      style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text }]}
                      placeholder="How are you feeling? What will you do differently next time?"
                      placeholderTextColor={colors.subtext}
                      value={note}
                      onChangeText={setNote}
                      multiline
                      numberOfLines={3}
                      maxLength={200}
                      accessibilityLabel="Slip-up notes"
                      accessibilityHint="Optional: Add any additional thoughts or feelings"
                    />
                  </View>

                  <Button
                    label={saving ? 'Saving...' : 'Reset Timer'}
                    tone="danger"
                    onPress={handleSave}
                    disabled={!trigger.trim() || saving}
                    full
                    large
                    accessibilityLabel="Reset timer and save slip-up reflection"
                  />
                </Col>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.bg,
    marginTop: '20%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadow.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
  resetMessage: {
    padding: spacing(1.5),
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing(1),
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing(1.5),
    fontSize: 16,
    backgroundColor: colors.card,
    minHeight: 48,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

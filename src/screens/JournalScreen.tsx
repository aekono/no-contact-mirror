import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, Alert, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { EmojiSlider } from '../components/EmojiSlider';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { format } from 'date-fns';
import { useDebouncedAction } from '../hooks/useDebouncedAction';
import { useSurfaceMessage } from '../hooks/useSurfaceMessage';
import { useTheme } from '../hooks/useTheme';
import { Card, Button, Col } from '../components/UI';
import { CheckIn } from '../types';

export default function JournalScreen() {
  const { triggerHaptic } = useHapticFeedback();
  const { checkIns, addCheckIn, reasons } = useAppStore();
  const { colors, spacing, radius, shadow, typography } = useTheme();
  const [selectedMood, setSelectedMood] = useState(3);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      flex: 1,
      padding: spacing(2),
      paddingBottom: spacing(4), // Extra padding for iOS home pill
    },
    form: {
      gap: spacing(1),
      marginBottom: spacing(2),
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing(1.5),
      fontSize: 16,
      backgroundColor: colors.muted,
      color: colors.text,
      textAlignVertical: 'top',
    },
    button: {
      paddingVertical: spacing(1.5),
      paddingHorizontal: spacing(2),
      backgroundColor: colors.accent,
      borderRadius: radius.md,
      alignItems: 'center',
      marginTop: spacing(1),
    },
    buttonText: {
      color: colors.text,
      fontWeight: '600',
      fontSize: 16,
    },
    successMessage: {
      marginTop: spacing(1),
      paddingVertical: spacing(1.5),
      paddingHorizontal: spacing(2),
      backgroundColor: colors.success + '20',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.success + '40',
      alignItems: 'center',
    },
    successText: {
      color: colors.success,
      fontWeight: '600',
    },
    checkInList: {
      margin: spacing(2),
      marginBottom: spacing(3),
    },
    checkInItem: {
      paddingVertical: spacing(1.5),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    checkInHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing(0.5),
    },
    checkInEmoji: {
      fontSize: 20,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    noteSection: {
      gap: spacing(1),
      marginBottom: spacing(2),
    },
    noteInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing(1.5),
      fontSize: 16,
      backgroundColor: colors.muted,
      height: 80,
      textAlignVertical: 'top',
      color: colors.text,
    },
    buttonRow: {
      flexDirection: 'row',
      marginTop: spacing(1),
    },
    modalWrap: { 
      flex: 1, 
      backgroundColor: 'rgba(0,0,0,0.35)', 
      justifyContent: 'flex-end' 
    },
    modalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    panicCard: {
      margin: spacing(2),
      marginBottom: spacing(3),
    },
  });
  const [note, setNote] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [panicOpen, setPanicOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const textInputRef = useRef<TextInput>(null);
  
  // Get feedback message for after save
  const { message: checkInFeedback } = useSurfaceMessage("Check-In Feedback (after Save)");

  // Create debounced save action
  const debouncedLogToday = useDebouncedAction(async (mood: number, noteText: string) => {
    try {
      addCheckIn(mood, noteText.trim() || undefined);
      setNote('');
      setIsLogged(true);
      setShowSuccess(true);
      setFeedbackMessage(checkInFeedback?.text || null);
      triggerHaptic('success');
      
      // Blur the text input
      textInputRef.current?.blur();
      
      // Reset confirmation after 5 seconds (longer to show feedback)
      setTimeout(() => {
        setIsLogged(false);
        setShowSuccess(false);
        setFeedbackMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error saving check-in:', error);
      // Reset states on error
      setIsLogged(false);
      setShowSuccess(false);
      setFeedbackMessage(null);
    }
  }, 400);

  const handleLogToday = useCallback(() => {
    triggerHaptic('light');
    debouncedLogToday(selectedMood, note);
  }, [debouncedLogToday, selectedMood, note, triggerHaptic]);

  const handleMoodChange = useCallback((value: number) => {
    triggerHaptic('light');
    setSelectedMood(value);
  }, [triggerHaptic]);

  const renderCheckIn = useCallback(({ item }: { item: CheckIn }) => {
    const date = new Date(item.dateISO);
    const emojis = ['😭', '😢', '😐', '🙂', '😄'];
    
    return (
      <View style={styles.checkInItem}>
        <View style={styles.checkInHeader}>
          <Text style={[typography.body, { color: colors.text }]}>{format(date, 'MMM d, yyyy')}</Text>
          <Text style={styles.checkInEmoji}>{emojis[item.mood - 1]}</Text>
        </View>
        {item.note && (
          <Text style={[typography.body, { color: colors.subtext, lineHeight: 20 }]}>{item.note}</Text>
        )}
      </View>
    );
  }, []);

  const sortedCheckIns = useMemo(() => 
    [...checkIns].sort((a, b) => 
      new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
    ), 
    [checkIns]
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <Col gap={2} style={styles.content}>
        <Text style={[typography.h1, { color: colors.text, textAlign: 'center', marginVertical: spacing(1) }]}>
          Daily check-in
        </Text>

        <Card>
          <EmojiSlider value={selectedMood} onChange={handleMoodChange} />
          
          <View style={styles.noteSection}>
            <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
              How are you feeling right now?
            </Text>
            <TextInput
              ref={textInputRef}
              style={[styles.noteInput, {
                backgroundColor: colors.success + '20',
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: radius.lg,
                padding: spacing(2),
                minHeight: 96,
                color: colors.text
              }]}
              value={note}
              onChangeText={setNote}
              placeholder="How are you feeling right now?"
              placeholderTextColor={colors.subtext}
              multiline
              numberOfLines={3}
              maxLength={140}
              accessibilityLabel="Check-in note"
              accessibilityHint="Optional: Share your thoughts and feelings about today"
              testID="checkin-note-input"
            />
          </View>

          <View style={styles.buttonRow}>
            <Button 
              label={isLogged ? '✓ Saved' : 'Save Check-In'} 
              tone="success" 
              onPress={handleLogToday}
              full
              large
              disabled={isLogged}
              accessibilityLabel={isLogged ? 'Check-in already saved' : 'Save your daily check-in'}
              testID="checkin-cta"
              style={{ flex: 1, marginRight: spacing(1) }}
            />
            <Button
              label="I'm struggling"
              tone="danger"
              onPress={() => {
                triggerHaptic('heavy');
                setPanicOpen(true);
              }}
              accessibilityLabel="Open panic support modal"
              testID="journal-panic-button"
              style={{ flex: 1, marginLeft: spacing(1) }}
            />
          </View>
          
          {showSuccess && (
            <View style={styles.successMessage} testID="checkin-success-message">
              <Text style={[typography.body, { color: colors.success, textAlign: 'center', fontWeight: '600' }]}>
                ✓ Saved
              </Text>
              {feedbackMessage && (
                <Text style={[typography.body, { color: colors.text, textAlign: 'center', marginTop: spacing(1), fontStyle: 'italic' }]}>
                  {feedbackMessage}
                </Text>
              )}
            </View>
          )}
        </Card>

        <Card>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
            Recent Check-Ins
          </Text>
          {checkIns.length > 0 ? (
            <FlatList
              data={sortedCheckIns}
              keyExtractor={(item) => item.id}
              renderItem={renderCheckIn}
              showsVerticalScrollIndicator={false}
              getItemLayout={(data, index) => ({
                length: 60, // Approximate item height
                offset: 60 * index,
                index,
              })}
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              windowSize={5}
            />
          ) : (
            <Text style={[typography.body, { color: colors.subtext, textAlign: 'center', fontStyle: 'italic', paddingVertical: spacing(2) }]}>
              No check-ins yet. Start your healing journey!
            </Text>
          )}
        </Card>

        {/* Panic Modal */}
        <Modal 
          visible={panicOpen} 
          transparent 
          animationType="slide" 
          onRequestClose={() => setPanicOpen(false)}
          statusBarTranslucent
        >
          <View style={styles.modalWrap}>
            <Pressable 
              style={styles.modalBackdrop}
              onPress={() => setPanicOpen(false)}
              accessibilityLabel="Close panic modal"
              testID="journal-panic-modal-backdrop"
            />
            <Card 
              style={[styles.panicCard, { marginTop: 'auto' }]}
              accessible
                accessibilityRole="alert"
              accessibilityLabel="Panic support modal"
              testID="journal-panic-modal-card"
            >
              <Text 
                style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}
                accessible
                accessibilityRole="header"
                accessibilityLabel="Don't reach out"
              >
                Don't reach out.
              </Text>
              <Text 
                style={[typography.body, { color: colors.subtext, marginBottom: spacing(2), lineHeight: 22 }]}
                accessible
                accessibilityLabel="Breathe. This urge will pass. Contacting them resets your progress."
              >
                Breathe. This urge will pass. Contacting them resets your progress.
              </Text>
              
              {reasons.length > 0 && (
                <>
                  <Text 
                    style={[typography.h3, { color: colors.text, marginTop: spacing(1) }]}
                    accessible
                    accessibilityRole="header"
                    accessibilityLabel="Your reasons for no contact"
                  >
                    Your Reasons
                  </Text>
                  <View 
                    accessible
                    accessibilityRole="list"
                    accessibilityLabel="Your personal reasons for maintaining no contact"
                  >
                    {reasons.slice(0,3).map((r, i) => (
                      <Text 
                        key={i} 
                        style={[typography.body, { color: colors.text, marginTop: spacing(0.5) }]}
                        accessible
                        accessibilityRole="text"
                        accessibilityLabel={`Reason ${i + 1}: ${r}`}
                      >
                        • {r}
                      </Text>
                    ))}
                  </View>
                </>
              )}
              
              <Button 
                label="I'm OK" 
                tone="accent" 
                onPress={() => {
                  triggerHaptic('success');
                  setPanicOpen(false);
                }}
                style={{ marginTop: spacing(2) }}
                accessibilityLabel="I'm feeling better now, close this support modal"
                testID="journal-panic-modal-ok-button"
              />
            </Card>
          </View>
        </Modal>
        </Col>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


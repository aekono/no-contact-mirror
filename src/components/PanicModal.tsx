import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button, Col, Row } from './UI';
import { useTheme } from '../hooks/useTheme';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useSurfaceMessage, useMessagesByCategory } from '../hooks/useSurfaceMessage';
import { spacing, typography } from '../theme';
import { ContentRow } from '../content/contentStore';

interface PanicModalProps {
  visible: boolean;
  onClose: () => void;
  reasons: string[];
}

export default function PanicModal({ visible, onClose, reasons }: PanicModalProps) {
  const { colors } = useTheme();
  const { triggerHaptic } = useHapticFeedback();
  const insets = useSafeAreaInsets();
  
  // Content hooks
  const { message: timerMessage, refresh: refreshTimerMessage } = useSurfaceMessage("Panic Modal — Urge Surfing Timer");
  const { messages: copingCards } = useMessagesByCategory("coping_card");
  const { messages: breathCues } = useMessagesByCategory("breath");
  
  // Timer state
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showCopingDeck, setShowCopingDeck] = useState(false);
  const [selectedCopingCard, setSelectedCopingCard] = useState<ContentRow | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerActive && visible) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          // Refresh message every 45-60 seconds
          if (newTime % 50 === 0) {
            refreshTimerMessage();
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, visible, refreshTimerMessage]);

  // Reset timer when modal opens
  useEffect(() => {
    if (visible) {
      setTimer(0);
      setIsTimerActive(true);
      setShowCopingDeck(false);
      setSelectedCopingCard(null);
    } else {
      setIsTimerActive(false);
    }
  }, [visible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopingCardPress = useCallback((card: ContentRow) => {
    triggerHaptic('light');
    setSelectedCopingCard(card);
  }, [triggerHaptic]);

  const handleStartTimer = useCallback(() => {
    triggerHaptic('medium');
    setIsTimerActive(true);
  }, [triggerHaptic]);

  const handleStopTimer = useCallback(() => {
    triggerHaptic('light');
    setIsTimerActive(false);
  }, [triggerHaptic]);

  const handleToggleCopingDeck = useCallback(() => {
    triggerHaptic('light');
    setShowCopingDeck(prev => !prev);
  }, [triggerHaptic]);

  const handleClose = useCallback(() => {
    triggerHaptic('success');
    onClose();
  }, [triggerHaptic, onClose]);

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[styles.modalWrap, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Pressable 
          style={styles.modalBackdrop}
          onPress={handleClose}
          accessibilityLabel="Close panic modal"
          testID="panic-modal-backdrop"
        />
        <Card 
          style={[styles.panicCard, { marginTop: 'auto' }]}
          accessible
          accessibilityRole="alert"
          accessibilityLabel="Panic support modal"
          testID="panic-modal-card"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Col gap={2}>
              {/* Header */}
              <Text 
                style={[typography.h3, { color: colors.text, textAlign: 'center' }]}
                accessible
                accessibilityRole="header"
                accessibilityLabel="Don't reach out"
              >
                Don't reach out.
              </Text>

              {/* Timer Message */}
              {timerMessage && (
                <View style={styles.timerMessageContainer}>
                  <Text 
                    style={[typography.body, { color: colors.accent, textAlign: 'center', fontWeight: '600' }]}
                    accessible
                    accessibilityLabel="Urge surfing guidance"
                  >
                    {timerMessage.text}
                  </Text>
                </View>
              )}

              {/* Timer Controls */}
              <View style={styles.timerContainer}>
                <Text style={[typography.h2, { color: colors.text, textAlign: 'center' }]}>
                  {formatTime(timer)}
                </Text>
                <Row gap={1} style={{ justifyContent: 'center' }}>
                  {!isTimerActive ? (
                    <Button
                      label="Start Timer"
                      tone="accent"
                      onPress={handleStartTimer}
                      accessibilityLabel="Start urge surfing timer"
                    />
                  ) : (
                    <Button
                      label="Pause"
                      tone="neutral"
                      onPress={handleStopTimer}
                      accessibilityLabel="Pause timer"
                    />
                  )}
                </Row>
              </View>

              {/* Breath Cues */}
              {breathCues.length > 0 && (
                <View style={styles.breathContainer}>
                  <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
                    Breathing Exercise
                  </Text>
                  <Text style={[typography.body, { color: colors.subtext, textAlign: 'center' }]}>
                    {breathCues[0]?.text}
                  </Text>
                </View>
              )}

              {/* Coping Deck Toggle */}
              <Button
                label={showCopingDeck ? "Hide Coping Cards" : "Show Coping Cards"}
                tone="success"
                onPress={handleToggleCopingDeck}
                accessibilityLabel={showCopingDeck ? "Hide coping cards" : "Show coping cards"}
              />

              {/* Coping Deck */}
              {showCopingDeck && copingCards.length > 0 && (
                <View style={styles.copingDeck}>
                  <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
                    Quick Coping Actions
                  </Text>
                  <View style={styles.copingGrid}>
                    {copingCards.slice(0, 6).map((card, index) => (
                      <TouchableOpacity
                        key={card.id}
                        style={[
                          styles.copingCard,
                          { 
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            borderWidth: 1,
                          },
                          selectedCopingCard?.id === card.id && {
                            backgroundColor: colors.accent + '20',
                            borderColor: colors.accent,
                          }
                        ]}
                        onPress={() => handleCopingCardPress(card)}
                        accessible
                        accessibilityRole="button"
                        accessibilityLabel={`Coping action: ${card.text}`}
                      >
                        <Text 
                          style={[
                            typography.body, 
                            { 
                              color: selectedCopingCard?.id === card.id ? colors.accent : colors.text,
                              textAlign: 'center',
                              fontSize: 14,
                            }
                          ]}
                          numberOfLines={3}
                        >
                          {card.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Selected Coping Card */}
              {selectedCopingCard && (
                <View style={[styles.selectedCard, { backgroundColor: colors.accent + '10' }]}>
                  <Text style={[typography.h3, { color: colors.accent, marginBottom: spacing(0.5) }]}>
                    Try This:
                  </Text>
                  <Text style={[typography.body, { color: colors.text }]}>
                    {selectedCopingCard.text}
                  </Text>
                </View>
              )}

              {/* User Reasons */}
              {reasons.length > 0 && (
                <View>
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
                </View>
              )}
              
              {/* Close Button */}
              <Button 
                label="I'm OK" 
                tone="accent" 
                onPress={handleClose}
                style={{ marginTop: spacing(2) }}
                accessibilityLabel="I'm feeling better now, close this support modal"
                testID="panic-modal-ok-button"
              />
            </Col>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  timerMessageContainer: {
    padding: spacing(1.5),
    backgroundColor: 'rgba(108, 160, 255, 0.1)',
    borderRadius: 12,
    marginBottom: spacing(1),
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: spacing(1),
  },
  breathContainer: {
    padding: spacing(1.5),
    backgroundColor: 'rgba(94, 211, 168, 0.1)',
    borderRadius: 12,
  },
  copingDeck: {
    marginTop: spacing(1),
  },
  copingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  copingCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing(1.5),
    borderRadius: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  selectedCard: {
    padding: spacing(1.5),
    borderRadius: 12,
    marginTop: spacing(1),
  },
});

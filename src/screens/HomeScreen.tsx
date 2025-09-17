import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Pressable,
  RefreshControl 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { useTimer } from '../hooks/useTimer';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import SlipUpModal from '../components/SlipUpModal';
import PanicModal from '../components/PanicModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import StopwatchHero from '../components/StopwatchHero';
import QuoteBanner from '../components/QuoteBanner';
import ReasonsCarousel from '../components/ReasonsCarousel';
import MiniPreviewRow from '../components/MiniPreviewRow';
import { requestNotifPermission, scheduleDailyReminder, cancelAllReminders } from '../lib/notifications';
import { format } from 'date-fns';
import { useTheme } from '../hooks/useTheme';
import { Card, Button, Chip, Row, Col, SectionTitle } from '../components/UI';
import { StreakChart } from '../components/StreakChart';
import { Achievements } from '../components/Achievements';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { triggerHaptic } = useHapticFeedback();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, shadow, typography } = useTheme();
  
  const { 
    lastContactAt, 
    reasons, 
    checkIns, 
    slipUps,
    notificationsEnabled, 
    resetWithSlipUp, 
    setNotificationsEnabled,
    setLastContactNow,
    resetAll
  } = useAppStore();

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: colors.bg
    },
    streakBadge: { 
      alignItems: 'center' 
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
  
  // Compute isZeroState locally to ensure re-renders
  const isZeroState = !lastContactAt;
  
  // Calculate streak days locally to avoid getter re-render loops
  const currentStreakDays = useMemo(() => 
    lastContactAt ? Math.max(0, Math.floor((Date.now() - new Date(lastContactAt).getTime()) / 86400000)) : 0,
    [lastContactAt]
  );
  const longestStreakDays = 0; // TODO: Implement proper longest streak calculation
  
  const { days, hours, minutes } = useTimer(lastContactAt);
  const [panicOpen, setPanicOpen] = useState(false);
  const [slipUpOpen, setSlipUpOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Check if today's check-in exists
  const hasTodayCheckIn = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.some(checkIn => 
      checkIn.dateISO.startsWith(today)
    );
  }, [checkIns]);

  // Handle notifications on first mount
  useEffect(() => {
    const setupNotifications = async () => {
      if (!notificationsEnabled) {
        const granted = await requestNotifPermission();
        if (granted) {
          const scheduled = await scheduleDailyReminder(20, 0); // 8:00 PM
          if (scheduled) {
            setNotificationsEnabled(true);
          }
        }
      }
    };

    setupNotifications();
  }, [notificationsEnabled, setNotificationsEnabled]);

  const handleNotificationToggle = useCallback(async () => {
    triggerHaptic('light');
    
    if (notificationsEnabled) {
      await cancelAllReminders();
      setNotificationsEnabled(false);
    } else {
      const granted = await requestNotifPermission();
      if (granted) {
        const scheduled = await scheduleDailyReminder(20, 0);
        if (scheduled) {
          setNotificationsEnabled(true);
          triggerHaptic('success');
        }
      }
    }
  }, [notificationsEnabled, setNotificationsEnabled, triggerHaptic]);

  const handleSlipUpSave = useCallback((trigger: string, note?: string) => {
    resetWithSlipUp(trigger, note);
    triggerHaptic('success');
  }, [resetWithSlipUp, triggerHaptic]);

  const handleStartNoContact = useCallback(() => {
    setLastContactNow();
    triggerHaptic('success');
  }, [setLastContactNow, triggerHaptic]);

  const handlePanicPress = useCallback(() => {
    triggerHaptic('heavy');
    setPanicOpen(true);
  }, [triggerHaptic]);

  const handleSlipUpPress = useCallback(() => {
    triggerHaptic('medium');
    setSlipUpOpen(true);
  }, [triggerHaptic]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  }, []);


  if (refreshing) {
    return <LoadingSpinner message="Refreshing..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 56 + 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        <Col gap={2} style={{ paddingBottom: spacing(2) }}>
          {/* StopwatchHero */}
          <StopwatchHero lastContactAt={lastContactAt} onOpenPanic={() => setPanicOpen(true)} />

          {/* Primary action button (outside the hero) */}
          <View style={{ marginTop: spacing(2) }}>
            {isZeroState ? (
            <Button
              label="Start no-contact"
              tone="accent"
              large
              onPress={handleStartNoContact}
              accessibilityLabel="Start your no-contact journey"
            />
            ) : (
              <Button
                label="Log a slip-up"
                tone="neutral"
                large
                onPress={handleSlipUpPress}
                accessibilityLabel="Record a slip-up and reset your streak"
              />
            )}
          </View>

          {/* QuoteBanner */}
          <QuoteBanner />

          {/* ReasonsCarousel */}
          <ReasonsCarousel />

          {/* MiniPreviewRow */}
          <MiniPreviewRow />


          {/* Panic Modal */}
          <PanicModal
            visible={panicOpen}
            onClose={() => setPanicOpen(false)}
            reasons={reasons}
          />

          {/* Slip-Up Modal */}
          <SlipUpModal
            visible={slipUpOpen}
            onClose={() => setSlipUpOpen(false)}
            onSave={handleSlipUpSave}
          />
        </Col>
      </ScrollView>

    </SafeAreaView>
  );
}


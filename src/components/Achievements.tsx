import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Row, Col } from './UI';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementsProps {
  currentStreakDays: number;
  longestStreakDays: number;
  totalCheckIns: number;
  totalSlipUps: number;
}

export const Achievements: React.FC<AchievementsProps> = ({
  currentStreakDays,
  longestStreakDays,
  totalCheckIns,
  totalSlipUps,
}) => {
  const achievements = useMemo((): Achievement[] => [
    {
      id: 'first_day',
      title: 'First Steps',
      description: 'Complete your first day of no contact',
      icon: '🌱',
      unlocked: currentStreakDays >= 1,
    },
    {
      id: 'one_week',
      title: 'One Week Strong',
      description: 'Reach 7 days of no contact',
      icon: '🎉',
      unlocked: longestStreakDays >= 7,
    },
    {
      id: 'two_weeks',
      title: 'Two Weeks',
      description: 'Reach 14 days of no contact',
      icon: '💪',
      unlocked: longestStreakDays >= 14,
    },
    {
      id: 'one_month',
      title: 'One Month',
      description: 'Reach 30 days of no contact',
      icon: '🌟',
      unlocked: longestStreakDays >= 30,
    },
    {
      id: 'three_months',
      title: 'Three Months',
      description: 'Reach 90 days of no contact',
      icon: '💎',
      unlocked: longestStreakDays >= 90,
    },
    {
      id: 'six_months',
      title: 'Six Months',
      description: 'Reach 180 days of no contact',
      icon: '🏆',
      unlocked: longestStreakDays >= 180,
    },
    {
      id: 'one_year',
      title: 'One Year',
      description: 'Reach 365 days of no contact',
      icon: '👑',
      unlocked: longestStreakDays >= 365,
    },
    {
      id: 'daily_tracker',
      title: 'Daily Tracker',
      description: 'Log 10 daily check-ins',
      icon: '📝',
      unlocked: totalCheckIns >= 10,
    },
    {
      id: 'consistent_tracker',
      title: 'Consistent Tracker',
      description: 'Log 30 daily check-ins',
      icon: '📊',
      unlocked: totalCheckIns >= 30,
    },
    {
      id: 'reflection_master',
      title: 'Reflection Master',
      description: 'Log 100 daily check-ins',
      icon: '🧘',
      unlocked: totalCheckIns >= 100,
    },
    {
      id: 'resilient',
      title: 'Resilient',
      description: 'Bounce back from 5 slip-ups',
      icon: '🔄',
      unlocked: totalSlipUps >= 5 && longestStreakDays >= 7,
    },
    {
      id: 'determined',
      title: 'Determined',
      description: 'Bounce back from 10 slip-ups',
      icon: '⚡',
      unlocked: totalSlipUps >= 10 && longestStreakDays >= 14,
    },
  ], [currentStreakDays, longestStreakDays, totalCheckIns, totalSlipUps]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <Card>
      <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
        Achievements ({unlockedAchievements.length}/{achievements.length})
      </Text>
      
      {unlockedAchievements.length > 0 && (
        <View style={styles.section}>
          <Text style={[typography.body, { color: colors.success, marginBottom: spacing(1) }]}>
            🎉 Unlocked
          </Text>
          <View style={styles.achievementsGrid}>
            {unlockedAchievements.map((achievement) => (
              <View key={achievement.id} style={[styles.achievement, styles.unlocked]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[typography.small, { color: colors.text, textAlign: 'center' }]}>
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {lockedAchievements.length > 0 && (
        <View style={styles.section}>
          <Text style={[typography.body, { color: colors.subtext, marginBottom: spacing(1) }]}>
            🔒 Locked
          </Text>
          <View style={styles.achievementsGrid}>
            {lockedAchievements.slice(0, 6).map((achievement) => (
              <View key={achievement.id} style={[styles.achievement, styles.locked]}>
                <Text style={[styles.achievementIcon, { opacity: 0.3 }]}>
                  {achievement.icon}
                </Text>
                <Text style={[typography.small, { color: colors.subtext, textAlign: 'center' }]}>
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing(2),
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  achievement: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: radius.md,
    padding: spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  unlocked: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  locked: {
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: spacing(0.5),
  },
});

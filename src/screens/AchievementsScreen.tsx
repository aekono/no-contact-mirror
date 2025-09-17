import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { Card, Button } from '../components/UI';
import EmptyStateArt from '../components/EmptyStateArt';
import { spacing, radius, typography } from '../theme';

const MILESTONES = [7, 30, 90];

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const { lastContactAt } = useAppStore();

  const currentStreak = useMemo(() => {
    if (!lastContactAt) return 0;
    const diff = Date.now() - new Date(lastContactAt).getTime();
    if (diff < 86400000) return 0;
    return Math.floor(diff / 86400000);
  }, [lastContactAt]);

  const hasUnlockedAchievements = currentStreak >= 7;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}>
      <Text style={[typography.h2 as any, { color: colors.text, marginBottom: spacing(2) }]}>Achievements</Text>
      
      {!hasUnlockedAchievements ? (
        <Card style={{ alignItems: 'center' }}>
          <EmptyStateArt kind="achievements" />
          <Text style={[typography.h3 as any, { color: colors.text, marginTop: spacing(1) }]}>Keep going</Text>
          <Text style={{ color: colors.subtext, marginTop: 4 }}>
            You'll unlock your first badge at 7 days.
          </Text>
        </Card>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing(1) }}>
          {MILESTONES.map(ms => {
            const unlocked = currentStreak >= ms;
            return (
              <Card key={ms} style={{
                width: '31%',
                alignItems: 'center',
                paddingVertical: spacing(2),
                opacity: unlocked ? 1 : 0.5
              }}>
                {unlocked ? (
                  <Svg width={48} height={12} viewBox="0 0 48 12" style={{ position: 'absolute', top: 6 }}>
                    <Path d="M4 10 Q24 -2 44 10" stroke={colors.accent} strokeWidth={2} fill="none" opacity={0.25} />
                  </Svg>
                ) : null}
                <Text style={[typography.h3 as any, { color: colors.text }]}>{ms}d</Text>
                <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </Text>
              </Card>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

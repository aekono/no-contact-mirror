import React, { useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { Card, Row, Col, Button } from '../components/UI';
import KpiCard from '../components/KpiCard';
import EmptyStateArt from '../components/EmptyStateArt';
import { spacing, typography } from '../theme';
import { StreakChart } from '../components/StreakChart';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { lastContactAt, checkIns, slipUps } = useAppStore();

  const kpis = useMemo(() => {
    // Current Streak
    const currentStreak = (() => {
      if (!lastContactAt) return 0;
      const now = Date.now();
      const start = new Date(lastContactAt).getTime();
      const diff = now - start;
      if (diff < 86400000) return 0;
      return Math.floor(diff / 86400000);
    })();

    // Longest streak (simple pass using slip-ups)
    const longestStreak = (() => {
      if (!slipUps || slipUps.length === 0) {
        return currentStreak;
      }
      const events = [...slipUps].sort((a,b) => a.atISO.localeCompare(b.atISO));
      let maxDays = 0;
      let prev = null as string | null;
      for (const e of events) {
        if (prev) {
          const gap = Math.max(0, Math.floor((new Date(e.atISO).getTime() - new Date(prev).getTime()) / 86400000));
          if (gap > maxDays) maxDays = gap;
        }
        prev = e.atISO;
      }
      // from last slip-up to now
      const last = events[events.length - 1]?.atISO;
      if (last) {
        const gapNow = Math.max(0, Math.floor((Date.now() - new Date(last).getTime()) / 86400000));
        if (gapNow > maxDays) maxDays = gapNow;
      }
      return maxDays;
    })();

    // Consistency over last 30 days
    const consistencyPct = (() => {
      const today = new Date();
      const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split('T')[0];
      });
      const daysWithCheckIn = days.filter(iso =>
        (checkIns || []).some(ci => ci.dateISO?.startsWith(iso))
      ).length;
      return Math.round((daysWithCheckIn / 30) * 100);
    })();

    // Avg Recovery time (simple heuristic: days from slip-up to next check-in)
    const avgRecovery = (() => {
      if (!slipUps || slipUps.length === 0 || !checkIns || checkIns.length === 0) return null;
      const slips = [...slipUps].sort((a,b) => a.atISO.localeCompare(b.atISO));
      const ins = [...checkIns].sort((a,b) => a.dateISO.localeCompare(b.dateISO));
      const diffs: number[] = [];
      for (const s of slips) {
        const nextCI = ins.find(ci => ci.dateISO >= s.atISO);
        if (nextCI) {
          const days = Math.max(0, Math.floor((new Date(nextCI.dateISO).getTime() - new Date(s.atISO).getTime()) / 86400000));
          diffs.push(days);
        }
      }
      if (diffs.length === 0) return null;
      const avg = Math.round(diffs.reduce((a,b)=>a+b,0) / diffs.length);
      return avg;
    })();

    return {
      currentStreak,
      longestStreak,
      consistencyPct,
      avgRecovery
    };
  }, [lastContactAt, checkIns, slipUps]);

  // Check if there are any check-ins in the last 30 days
  const hasRecentCheckIns = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return checkIns.some(checkIn => 
      new Date(checkIn.dateISO) >= thirtyDaysAgo
    );
  }, [checkIns]);

  return (
    <ScrollView 
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ 
        paddingTop: insets.top + 8,
        paddingHorizontal: spacing(2), 
        paddingBottom: insets.bottom + 56 + 16 
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {!hasRecentCheckIns ? (
        <Card style={{ marginBottom: spacing(2), alignItems: 'center' }}>
          <EmptyStateArt kind="analytics" />
          <Text style={[typography.h3 as any, { marginTop: spacing(1), color: colors.text }]}>
            No check-ins yet
          </Text>
          <Text style={{ color: colors.subtext, marginTop: 4 }}>
            Your trend appears after your first check-in.
          </Text>
          <Button
            label="Make a check-in"
            tone="accent"
            onPress={() => navigation.navigate('Check-In')}
            style={{ alignSelf: 'flex-start', marginTop: spacing(2) }}
          />
        </Card>
      ) : (
        <>
          {/* Chart first */}
          <Card style={{ marginBottom: spacing(2) }}>
            <Text style={[typography.h3 as any, { color: colors.text, marginBottom: spacing(1) }]}>Mood Trends (30 days)</Text>
            <StreakChart checkIns={checkIns} slipUps={slipUps} currentStreakDays={kpis.currentStreak} />
          </Card>

          {/* KPI grid */}
          <Row gap={1} style={{ marginBottom: spacing(2) }}>
            <KpiCard label="Current Streak" value={`${kpis.currentStreak}d`} />
            <KpiCard label="Longest Streak" value={`${kpis.longestStreak}d`} />
          </Row>
          <Row gap={1} style={{ marginBottom: spacing(2) }}>
            <KpiCard label="Consistency" value={`${kpis.consistencyPct}%`} hint="Last 30 days" />
            <KpiCard label="Avg Recovery" value={kpis.avgRecovery !== null ? `${kpis.avgRecovery}d` : '—'} />
          </Row>
        </>
      )}
    </ScrollView>
  );
}
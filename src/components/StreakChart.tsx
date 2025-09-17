import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, typography, radius } from '../theme';
import { CheckIn, SlipUp } from '../types';

interface StreakChartProps {
  checkIns: CheckIn[];
  slipUps: SlipUp[];
  currentStreakDays: number;
}

export const StreakChart: React.FC<StreakChartProps> = ({ 
  checkIns, 
  slipUps, 
  currentStreakDays 
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { colors: themeColors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Build exactly 30 calendar days, oldest -> newest, ending today (LOCAL TIMEZONE)
  const days = useMemo(() => {
    const arr: string[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      // Use local date formatting to avoid UTC drift
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      arr.push(`${year}-${month}-${day}`);
    }
    return arr;
  }, []);

  // Index check-ins by YYYY-MM-DD (use avg mood if multiple)
  const moodByDay = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const ci of checkIns ?? []) {
      if (!ci?.dateISO) continue;
      const key = ci.dateISO.slice(0, 10);
      const m = typeof ci.mood === 'number' ? ci.mood : 0;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    const avg = new Map<string, number>();
    for (const [k, arr] of map) {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      avg.set(k, Math.round(mean));
    }
    return avg;
  }, [checkIns]);

  // Dataset: exactly 30 points, oldest -> newest, with null for missing days (gaps)
  const data = useMemo(() => days.map(d => moodByDay.get(d) ?? null), [days, moodByDay]);
  const labels = useMemo(() => {
    return days.map(d => {
      // Use local date formatting for MM-DD labels
      const date = new Date(d);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}-${day}`;
    });
  }, [days]);

  const columnWidth = 18;
  const chartWidth = Math.max(screenWidth, days.length * columnWidth);
  const rightGutterWidth = Math.round(screenWidth * 0.5);
  const totalContentWidth = chartWidth + rightGutterWidth;

  const chartData = useMemo(() => ({
    labels: labels.map((label, i) => i % 5 === 0 ? label : ''),
    datasets: [{ 
      data: data.map(d => d === null ? 0 : d), // Convert null to 0 for chart-kit
      color: () => 'transparent' // Hide default line
    }]
  }), [labels, data]);

  // Custom decorator to draw gaps and points
  const CustomDecorator = ({ width, height }: { width: number; height: number }) => {
    const chartPadding = 20;
    const chartWidth = width - (chartPadding * 2);
    const chartHeight = height - (chartPadding * 2);
    const stepX = chartWidth / (data.length - 1);
    const maxValue = Math.max(...data.filter(d => d !== null));
    const minValue = Math.min(...data.filter(d => d !== null));
    const valueRange = maxValue - minValue || 1;
    
    // Build path segments for consecutive defined points
    const pathSegments: string[] = [];
    const points: { x: number; y: number; value: number }[] = [];
    
    data.forEach((value, index) => {
      if (value !== null) {
        const x = chartPadding + (index * stepX);
        const y = chartPadding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        points.push({ x, y, value });
      }
    });
    
    // Create path segments between consecutive points
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      if (i === 0) {
        pathSegments.push(`M ${current.x} ${current.y}`);
      }
      pathSegments.push(`L ${next.x} ${next.y}`);
    }
    
    const pathData = pathSegments.join(' ');
    
    return (
      <Svg width={width} height={height}>
        {/* Draw line segments */}
        <Path
          d={pathData}
          stroke={themeColors.accent}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Draw dots for defined points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={themeColors.accent}
            stroke={themeColors.card}
            strokeWidth={2}
          />
        ))}
      </Svg>
    );
  };

  // Auto-scroll to show today's data with viewport bias (TODAY ~40% from left)
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        const todayIdx = days.length - 1; // Last day is today
        const targetX = Math.max(0, todayIdx * columnWidth - Math.round(screenWidth * 0.4));
        const maxScrollX = Math.max(0, totalContentWidth - screenWidth);
        const clampedX = Math.min(targetX, maxScrollX);
        
        scrollViewRef.current?.scrollTo({ x: clampedX, animated: false });
      }, 100);
    }
  }, [screenWidth, totalContentWidth, columnWidth]);

  const jumpToToday = () => {
    const todayIdx = days.length - 1;
    const targetX = Math.max(0, todayIdx * columnWidth - Math.round(screenWidth * 0.4));
    const maxScrollX = Math.max(0, totalContentWidth - screenWidth);
    const clampedX = Math.min(targetX, maxScrollX);
    
    scrollViewRef.current?.scrollTo({ x: clampedX, animated: true });
  };

  const chartConfig = {
    backgroundGradientFrom: themeColors.card,
    backgroundGradientTo: themeColors.card,
    color: () => themeColors.accent,
    labelColor: () => themeColors.subtext,
    decimalPlaces: 0,
    propsForBackgroundLines: { stroke: themeColors.border },
    propsForLabels: { fill: themeColors.subtext },
  };

  if (checkIns.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={[typography.body, { color: themeColors.subtext, textAlign: 'center' }] as any}>
          Start logging your daily check-ins to see your mood trends
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Jump to Today button */}
      <View style={styles.jumpToTodayContainer}>
        <Pressable
          onPress={jumpToToday}
          style={({ pressed }) => [
            styles.jumpToTodayButton,
            {
              backgroundColor: themeColors.muted,
              borderColor: themeColors.border,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
          testID="jump-to-today-button"
        >
          <Text style={[typography.small, { color: themeColors.text }]}>
            Jump to Today
          </Text>
        </Pressable>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chartScrollView}
        contentContainerStyle={{ width: totalContentWidth }}
      >
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          withInnerLines
          withOuterLines={false}
          fromZero
          segments={4}
          withDots={false}
          withScrollableDot={false}
          decorator={() => <CustomDecorator width={chartWidth} height={220} />}
          style={[styles.chart, { backgroundColor: themeColors.card, borderRadius: 12 }] as any}
        />
        {/* Right gutter for visual spacing */}
        <View style={[styles.rightGutter, { width: rightGutterWidth }]} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing(1),
  },
  emptyState: {
    padding: spacing(3),
    alignItems: 'center',
  },
  jumpToTodayContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing(1),
  },
  jumpToTodayButton: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  chartScrollView: {
    marginVertical: spacing(0.5),
  },
  chart: {
    marginVertical: 8,
  },
  rightGutter: {
    // Empty space for visual spacing
  },
});

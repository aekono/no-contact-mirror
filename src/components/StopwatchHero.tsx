import React, { useMemo } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useTimer } from '../hooks/useTimer';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../theme';

const ACircle = Animated.createAnimatedComponent(Circle);

type Props = { 
  lastContactAt: string | null; 
  onOpenPanic?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export default function StopwatchHero({ lastContactAt, onOpenPanic, onLayout }: Props) {
  const { colors } = useTheme();
  const t = useTimer(lastContactAt);
  
  // Use real timer values (ensure integers)
  const days = Math.floor(t.days ?? 0);
  const hours = Math.floor(t.hours ?? 0);
  const minutes = Math.floor(t.minutes ?? 0);

  // derive seconds locally to ensure live tick
  const now = Date.now();
  const seconds = useMemo(() => {
    if (!lastContactAt) return 0;
    const diffSec = Math.max(0, Math.floor((now - new Date(lastContactAt).getTime()) / 1000));
    return diffSec % 60;
  }, [now, lastContactAt]);

  // Single ring geometry - thicker stroke (8-10 scaled)
  const size = 200;
  const stroke = 10; // Thicker ring as specified
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  
  // Progress based on total time elapsed (simplified to day progress)
  const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
  const maxMinutes = 7 * 24 * 60; // 7 days max for visual
  const progress = Math.min(1, totalMinutes / maxMinutes);
  
  const ringProg = useDerivedValue(() => withTiming(progress, { duration: 800 }));
  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - ringProg.value),
  }));

  return (
    <View 
      style={{ 
        alignItems: 'center', 
        paddingVertical: spacing(3),
        backgroundColor: 'transparent', // Remove dark wrapper
      }}
      onLayout={onLayout}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds since last contact`}
    >
      {/* Single ring with forest gradient */}
      <Svg width={size} height={size} style={{ marginBottom: spacing(2) }} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="forest-ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.forest?.[600] || '#1F4A2A'} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.forest?.[400] || '#4A7C59'} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Base track */}
        <Circle 
          cx={cx} 
          cy={cy} 
          r={r} 
          stroke={colors.forest?.[800] || '#0F2A16'} 
          strokeWidth={stroke} 
          fill="none"
          strokeLinecap="round"
          opacity={0.3}
        />
        
        {/* Progress ring */}
        <ACircle
          cx={cx}
          cy={cy}
          r={r}
          stroke="url(#forest-ring)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${C} ${C}`}
          animatedProps={ringProps}
          transform={`rotate(-90 ${cx} ${cy})`}
          strokeLinecap="round"
        />
      </Svg>

      {/* Typography with baseline alignment */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing(1) }}>
        <Text style={[
          typography.h1, 
          { 
            color: colors.text, 
            lineHeight: typography.h1.fontSize * 1.1,
            includeFontPadding: false,
          }
        ]}>
          {days}
        </Text>
        <Text style={[
          typography.body, 
          { 
            color: colors.subtext, 
            marginLeft: spacing(0.5),
            lineHeight: typography.body.fontSize * 1.1,
          }
        ]}>
          days
        </Text>
      </View>
      
      {/* Time display below */}
      <Text style={[typography.body, { color: colors.subtext, textAlign: 'center' }]}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
    </View>
  );
}

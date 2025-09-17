import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useTimer } from '../hooks/useTimer';
import { useTheme } from '../hooks/useTheme';
import { Card, Button } from './UI';
import { spacing, typography, shadow } from '../theme';
import HeroBackdrop from './HeroBackdrop';

const ACircle = Animated.createAnimatedComponent(Circle);

type Props = { lastContactAt: string | null; onOpenPanic?: () => void };

export default function StopwatchHero({ lastContactAt, onOpenPanic }: Props) {
  const { colors } = useTheme();
  const t = useTimer(lastContactAt); // days, hours, minutes (seconds may not be present)
  
  // Debug slider state
  const [debugDays, setDebugDays] = useState<number | null>(null);
  const [debugHours, setDebugHours] = useState<number | null>(null);
  const [debugMinutes, setDebugMinutes] = useState<number | null>(null);
  
  // Use debug values if set, otherwise use real values (ensure integers)
  const days = debugDays !== null ? Math.floor(debugDays) : Math.floor(t.days ?? 0);
  const hours = debugHours !== null ? Math.floor(debugHours) : Math.floor(t.hours ?? 0);
  const minutes = debugMinutes !== null ? Math.floor(debugMinutes) : Math.floor(t.minutes ?? 0);

  // derive seconds locally to ensure live tick
  const now = Date.now();
  const seconds = useMemo(() => {
    if (!lastContactAt) return 0;
    const diffSec = Math.max(0, Math.floor((now - new Date(lastContactAt).getTime()) / 1000));
    return diffSec % 60;
  }, [now, lastContactAt]);

  // Ring geometry
  const size = 220;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  
  // Day markers around the circle
  const dayMarkers = Array.from({ length: 7 }, (_, i) => {
    const angle = (i * 360) / 7 - 90; // Start at top, 7 markers for days of week
    const x = cx + r * Math.cos((angle * Math.PI) / 180);
    const y = cy + r * Math.sin((angle * Math.PI) / 180);
    return { x, y, angle };
  });
  
  // Current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDayOfWeek = new Date().getDay();

  // Day progress (0..1) from hours+minutes within the current day
  const dayFraction = Math.min(1, Math.max(0, (hours * 60 + minutes) / (24 * 60)));
  const dayProg = useDerivedValue(() => withTiming(dayFraction, { duration: 450 }));
  const dayProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - dayProg.value),
  }));

  // Inner hour arc: progress within the current hour (minutes / 60)
  const hrStroke = 6;
  const hrR = r - stroke * 1.2;
  const hrC = 2 * Math.PI * hrR;
  const hourFraction = Math.min(1, Math.max(0, minutes / 60));
  const hrProg = useDerivedValue(() => withTiming(hourFraction, { duration: 350 }));
  const hrProps = useAnimatedProps(() => ({
    strokeDashoffset: hrC * (1 - hrProg.value),
  }));

  const title = `${days} day${days === 1 ? '' : 's'}`;
  const subtitle = `${hours}h ${minutes}m ${seconds}s`;

  return (
    <Card style={[{ alignItems: 'center', paddingVertical: spacing(3) }, shadow.card]}>
      {/* Soft background aura */}
      <HeroBackdrop size={220} style={{ position: 'absolute', top: spacing(1), opacity: 0.9 }} />
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${title}, ${subtitle} since last contact`}
        style={{ alignItems: 'center' }}
      >
        <Svg width={size} height={size} style={{ marginBottom: spacing(1) }} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="ring-day" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.accent} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.success} stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="ring-hour" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0" stopColor={colors.accent} stopOpacity="0.9" />
              <Stop offset="1" stopColor={colors.accent} stopOpacity="0.5" />
            </LinearGradient>
          </Defs>

          {/* Day markers around the circle */}
          {dayMarkers.map((marker, i) => {
            const isCurrentDay = i === currentDayOfWeek;
            return (
              <Circle
                key={i}
                cx={marker.x}
                cy={marker.y}
                r={isCurrentDay ? "4" : "3"}
                fill={isCurrentDay ? colors.accent : colors.border}
                opacity={isCurrentDay ? 1 : 0.6}
              />
            );
          })}

          {/* Base track - outer circle */}
          <Circle 
            cx={cx} 
            cy={cy} 
            r={r} 
            stroke={colors.border} 
            strokeWidth={stroke} 
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Day progress - outer ring */}
          <ACircle
            cx={cx}
            cy={cy}
            r={r}
            stroke="url(#ring-day)"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${C} ${C}`}
            animatedProps={dayProps}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="round"
          />

          {/* Inner hour track */}
          <Circle 
            cx={cx} 
            cy={cy} 
            r={hrR} 
            stroke={colors.border} 
            strokeWidth={hrStroke} 
            fill="none"
            strokeLinecap="round"
            opacity={0.5}
          />
          
          {/* Hour progress - inner ring */}
          <ACircle
            cx={cx}
            cy={cy}
            r={hrR}
            stroke="url(#ring-hour)"
            strokeWidth={hrStroke}
            fill="none"
            strokeDasharray={`${hrC} ${hrC}`}
            animatedProps={hrProps}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="round"
          />
        </Svg>

        <Text style={[typography.h1 as any, { color: colors.text, textAlign: 'center' }]}>
          {title}
        </Text>
        <Text style={[typography.h3 as any, { color: colors.subtext, marginTop: spacing(0.5) }]}>
          {subtitle}
        </Text>
        
        {/* Legend for the circles */}
        <View style={{ flexDirection: 'row', marginTop: spacing(1), alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing(2) }}>
            <View style={{ 
              width: 12, 
              height: 12, 
              borderRadius: 6, 
              backgroundColor: colors.accent, 
              marginRight: spacing(0.5) 
            }} />
            <Text style={[typography.body, { color: colors.subtext, fontSize: 10 }]}>
              Day progress
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ 
              width: 8, 
              height: 8, 
              borderRadius: 4, 
              backgroundColor: colors.accent, 
              marginRight: spacing(0.5),
              opacity: 0.7
            }} />
            <Text style={[typography.body, { color: colors.subtext, fontSize: 10 }]}>
              Hour progress
            </Text>
          </View>
        </View>
      </View>

      {/* Panic button inside the hero card */}
      {onOpenPanic ? (
        <Button
          label="I'm struggling"
          tone="danger"
          large
          onPress={onOpenPanic}
          accessibilityLabel="Open panic support modal"
          testID="panic-trigger-button"
          style={{ marginTop: spacing(2), alignSelf: 'stretch' }}
        />
      ) : null}

      {/* Debug sliders - only show in development */}
      {__DEV__ && (
        <View style={{ marginTop: spacing(2), width: '100%', paddingHorizontal: spacing(1) }}>
          <Text style={[typography.body, { color: colors.subtext, marginBottom: spacing(1), fontSize: 12 }]}>
            Debug Controls (Development Only)
          </Text>
          
          <View style={{ marginBottom: spacing(1) }}>
            <Text style={[typography.body, { color: colors.text, fontSize: 12 }]}>
              Days: {days}
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={30}
              value={days}
              onValueChange={setDebugDays}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
            />
          </View>

          <View style={{ marginBottom: spacing(1) }}>
            <Text style={[typography.body, { color: colors.text, fontSize: 12 }]}>
              Hours: {hours}
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={23}
              value={hours}
              onValueChange={setDebugHours}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
            />
          </View>

          <View style={{ marginBottom: spacing(1) }}>
            <Text style={[typography.body, { color: colors.text, fontSize: 12 }]}>
              Minutes: {minutes}
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={59}
              value={minutes}
              onValueChange={setDebugMinutes}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
            />
          </View>

          <Button
            label="Reset to Real Time"
            tone="neutral"
            onPress={() => {
              setDebugDays(null);
              setDebugHours(null);
              setDebugMinutes(null);
            }}
            style={{ marginTop: spacing(1) }}
          />
        </View>
      )}
    </Card>
  );
}

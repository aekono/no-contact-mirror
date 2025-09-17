import React, { memo } from 'react';
import { Pressable, View, Text, Platform, AccessibilityRole } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { spacing, radius, shadow, typography } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface CardProps {
  style?: any;
  children: React.ReactNode;
  accessible?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  testID?: string;
}

export const Card = memo<CardProps>(({ style, children, accessible, accessibilityRole, accessibilityLabel, testID }) => {
  const { colors } = useTheme();
  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing(2),
          borderWidth: 1,
          borderColor: colors.border,
        },
        shadow.card,
        style
      ]}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </Animated.View>
  );
});

interface SectionTitleProps {
  children: React.ReactNode;
  right?: React.ReactNode;
}

export const SectionTitle = memo<SectionTitleProps>(({ children, right }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing(1) }}>
      <Text style={[typography.h2, { color: colors.text }]}>{children}</Text>
      {right}
    </View>
  );
});

interface ChipProps {
  label: string;
  onPress: () => void;
}

export const Chip = memo<ChipProps>(({ label, onPress }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.accent + '40' }}
      style={({ pressed }) => ({
        backgroundColor: colors.chip,
        borderRadius: radius.xl,
        paddingVertical: spacing(1),
        paddingHorizontal: spacing(1.5),
        marginRight: spacing(1),
        marginBottom: spacing(1),
        opacity: pressed ? 0.85 : 1,
        borderWidth: 1,
        borderColor: colors.border,
        maxWidth: 220,
      })}
    >
      <Text 
        style={{ color: colors.text, fontWeight: '600' }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </Pressable>
  );
});

interface ButtonProps {
  label: string;
  tone?: 'accent' | 'danger' | 'neutral' | 'success';
  onPress: () => void;
  full?: boolean;
  large?: boolean;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  testID?: string;
}

export const Button = memo<ButtonProps>(({ 
  label, 
  tone = 'accent', 
  onPress, 
  full = false, 
  large = false, 
  disabled = false,
  style,
  accessibilityLabel,
  testID
}) => {
  const { colors } = useTheme();
  const { triggerHaptic } = useHapticFeedback();
  const map = { 
    accent: colors.accent, 
    danger: colors.danger, 
    neutral: colors.card, 
    success: colors.success 
  };
  const bg = map[tone] || colors.accent;
  
  // Text color fallback chain for better contrast
  const getTextColor = () => {
    if (disabled) return colors.subtext;
    
    // Fallback chain: buttonText → textOnAccent → inverseText → text → #FFFFFF
    return colors.buttonText || 
           colors.textOnAccent || 
           colors.inverseText || 
           colors.text || 
           '#FFFFFF'; // Final fallback
  };
  
  const txt = getTextColor();
  
  const handlePress = () => {
    if (!disabled) {
      triggerHaptic('light');
      onPress();
    }
  };
  
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      android_ripple={{ color: colors.accent + '40' }}
      style={({ pressed }) => [
        {
          backgroundColor: disabled ? colors.muted : bg,
          borderRadius: radius.xl,
          paddingVertical: large ? spacing(2.5) : spacing(2), // Increased padding
          paddingHorizontal: spacing(2),
          alignItems: 'center',
          justifyContent: 'center',
          flex: full ? 1 : undefined,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: disabled ? 0.5 : 1,
          minHeight: 48, // Increased minimum height
          overflow: 'visible', // Prevent text clipping
        },
        shadow.soft,
        style
      ]}
      testID={testID || "button-pressable"}
      accessibilityLabel={accessibilityLabel}
    >
      <Text 
        style={[
          { 
            color: txt, 
            fontWeight: '800', 
            fontSize: large ? 18 : 16,
            lineHeight: large ? 22 : 20, // Prevent vertical clipping
            textAlign: 'center',
          }
        ]}
        testID="button-label"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </Pressable>
  );
});

interface RowProps {
  children: React.ReactNode;
  gap?: number;
  style?: any;
}

export const Row = memo<RowProps>(({ children, gap = 1, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: spacing(gap) }, style]}>
    {children}
  </View>
));

interface ColProps {
  children: React.ReactNode;
  gap?: number;
  style?: any;
}

export const Col = memo<ColProps>(({ children, gap = 1, style }) => (
  <View style={[{ flexDirection: 'column', gap: spacing(gap) }, style]}>
    {children}
  </View>
));

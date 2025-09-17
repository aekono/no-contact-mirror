import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, G } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

type Props = { size?: number; style?: ViewStyle };

export default function HeroBackdrop({ size = 240, style }: Props) {
  const { colors } = useTheme();
  // This is a soft, abstract "aura" — two radial glows layered.
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={style}
      accessible={false}
    >
      <Defs>
        <RadialGradient id="g1" cx="50%" cy="40%" r="60%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.35} />
          <Stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="g2" cx="70%" cy="65%" r="55%">
          <Stop offset="0%" stopColor={colors.success} stopOpacity={0.25} />
          <Stop offset="100%" stopColor={colors.success} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <G>
        <Circle cx={size*0.48} cy={size*0.44} r={size*0.44} fill="url(#g1)" />
        <Circle cx={size*0.62} cy={size*0.66} r={size*0.38} fill="url(#g2)" />
      </G>
    </Svg>
  );
}

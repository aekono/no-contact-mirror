import React from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';

interface LeavesProps {
  heroFrame?: LayoutRectangle;
}

// Nature silhouette paths (branch + teardrop leaves)
const BRANCH_PATH = "M12 2C12 2 15 8 20 12C25 16 30 18 35 22C40 26 42 30 45 35C48 40 50 45 52 50";
const LEAF_TEARDROP_PATH = "M0 10C0 4.5 4.5 0 10 0C15.5 0 20 4.5 20 10C20 15.5 10 25 10 25S0 15.5 0 10Z";
const LEAF_OVAL_PATH = "M10 0C15.5 0 20 4.5 20 10S15.5 20 10 20S0 15.5 0 10S4.5 0 10 0Z";

export function Leaves({ heroFrame }: LeavesProps) {
  const { colors } = useTheme();
  const leafColor = colors.forest?.[400] || '#4A7C59';
  
  // Calculate positions based on heroFrame if available
  const topLeftX = heroFrame ? heroFrame.x - 40 : 20;
  const topLeftY = heroFrame ? heroFrame.y - 20 : 60;
  const bottomRightX = heroFrame ? heroFrame.x + heroFrame.width + 20 : 300;
  const bottomRightY = heroFrame ? heroFrame.y + heroFrame.height + 40 : 500;
  
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top-left cluster behind hero's left arc */}
      <Svg
        width={80}
        height={100}
        style={[styles.topLeftCluster, { left: topLeftX, top: topLeftY }]}
        viewBox="0 0 80 100"
      >
        <G opacity={0.16}>
          {/* Main branch */}
          <Path
            d={BRANCH_PATH}
            stroke={leafColor}
            strokeWidth={2}
            fill="none"
            transform="scale(1.2) rotate(-15)"
          />
          
          {/* Teardrop leaves */}
          <Path
            d={LEAF_TEARDROP_PATH}
            fill={leafColor}
            transform="translate(15, 20) scale(0.8) rotate(45)"
          />
          <Path
            d={LEAF_TEARDROP_PATH}
            fill={leafColor}
            transform="translate(35, 35) scale(0.6) rotate(-30)"
          />
          
          {/* Oval leaves */}
          <Path
            d={LEAF_OVAL_PATH}
            fill={leafColor}
            transform="translate(25, 50) scale(0.7) rotate(60)"
          />
          <Path
            d={LEAF_OVAL_PATH}
            fill={leafColor}
            transform="translate(45, 65) scale(0.5) rotate(-45)"
          />
        </G>
      </Svg>
      
      {/* Tiny bottom-right cluster near tabs */}
      <Svg
        width={40}
        height={50}
        style={[styles.bottomRightCluster, { right: 20, bottom: bottomRightY }]}
        viewBox="0 0 40 50"
      >
        <G opacity={0.16}>
          {/* Small branch */}
          <Path
            d="M5 5C8 10 12 15 18 20C22 25 25 30 30 35"
            stroke={leafColor}
            strokeWidth={1.5}
            fill="none"
            transform="rotate(30)"
          />
          
          {/* Small leaves */}
          <Path
            d={LEAF_TEARDROP_PATH}
            fill={leafColor}
            transform="translate(8, 12) scale(0.4) rotate(15)"
          />
          <Path
            d={LEAF_OVAL_PATH}
            fill={leafColor}
            transform="translate(15, 25) scale(0.3) rotate(-45)"
          />
          <Path
            d={LEAF_TEARDROP_PATH}
            fill={leafColor}
            transform="translate(22, 18) scale(0.35) rotate(75)"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Above background, below content
  },
  topLeftCluster: {
    position: 'absolute',
  },
  bottomRightCluster: {
    position: 'absolute',
  },
});

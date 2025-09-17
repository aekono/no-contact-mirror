import React from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { Leaves } from './Leaves';

interface BackgroundLayerProps {
  heroFrame?: LayoutRectangle;
}

// NatureGradient component
function NatureGradient() {
  const { colors } = useTheme();
  
  return (
    <LinearGradient
      colors={[colors.forest?.[900] || '#0A1F0F', colors.forest?.[600] || '#1F4A2A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
  );
}

// Fallback gradient using Views if expo-linear-gradient fails
function FallbackNatureGradient() {
  const { colors } = useTheme();
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={[styles.gradientTop, { backgroundColor: colors.forest?.[900] || '#0A1F0F' }]} />
      <View style={[styles.gradientBottom, { backgroundColor: colors.forest?.[600] || '#1F4A2A' }]} />
    </View>
  );
}

export function BackgroundLayer({ heroFrame }: BackgroundLayerProps) {
  const backgroundStyle = useAppStore(state => state.backgroundStyle);
  
  if (backgroundStyle !== 'nature') {
    // For other background styles, return empty for now
    // TODO: Implement tasteful/bokeh/clean backgrounds
    return null;
  }
  
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Nature gradient background */}
      <NatureGradient />
      
      {/* Leaves overlay */}
      <Leaves heroFrame={heroFrame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Lowest z-index, below all content
  },
  gradientTop: {
    flex: 1,
  },
  gradientBottom: {
    flex: 2,
  },
});

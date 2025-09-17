import React from 'react';
import { View } from 'react-native';
import { spacing } from '../theme';
import MiniPreviewCard from './MiniPreviewCard';
import { useNavigation } from '@react-navigation/native';

export default function MiniPreviewRow() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flexDirection: 'row', gap: spacing(1) }}>
      <MiniPreviewCard
        title="Analytics"
        subtitle="Mood trends & recovery"
        icon="trending-up"
        onPress={() => navigation.navigate('Analytics')}
      />
      <MiniPreviewCard
        title="Achievements"
        subtitle="Milestones & badges"
        icon="medal-outline"
        onPress={() => navigation.navigate('Achievements')}
      />
    </View>
  );
}

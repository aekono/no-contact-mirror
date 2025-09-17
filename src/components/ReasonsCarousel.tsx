import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { Card, Chip, SectionTitle } from './UI';

const EMOJI = [
  { k: /heal|healing|hurt|pain|peace/i, e: '💗' },
  { k: /boundar|respect|block/i, e: '🚫' },
  { k: /grow|future|progress|self/i, e: '🌱' },
  { k: /sleep|calm|anxiety|panic/i, e: '😮‍💨' },
  { k: /friends?|family|support/i, e: '🫶' },
  { k: /work|focus|career/i, e: '🎯' },
];

function withEmoji(text: string) {
  const hit = EMOJI.find(x => x.k.test(text));
  return hit ? `${hit.e} ${text}` : text;
}

export default function ReasonsCarousel() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { reasons } = useAppStore();

  const { displayReasons, hasMore } = useMemo(() => {
    const max = 6;
    const list = reasons || [];
    return { displayReasons: list.slice(0, max), hasMore: list.length > max };
  }, [reasons]);

  return (
    <Card>
      <SectionTitle right={
        <Chip label="Edit" onPress={() => navigation.navigate('EditReasons')} />
      }>
        Your Reasons
      </SectionTitle>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
      >
        {displayReasons.map((reason, i) => (
          <Animated.View 
            key={i} 
            entering={SlideInUp.springify().damping(18).stiffness(120).delay(i * 50)}
          >
            <Chip label={withEmoji(reason)} onPress={() => navigation.navigate('EditReasons')} />
          </Animated.View>
        ))}
        {hasMore && (
          <Animated.View 
            entering={SlideInUp.springify().damping(18).stiffness(120).delay(displayReasons.length * 50)}
          >
            <Chip
              label={`Show all ${reasons.length} →`}
              onPress={() => navigation.navigate('EditReasons')}
            />
          </Animated.View>
        )}
      </ScrollView>
    </Card>
  );
}

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';
import { colors, spacing, typography } from '../theme';
import { Card, SectionTitle, Col, Button } from '../components/UI';
import EmptyStateArt from '../components/EmptyStateArt';
import { CheckIn } from '../types';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
  const { colors: themeColors } = useTheme();
  const { checkIns } = useAppStore();
  const navigation = useNavigation<any>();

  const sortedCheckIns = useMemo(() => 
    [...checkIns].sort((a, b) => 
      new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
    ), 
    [checkIns]
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Card style={styles.emptyCard}>
        <EmptyStateArt kind="history" />
        <Text style={[typography.h3, { color: themeColors.text, marginTop: spacing(1) }]}>
          No check-ins yet
        </Text>
        <Text style={{ color: themeColors.subtext, marginTop: 4 }}>
          Your first entry will appear here.
        </Text>
        <Button
          label="Add a check-in"
          tone="accent"
          onPress={() => navigation.navigate('Journal')}
          style={{ marginTop: spacing(2) }}
        />
      </Card>
    </View>
  );

  const renderCheckIn = ({ item }: { item: CheckIn }) => {
    const date = new Date(item.dateISO);
    const emojis = ['😭', '😢', '😐', '🙂', '😄'];
    const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];
    
    return (
      <Card style={styles.checkInCard}>
        <View 
          style={styles.checkInHeader}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Check-in from ${format(date, 'MMMM d, yyyy')}, mood: ${moodLabels[item.mood - 1]}`}
        >
          <Text style={[typography.body, { color: themeColors.text, fontWeight: '600' }]}>
            {format(date, 'MMM d, yyyy')}
          </Text>
          <Text 
            style={styles.checkInEmoji}
            accessibilityLabel={`Mood: ${moodLabels[item.mood - 1]}`}
          >
            {emojis[item.mood - 1]}
          </Text>
        </View>
        {item.note && (
          <Text style={[typography.body, { color: themeColors.subtext, lineHeight: 20, marginTop: spacing(0.5) }]}>
            {item.note}
          </Text>
        )}
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedCheckIns}
        keyExtractor={(item, index) => item.id || item.dateISO || String(index)}
        renderItem={renderCheckIn}
        ItemSeparatorComponent={() => <View style={{ height: spacing(1) }} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyComponent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center', marginBottom: spacing(2) }]}>
            History
          </Text>
        )}
        accessibilityRole="list"
        accessibilityLabel="Check-in history"
        getItemLayout={(data, index) => ({
          length: 80, // Approximate item height
          offset: 80 * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContainer: {
    padding: spacing(2),
    paddingBottom: spacing(2) + 24, // Safe area bottom padding
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing(2),
  },
  emptyCard: {
    width: '100%',
    alignItems: 'center',
  },
  checkInCard: {
    marginHorizontal: spacing(1),
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInEmoji: {
    fontSize: 20,
  },
});

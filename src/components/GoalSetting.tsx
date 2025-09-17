import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Card, Button, Col } from './UI';

interface Goal {
  id: string;
  title: string;
  targetDays: number;
  currentDays: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface GoalSettingProps {
  currentStreakDays: number;
  onGoalCreate: (title: string, targetDays: number) => void;
  onGoalUpdate: (id: string, updates: Partial<Goal>) => void;
  onGoalDelete: (id: string) => void;
  goals: Goal[];
}

export const GoalSetting: React.FC<GoalSettingProps> = ({
  currentStreakDays,
  onGoalCreate,
  onGoalUpdate,
  onGoalDelete,
  goals,
}) => {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDays, setNewGoalDays] = useState('7');

  const handleCreateGoal = useCallback(() => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    const targetDays = parseInt(newGoalDays);
    if (isNaN(targetDays) || targetDays < 1) {
      Alert.alert('Error', 'Please enter a valid number of days');
      return;
    }

    onGoalCreate(newGoalTitle.trim(), targetDays);
    setNewGoalTitle('');
    setNewGoalDays('7');
  }, [newGoalTitle, newGoalDays, onGoalCreate]);

  const handleGoalComplete = useCallback((goalId: string) => {
    onGoalUpdate(goalId, {
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }, [onGoalUpdate]);

  const handleGoalDelete = useCallback((goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onGoalDelete(goalId) }
      ]
    );
  }, [onGoalDelete]);

  const getProgressPercentage = (goal: Goal) => {
    return Math.min(100, (currentStreakDays / goal.targetDays) * 100);
  };

  return (
    <Card>
      <Text style={[typography.h3, { color: colors.text, marginBottom: spacing(1) }]}>
        Goals & Milestones
      </Text>

      {/* Create New Goal */}
      <View style={styles.createGoalSection}>
        <Text style={[typography.body, { color: colors.subtext, marginBottom: spacing(1) }]}>
          Set a new goal
        </Text>
        <TextInput
          style={styles.input}
          value={newGoalTitle}
          onChangeText={setNewGoalTitle}
          placeholder="e.g., Stay strong for 30 days"
          placeholderTextColor={colors.subtext}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.daysInput]}
            value={newGoalDays}
            onChangeText={setNewGoalDays}
            placeholder="7"
            placeholderTextColor={colors.subtext}
            keyboardType="numeric"
          />
          <Text style={[typography.body, { color: colors.subtext, marginLeft: spacing(1) }]}>
            days
          </Text>
        </View>
        <Button
          label="Create Goal"
          tone="accent"
          onPress={handleCreateGoal}
          style={{ marginTop: spacing(1) }}
        />
      </View>

      {/* Goals List */}
      {goals.length > 0 && (
        <View style={styles.goalsList}>
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const isCompleted = goal.completed || currentStreakDays >= goal.targetDays;
            
            return (
              <View key={goal.id} style={[styles.goalItem, isCompleted && styles.completedGoal]}>
                <View style={styles.goalHeader}>
                  <Text style={[
                    typography.body, 
                    { color: isCompleted ? colors.success : colors.text }
                  ]}>
                    {goal.title}
                  </Text>
                  <Text style={[typography.small, { color: colors.subtext }]}>
                    {currentStreakDays}/{goal.targetDays} days
                  </Text>
                </View>
                
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progress}%`,
                        backgroundColor: isCompleted ? colors.success : colors.accent
                      }
                    ]} 
                  />
                </View>

                <View style={styles.goalActions}>
                  {!isCompleted && currentStreakDays >= goal.targetDays && (
                    <Button
                      label="Mark Complete"
                      tone="success"
                      onPress={() => handleGoalComplete(goal.id)}
                      style={styles.actionButton}
                    />
                  )}
                  <Button
                    label="Delete"
                    tone="danger"
                    onPress={() => handleGoalDelete(goal.id)}
                    style={styles.actionButton}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {goals.length === 0 && (
        <Text style={[typography.body, { color: colors.subtext, textAlign: 'center', fontStyle: 'italic' }]}>
          No goals set yet. Create your first goal to stay motivated!
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  createGoalSection: {
    marginBottom: spacing(2),
    paddingBottom: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing(1.5),
    fontSize: 16,
    backgroundColor: colors.muted,
    color: colors.text,
    marginBottom: spacing(1),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysInput: {
    width: 80,
    marginRight: spacing(1),
  },
  goalsList: {
    gap: spacing(1),
  },
  goalItem: {
    padding: spacing(1.5),
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedGoal: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: spacing(1),
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalActions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  actionButton: {
    flex: 1,
  },
});

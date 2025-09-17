import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Card, SectionTitle, Col } from '../components/UI';

export default function EditReasonsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Col gap={2}>
          <Text style={[typography.h1, { color: colors.text, textAlign: 'center' }] as any}>
            Edit Reasons
          </Text>
          
          <Card>
            <SectionTitle>Coming Soon</SectionTitle>
            <Text style={[typography.body, { color: colors.subtext, textAlign: 'center' }] as any}>
              You'll be able to add, edit, and manage your personal reasons here.
            </Text>
          </Card>
        </Col>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing(2),
  },
});

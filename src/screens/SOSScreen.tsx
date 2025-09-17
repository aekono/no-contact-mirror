import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Linking, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { Card, Button, Col } from '../components/UI';
import { useTheme } from '../hooks/useTheme';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { getDisclaimer } from '../content/contentStore';

const CRISIS_LINES = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 crisis support',
    color: '#FF6B6B'
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: '24/7 text support',
    color: '#5ED3A8'
  },
  {
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    description: '24/7 support for abuse',
    color: '#6CA0FF'
  },
  {
    name: 'Emergency Services',
    number: '911',
    description: 'Immediate emergency help',
    color: '#FF6B6B'
  }
];

export default function SOSScreen() {
  const { colors: themeColors } = useTheme();
  const { triggerHaptic } = useHapticFeedback();
  const disclaimer = getDisclaimer();

  const handleCall = async (number: string, name: string) => {
    try {
      triggerHaptic('heavy');
      const url = `tel:${number}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot make call', 'Phone calling is not available on this device.');
      }
    } catch (error) {
      console.error('Error making call:', error);
      Alert.alert('Error', 'Unable to make the call. Please try again.');
    }
  };

  const handleText = async (number: string, name: string) => {
    try {
      triggerHaptic('heavy');
      const url = `sms:${number}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot send text', 'Text messaging is not available on this device.');
      }
    } catch (error) {
      console.error('Error sending text:', error);
      Alert.alert('Error', 'Unable to send text. Please try again.');
    }
  };

  const CrisisLineCard = ({ line, index }: { line: typeof CRISIS_LINES[0], index: number }) => (
    <Card key={index} style={[styles.crisisCard, { borderLeftColor: line.color, borderLeftWidth: 4 }]}>
      <View style={styles.crisisHeader}>
        <Text style={[typography.h3, { color: themeColors.text }]}>{line.name}</Text>
        <Text style={[typography.body, { color: line.color, fontWeight: '700', fontSize: 18 }]}>
          {line.number}
        </Text>
      </View>
      
      <Text style={[typography.body, { color: themeColors.subtext, marginBottom: spacing(1.5) }]}>
        {line.description}
      </Text>
      
      <View style={styles.crisisActions}>
        {line.number.includes('Text') ? (
          <Button
            label="Send Text"
            tone="success"
            onPress={() => handleText(line.number.replace('Text ', ''), line.name)}
            style={{ flex: 1 }}
            accessibilityLabel={`Send text to ${line.name}`}
          />
        ) : (
          <Button
            label="Call Now"
            tone="danger"
            onPress={() => handleCall(line.number, line.name)}
            style={{ flex: 1 }}
            accessibilityLabel={`Call ${line.name}`}
          />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Col gap={2}>
          <Text style={[typography.h1, { color: themeColors.text, textAlign: 'center' }] as any}>
            Crisis Resources
          </Text>
          
          <Card style={[styles.urgentCard, { backgroundColor: themeColors.danger + '10', borderColor: themeColors.danger + '30' }]}>
            <View style={styles.urgentHeader}>
              <Ionicons name="warning" size={24} color={themeColors.danger} />
              <Text style={[typography.h3, { color: themeColors.danger, marginLeft: spacing(1) }]}>
                Need Help Right Now?
              </Text>
            </View>
            <Text style={[typography.body, { color: themeColors.text, marginTop: spacing(1) }]}>
              If you're in immediate danger or having thoughts of self-harm, please reach out to one of these resources immediately. You don't have to go through this alone.
            </Text>
          </Card>

          <View style={styles.crisisList}>
            {CRISIS_LINES.map((line, index) => (
              <CrisisLineCard key={index} line={line} index={index} />
            ))}
          </View>

          {/* Disclaimer */}
          {disclaimer && (
            <Card style={[styles.disclaimerCard, { backgroundColor: themeColors.muted }]}>
              <View style={styles.disclaimerHeader}>
                <Ionicons name="information-circle" size={20} color={themeColors.subtext} />
                <Text style={[typography.h3, { color: themeColors.text, marginLeft: spacing(0.5) }]}>
                  Important Notice
                </Text>
              </View>
              <Text style={[typography.body, { color: themeColors.subtext, marginTop: spacing(1), lineHeight: 22 }]}>
                {disclaimer.text}
              </Text>
            </Card>
          )}

          <Card style={styles.supportCard}>
            <Text style={[typography.h3, { color: themeColors.text, marginBottom: spacing(1) }]}>
              Additional Support
            </Text>
            <Text style={[typography.body, { color: themeColors.subtext, lineHeight: 22 }]}>
              • Talk to a trusted friend or family member{'\n'}
              • Reach out to a mental health professional{'\n'}
              • Visit your nearest emergency room{'\n'}
              • Use the panic support features in this app
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
    paddingBottom: spacing(4),
  },
  urgentCard: {
    borderWidth: 2,
    padding: spacing(2),
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crisisList: {
    gap: spacing(1.5),
  },
  crisisCard: {
    padding: spacing(2),
  },
  crisisHeader: {
    marginBottom: spacing(1),
  },
  crisisActions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  disclaimerCard: {
    padding: spacing(2),
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  supportCard: {
    padding: spacing(2),
  },
});

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import { useTheme } from '../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function Tabs() {
  const nav = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'Home', // Hide header for Home screen
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => nav.navigate('Settings')}
            accessibilityLabel="Open Settings"
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingBottom: Math.max(6, insets.bottom),
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const name =
            route.name === 'Home'
              ? focused ? 'home' : 'home-outline'
              : route.name === 'Check-In'
              ? focused ? 'add-circle' : 'add-circle-outline'
              : route.name === 'History'
              ? focused ? 'time' : 'time-outline'
              : focused ? 'stats-chart' : 'stats-chart-outline';
          return <Ionicons name={name as any} size={size ?? 20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Check-In" component={JournalScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

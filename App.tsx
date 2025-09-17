import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useTheme } from './src/hooks/useTheme';

// Import navigation
import Tabs from './src/navigation/Tabs';

// Import screens
import EditReasonsScreen from './src/screens/EditReasonsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AdvancedSettingsScreen from './src/screens/AdvancedSettingsScreen';
import ThemePresetsScreen from './src/screens/ThemePresetsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import AboutScreen from './src/screens/AboutScreen';
import SOSScreen from './src/screens/SOSScreen';

// Import components
// ErrorBoundary removed during cleanup

// Import theme
import { ThemeProvider } from './src/theme/ThemeContext';

// Import types
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Theme-aware app content component
function AppContent() {
  const { colors } = useTheme();
  
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.bg} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Tabs"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="EditReasons" component={EditReasonsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="AdvancedSettings" component={AdvancedSettingsScreen} />
          <Stack.Screen name="ThemePresets" component={ThemePresetsScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="SOS" component={SOSScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  useEffect(() => {
    // Request notification permissions on app start
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };

    requestPermissions();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Unique identifier for our daily reminder
const DAILY_REMINDER_ID = 'daily-reminder-no-contact';

export async function requestNotifPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

export async function scheduleDailyReminder(hour, minute) {
  try {
    // First, cancel any existing daily reminders
    await cancelAllReminders();
    
    // Schedule new daily reminder
    const trigger = {
      hour,
      minute,
      repeats: true,
    };
    
    const notification = {
      content: {
        title: 'No-Contact Reminder',
        body: 'Remember your reasons. You\'re healing.',
        data: { type: 'daily-reminder' },
      },
      trigger,
    };
    
    const identifier = await Notifications.scheduleNotificationAsync(notification);
    console.log('Daily reminder scheduled:', identifier);
    return true;
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return false;
  }
}

export async function cancelAllReminders() {
  try {
    // Cancel all scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All reminders cancelled');
    return true;
  } catch (error) {
    console.error('Error cancelling reminders:', error);
    return false;
  }
}

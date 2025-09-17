import * as Notifications from 'expo-notifications';
import { getRandomMessageForSurface, initializeContentStore } from '../content/contentStore';

export async function requestNotifPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

export async function scheduleDailyReminder(hour = 20, minute = 0): Promise<string | null> {
  try {
    // Cancel any existing reminders first
    await cancelAllReminders();
    
    // Initialize content store and get notification message
    await initializeContentStore();
    const notificationMessage = getRandomMessageForSurface("Notifications (opt-in)");
    
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Check-In",
        body: notificationMessage?.text || "You're healing. Stay strong.",
        data: { type: 'daily-reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      } as any,
    });
    
    return identifier;
  } catch (error) {
    console.error('Failed to schedule daily reminder:', error);
    return null;
  }
}

export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel reminders:', error);
  }
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
}

export async function rescheduleReminder(hour: number, minute: number): Promise<string | null> {
  try {
    await cancelAllReminders();
    return await scheduleDailyReminder(hour, minute);
  } catch (error) {
    console.error('Failed to reschedule reminder:', error);
    return null;
  }
}

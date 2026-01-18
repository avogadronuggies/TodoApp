import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    // Set up Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });

      await Notifications.setNotificationChannelAsync("task-reminders", {
        name: "Task Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Notification Permission Required",
        "Please enable notifications to receive task reminders. Go to Settings > Apps > TodoApp > Notifications to enable them.",
        [{ text: "OK" }],
      );
      return false;
    }

    return true;
  } catch (error) {
    console.log("Error requesting notification permissions", error);
    return false;
  }
};

/**
 * Smart notification scheduling:
 * - For deadlines > 1 day away: Remind 1 day before + at deadline
 * - For deadlines 1-24 hours away: Remind 1 hour before + at deadline
 * - For deadlines < 1 hour away: Only remind at deadline
 * This prevents notification spam while keeping users informed.
 */
export const scheduleTaskReminder = async (taskId, taskText, deadlineDate) => {
  try {
    // Cancel any existing notifications for this task first
    await cancelTaskReminders(taskId);

    const now = Date.now();
    const deadline = new Date(deadlineDate).getTime();
    const timeUntilDeadline = deadline - now;

    // Constants for time calculations (in milliseconds)
    const ONE_MINUTE = 60 * 1000;
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;

    console.log(`Scheduling reminder for "${taskText}"`);
    console.log(`Deadline: ${new Date(deadline).toLocaleString()}`);
    console.log(
      `Time until deadline: ${Math.floor(timeUntilDeadline / ONE_HOUR)} hours`,
    );

    // If task is already overdue, send immediate notification (only if within 1 hour overdue)
    if (timeUntilDeadline <= 0) {
      if (timeUntilDeadline > -ONE_HOUR) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⚠️ Task Overdue!",
            body: `"${taskText}" is overdue! Complete it now!`,
            data: { taskId },
            sound: "default",
            ...(Platform.OS === "android" && { channelId: "task-reminders" }),
          },
          trigger: null, // Immediate
        });
        console.log("Sent overdue notification");
      }
      return true;
    }

    // Helper function to schedule a notification at a specific timestamp
    const scheduleAt = async (triggerTimestamp, title, body) => {
      const secondsFromNow = Math.max(
        1,
        Math.round((triggerTimestamp - Date.now()) / 1000),
      );

      console.log(
        `Scheduling "${title}" in ${secondsFromNow} seconds (${Math.round(secondsFromNow / 3600)} hours)`,
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { taskId },
          sound: "default",
          ...(Platform.OS === "android" && { channelId: "task-reminders" }),
        },
        trigger: {
          type: "timeInterval",
          seconds: secondsFromNow,
          repeats: false,
        },
      });
    };

    // Schedule reminder based on how far away the deadline is
    if (timeUntilDeadline > ONE_DAY) {
      // Deadline is more than 1 day away - remind 1 day before
      const oneDayBefore = deadline - ONE_DAY;
      await scheduleAt(
        oneDayBefore,
        "📅 Task Due Tomorrow",
        `"${taskText}" is due tomorrow. Don't forget!`,
      );
    } else if (timeUntilDeadline > ONE_HOUR) {
      // Deadline is 1-24 hours away - remind 1 hour before
      const oneHourBefore = deadline - ONE_HOUR;
      await scheduleAt(
        oneHourBefore,
        "⏰ Task Due in 1 Hour",
        `"${taskText}" needs to be completed soon!`,
      );
    } else if (timeUntilDeadline > 15 * ONE_MINUTE) {
      // Deadline is 15 min - 1 hour away - remind 15 minutes before
      const fifteenMinBefore = deadline - 15 * ONE_MINUTE;
      await scheduleAt(
        fifteenMinBefore,
        "⚡ Task Due Soon",
        `"${taskText}" is due in 15 minutes!`,
      );
    }

    // Always schedule the "due now" notification at the exact deadline
    await scheduleAt(
      deadline,
      "🔔 Task Due Now!",
      `"${taskText}" is due right now!`,
    );

    console.log(`Successfully scheduled reminders for "${taskText}"`);
    return true;
  } catch (error) {
    console.error("Notification scheduling failed:", error);
    return false;
  }
};

export const cancelTaskReminders = async (taskId) => {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const notificationsToCancel = notifications.filter(
      (notification) => notification.content.data?.taskId === taskId,
    );

    await Promise.all(
      notificationsToCancel.map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier),
      ),
    );

    return true;
  } catch (error) {
    console.error("Error cancelling notifications:", error);
    return false;
  }
};

// Listen for notification events
export const setupNotificationListeners = (onNotificationReceived) => {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received:", notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    },
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response);
      // Handle notification tap - could navigate to specific task
    });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useColorScheme,
  Animated,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import styles from "./styles";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Define theme colors
const themes = {
  light: {
    primary: "green",
    primaryLight: "#a78bfa",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    inputBg: "#f1f5f9",
    statusBar: "dark",
    shadow: "#000",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    deadline: "#f43f5e",
  },
  dark: {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#94a3b8",
    border: "#334155",
    inputBg: "#334155",
    statusBar: "light",
    shadow: "#000",
    success: "#059669",
    warning: "#d97706",
    danger: "#dc2626",
    deadline: "#be123c",
  },
};

// Logo component
const AppLogo = () => {
  return (
    <Image
      source={require("./assets/logo.png")}
      style={styles.logoImage}
      resizeMode="contain"
    />
  );
};

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [deadline, setDeadline] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  const theme = isDarkMode ? themes.dark : themes.light;

  useEffect(() => {
    loadTasks();
    loadThemePreference();
    registerForPushNotifications();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    saveThemePreference();
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode]);

  const registerForPushNotifications = async () => {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
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
          "Notification Permission",
          "Please enable notifications to receive task reminders"
        );
        return;
      }
    } catch (error) {
      console.log("Error requesting notification permissions", error);
    }
  };

  const scheduleTaskReminder = async (taskId, taskText, deadlineDate) => {
    try {
      // 1. Cancel any existing notifications for this task
      await cancelTaskReminders(taskId);

      const now = new Date();
      const deadline = new Date(deadlineDate);
      const timeUntilDeadline = deadline - now;

      // 2. If overdue, handle separately
      if (timeUntilDeadline <= 0) {
        if (timeUntilDeadline > -1000 * 60 * 60) {
          // Within 1 hour overdue
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "⚠️ Task Overdue!",
              body: `"${taskText}" is overdue! Complete it now!`,
              data: { taskId },
              sound: true,
            },
            trigger: null,
          });
        }
        return;
      }

      // 3. Configure Android-specific notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("task-reminders", {
          name: "Task Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
          sound: "default",
        });
      }

      // 4. Schedule only the most appropriate notification
      const intervals = [
        { time: 12 * 60 * 60 * 1000, message: "12 hours" }, // 12 hours
        { time: 8 * 60 * 60 * 1000, message: "8 hours" }, // 8 hours
        { time: 4 * 60 * 60 * 1000, message: "4 hours" }, // 4 hours
        { time: 2 * 60 * 60 * 1000, message: "2 hours" }, // 2 hours
        { time: 1 * 60 * 60 * 1000, message: "1 hour" }, // 1 hour
        { time: 30 * 60 * 1000, message: "30 minutes" }, // 30 mins
        { time: 15 * 60 * 1000, message: "15 minutes" }, // 15 mins
      ];

      // Find the most appropriate interval for notification
      let selectedInterval = null;

      for (const interval of intervals) {
        if (timeUntilDeadline > interval.time) {
          // Schedule at exactly the right time
          const triggerTime = deadline.getTime() - interval.time;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `⏰ Due in ${interval.message}`,
              body: `"${taskText}" needs completion`,
              data: { taskId },
              sound: true,
              ...(Platform.OS === "android" && { channelId: "task-reminders" }),
            },
            trigger: { date: new Date(triggerTime) },
          });
          selectedInterval = interval;
          break;
        }
      }

      // If timeUntilDeadline is less than the smallest interval (15 min)
      // but more than 1 minute, schedule a "due soon" notification
      if (!selectedInterval && timeUntilDeadline > 60 * 1000) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⏰ Due soon`,
            body: `"${taskText}" needs completion`,
            data: { taskId },
            sound: true,
            ...(Platform.OS === "android" && { channelId: "task-reminders" }),
          },
          trigger: { date: new Date(now.getTime() + 1000) }, // Show almost immediately
        });
      }

      // 5. Always schedule the deadline notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "‼️ Due Now!",
          body: `"${taskText}" is due now!`,
          data: { taskId },
          sound: true,
          ...(Platform.OS === "android" && { channelId: "task-reminders" }),
        },
        trigger: { date: deadline },
      });
    } catch (error) {
      console.error("Notification scheduling failed:", error);
    }
  };

  const formatTimeLeft = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 1) return `${hours}h`;
    if (mins >= 1) return `${mins}m`;
    return "soon";
  };

  const cancelTaskReminders = async (taskId) => {
    try {
      // Using the newer Notifications API method
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();

      const notificationsToCancel = notifications.filter(
        (notification) => notification.content.data?.taskId === taskId
      );

      await Promise.all(
        notificationsToCancel.map((notification) =>
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier
          )
        )
      );
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  };

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("@theme_preference");
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme));
      } else {
        setIsDarkMode(systemColorScheme === "dark");
      }
    } catch (error) {
      console.log("Error loading theme preference", error);
    }
  };

  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem(
        "@theme_preference",
        JSON.stringify(isDarkMode)
      );
    } catch (error) {
      console.log("Error saving theme preference", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("@tasks");
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks");
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("@tasks", JSON.stringify(tasks));
    } catch (error) {
      Alert.alert("Error", "Failed to save tasks");
    }
  };

  const showDatePickerModal = () => {
    setPickerMode("date");
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline || new Date();

    if (Platform.OS === "android") {
      setShowDatePicker(false);

      if (selectedDate && pickerMode === "date") {
        setDeadline(currentDate);
        setPickerMode("time");
        setShowDatePicker(true);
        return;
      }

      if (selectedDate) {
        if (deadline) {
          const combinedDate = new Date(deadline);
          combinedDate.setHours(currentDate.getHours());
          combinedDate.setMinutes(currentDate.getMinutes());
          setDeadline(combinedDate);
        } else {
          setDeadline(currentDate);
        }
      }
    } else {
      setDeadline(currentDate);
    }
  };

  const addTask = () => {
    if (task.trim().length === 0) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    if (editingId !== null) {
      const updatedTasks = tasks.map((item) =>
        item.id === editingId
          ? {
              ...item,
              text: task,
              deadline: deadline ? deadline.toISOString() : item.deadline,
            }
          : item
      );
      setTasks(updatedTasks);

      const updatedTask = updatedTasks.find((t) => t.id === editingId);
      if (updatedTask.deadline) {
        scheduleTaskReminder(
          updatedTask.id,
          updatedTask.text,
          updatedTask.deadline
        );
      }

      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        createdAt: new Date().toISOString(),
        deadline: deadline ? deadline.toISOString() : null,
      };

      setTasks([...tasks, newTask]);

      if (newTask.deadline) {
        scheduleTaskReminder(newTask.id, newTask.text, newTask.deadline);
      }
    }

    setTask("");
    setDeadline(null);
  };

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await cancelTaskReminders(id);
          setTasks(tasks.filter((task) => task.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    setTasks(updatedTasks);

    const completedTask = updatedTasks.find((t) => t.id === id);
    if (completedTask.completed) {
      cancelTaskReminders(id);
    } else if (completedTask.deadline) {
      scheduleTaskReminder(id, completedTask.text, completedTask.deadline);
    }
  };

  const startEditing = (id, text, taskDeadline) => {
    setEditingId(id);
    setTask(text);
    setDeadline(taskDeadline ? new Date(taskDeadline) : null);
  };

  const formatDate = (dateString) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return null;

    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline - now;

    if (diffTime <= 0) return "Overdue";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return "1 day left";
    if (diffHours > 1) return `${diffHours} hours left`;
    if (diffHours === 1) return "1 hour left";
    if (diffMinutes > 1) return `${diffMinutes} minutes left`;
    return "Due soon";
  };

  const renderItem = ({ item }) => {
    const daysRemaining = getDaysRemaining(item.deadline);
    const isImminent =
      daysRemaining?.includes("hour") ||
      daysRemaining?.includes("minute") ||
      daysRemaining === "Due soon";

    return (
      <Animated.View
        style={[
          styles.taskContainer,
          {
            backgroundColor: theme.card,
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
            shadowColor: theme.shadow,
          },
        ]}
      >
        <View style={styles.taskHeader}>
          <TouchableOpacity
            style={styles.taskTextContainer}
            onPress={() => toggleComplete(item.id)}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: item.completed ? theme.success : theme.primary },
                item.completed && { backgroundColor: theme.success },
              ]}
            >
              {item.completed && (
                <View style={[styles.checkmark, { borderColor: "white" }]} />
              )}
            </View>
            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskText,
                  { color: theme.text },
                  item.completed && styles.taskTextCompleted,
                  item.completed && { color: theme.textSecondary },
                ]}
                numberOfLines={2}
              >
                {item.text}
              </Text>

              <View style={styles.taskMetaContainer}>
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                  {formatDate(item.createdAt)}
                </Text>

                {item.deadline && (
                  <View
                    style={[
                      styles.deadlineContainer,
                      {
                        backgroundColor:
                          daysRemaining === "Overdue"
                            ? theme.danger
                            : isImminent
                            ? `${theme.deadline}40`
                            : `${theme.deadline}20`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.deadlineText,
                        {
                          color:
                            daysRemaining === "Overdue"
                              ? "#ffffff"
                              : theme.deadline,
                        },
                      ]}
                    >
                      {daysRemaining} • Due: {formatDate(item.deadline)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.warning }]}
            onPress={() => startEditing(item.id, item.text, item.deadline)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.danger }]}
            onPress={() => deleteTask(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        { opacity: fadeAnim },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style={theme.statusBar} />
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <AppLogo />
              <Text style={styles.title}>My Tasks</Text>
            </View>
            <Text style={styles.subtitle}>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} •{" "}
              {tasks.filter((t) => t.completed).length} completed
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.themeToggle,
              { backgroundColor: theme.primaryLight },
            ]}
            onPress={toggleTheme}
          >
            <Text style={styles.themeToggleText}>
              {isDarkMode ? "☀️" : "🌙"}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[
            styles.taskInputContainer,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Add a new task..."
              placeholderTextColor={theme.textSecondary}
              value={task}
              onChangeText={setTask}
            />

            <TouchableOpacity
              style={[
                styles.dateButton,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
              onPress={showDatePickerModal}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  { color: deadline ? theme.deadline : theme.textSecondary },
                ]}
              >
                {deadline ? formatDate(deadline) : "Set Deadline"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={addTask}
          >
            <Text style={styles.addButtonText}>
              {editingId !== null ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: `${theme.primary}20` },
              ]}
            >
              <AppLogo />
            </View>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No tasks yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Add a task to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.taskList}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deadline || new Date()}
            mode={pickerMode}
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

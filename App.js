import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  SectionList,
  Text,
  SafeAreaView,
  Platform,
  Alert,
  useColorScheme,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles";

// Import components
import {
  Header,
  TaskInput,
  TaskItem,
  EmptyState,
  NavBar,
  DailyRoutine,
  themes,
  registerForPushNotifications,
  scheduleTaskReminder,
  cancelTaskReminders,
  setupNotificationListeners,
} from "./components";

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [deadline, setDeadline] = useState(null);
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");
  const [editingTimerId, setEditingTimerId] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [routines, setRoutines] = useState([]);

  const theme = isDarkMode ? themes.dark : themes.light;

  useEffect(() => {
    loadTasks();
    loadRoutines();
    loadThemePreference();
    initializeNotifications();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    saveRoutines();
  }, [routines]);

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

  const initializeNotifications = async () => {
    const permissionGranted = await registerForPushNotifications();
    if (permissionGranted) {
      // Set up notification listeners
      const cleanup = setupNotificationListeners((notification) => {
        // Handle received notification while app is open
        console.log("Notification received in app:", notification);
      });

      // Return cleanup function
      return cleanup;
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
        JSON.stringify(isDarkMode),
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

  const loadRoutines = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem("@routines");
      if (storedRoutines !== null) {
        setRoutines(JSON.parse(storedRoutines));
      }
    } catch (error) {
      console.log("Error loading routines", error);
    }
  };

  const saveRoutines = async () => {
    try {
      await AsyncStorage.setItem("@routines", JSON.stringify(routines));
    } catch (error) {
      console.log("Error saving routines", error);
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
              notes: notes,
              deadline: deadline ? deadline.toISOString() : item.deadline,
            }
          : item,
      );
      setTasks(updatedTasks);

      const updatedTask = updatedTasks.find((t) => t.id === editingId);
      if (updatedTask.deadline) {
        scheduleTaskReminder(
          updatedTask.id,
          updatedTask.text,
          updatedTask.deadline,
        );
      }

      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        notes: notes,
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
    setNotes("");
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
      item.id === id ? { ...item, completed: !item.completed } : item,
    );

    setTasks(updatedTasks);

    const completedTask = updatedTasks.find((t) => t.id === id);
    if (completedTask) {
      if (completedTask.completed) {
        cancelTaskReminders(id);
      } else if (completedTask.deadline) {
        scheduleTaskReminder(id, completedTask.text, completedTask.deadline);
      }
    }
  };

  const startEditing = (id, text, taskDeadline, taskNotes) => {
    setEditingId(id);
    setTask(text);
    setNotes(taskNotes || "");
    setDeadline(taskDeadline ? new Date(taskDeadline) : null);
  };

  const startEditingTimer = (id, taskDeadline) => {
    setEditingTimerId(id);
    setDeadline(taskDeadline ? new Date(taskDeadline) : null);
    setPickerMode("date");
    setShowDatePicker(true);
  };

  const clearTaskDeadline = async (id) => {
    await cancelTaskReminders(id);
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, deadline: null } : item,
    );
    setTasks(updatedTasks);
  };

  const onTimerDateChange = (event, selectedDate) => {
    if (!editingTimerId) {
      onDateChange(event, selectedDate);
      return;
    }

    const currentDate = selectedDate || deadline || new Date();

    if (Platform.OS === "android") {
      setShowDatePicker(false);

      if (event.type === "dismissed") {
        setEditingTimerId(null);
        setDeadline(null);
        return;
      }

      if (selectedDate && pickerMode === "date") {
        setDeadline(currentDate);
        setPickerMode("time");
        setShowDatePicker(true);
        return;
      }

      if (selectedDate) {
        let finalDate = currentDate;
        if (deadline) {
          const combinedDate = new Date(deadline);
          combinedDate.setHours(currentDate.getHours());
          combinedDate.setMinutes(currentDate.getMinutes());
          finalDate = combinedDate;
        }

        // Update the task with new deadline
        const updatedTasks = tasks.map((item) =>
          item.id === editingTimerId
            ? { ...item, deadline: finalDate.toISOString() }
            : item,
        );
        setTasks(updatedTasks);

        // Schedule new reminder
        const updatedTask = updatedTasks.find((t) => t.id === editingTimerId);
        if (updatedTask) {
          scheduleTaskReminder(
            updatedTask.id,
            updatedTask.text,
            updatedTask.deadline,
          );
        }

        setEditingTimerId(null);
        setDeadline(null);
      }
    } else {
      // iOS handling
      setDeadline(currentDate);
    }
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
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return "1 day left";
    if (diffHours > 1) return `${diffHours} hours left`;
    if (diffHours === 1) return "1 hour left";
    if (diffMinutes > 1) return `${diffMinutes} minutes left`;
    return "Due soon";
  };

  // Group tasks by deadline into sections
  const groupTasksByDeadline = (taskList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const groups = {
      overdue: { title: "⚠️ Overdue", data: [], order: 0 },
      today: { title: "📌 Today", data: [], order: 1 },
      tomorrow: { title: "📅 Tomorrow", data: [], order: 2 },
      thisWeek: { title: "🗓️ This Week", data: [], order: 3 },
      later: { title: "📆 Later", data: [], order: 4 },
      noDeadline: { title: "📝 No Deadline", data: [], order: 5 },
    };

    taskList.forEach((task) => {
      if (!task.deadline) {
        groups.noDeadline.data.push(task);
        return;
      }

      const deadline = new Date(task.deadline);
      const deadlineDate = new Date(
        deadline.getFullYear(),
        deadline.getMonth(),
        deadline.getDate(),
      );

      if (deadline < now) {
        groups.overdue.data.push(task);
      } else if (deadlineDate.getTime() === today.getTime()) {
        groups.today.data.push(task);
      } else if (deadlineDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.data.push(task);
      } else if (deadline < endOfWeek) {
        groups.thisWeek.data.push(task);
      } else {
        groups.later.data.push(task);
      }
    });

    // Sort tasks within each group by deadline (earliest first)
    Object.values(groups).forEach((group) => {
      group.data.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    });

    // Return only groups that have tasks, sorted by order
    return Object.values(groups)
      .filter((group) => group.data.length > 0)
      .sort((a, b) => a.order - b.order);
  };

  // Memoize the grouped sections to avoid recalculating on every render
  const sections = useMemo(() => groupTasksByDeadline(tasks), [tasks]);

  const renderItem = ({ item }) => (
    <TaskItem
      item={item}
      theme={theme}
      fadeAnim={fadeAnim}
      onToggleComplete={toggleComplete}
      onEdit={startEditing}
      onEditTimer={startEditingTimer}
      onClearDeadline={clearTaskDeadline}
      onDelete={deleteTask}
      formatDate={formatDate}
      getDaysRemaining={getDaysRemaining}
    />
  );

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

        <Header
          theme={theme}
          tasks={tasks}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <NavBar
          theme={theme}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "tasks" ? (
          <>
            <TaskInput
              theme={theme}
              task={task}
              onTaskChange={setTask}
              notes={notes}
              onNotesChange={setNotes}
              deadline={deadline}
              onShowDatePicker={showDatePickerModal}
              onAddTask={addTask}
              editingId={editingId}
              formatDate={formatDate}
            />

            {tasks.length === 0 ? (
              <EmptyState theme={theme} />
            ) : (
              <SectionList
                sections={sections}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={[
                      styles.sectionHeader,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <Text
                      style={[styles.sectionHeaderText, { color: theme.text }]}
                    >
                      {title}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.taskList}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={true}
              />
            )}
          </>
        ) : (
          <DailyRoutine
            theme={theme}
            routines={routines}
            onRoutinesChange={setRoutines}
          />
        )}

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deadline || new Date()}
            mode={pickerMode}
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={editingTimerId ? onTimerDateChange : onDateChange}
            minimumDate={new Date()}
          />
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

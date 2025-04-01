import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar as RNStatusBar,
  useColorScheme,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

// Define theme colors with more modern palette
const themes = {
  light: {
    primary: "#7c3aed", // Vibrant purple
    primaryLight: "#a78bfa",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#1e293b",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    inputBg: "#f1f5f9",
    statusBar: "dark",
    shadow: "#000",
    success: "#10b981", // Green for completed tasks
    warning: "#f59e0b", // Amber for edit button
    danger: "#ef4444", // Red for delete button
  },
  dark: {
    primary: "#8b5cf6", // Lighter purple for dark mode
    primaryLight: "#a78bfa",
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#94a3b8",
    border: "#334155",
    inputBg: "#334155",
    statusBar: "light",
    shadow: "#000",
    success: "#059669", // Darker green for dark mode
    warning: "#d97706", // Darker amber for dark mode
    danger: "#dc2626", // Darker red for dark mode
  },
};

const { width } = Dimensions.get("window");

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get current theme based on dark mode state
  const theme = isDarkMode ? themes.dark : themes.light;

  // Load tasks and theme preference from storage on app start
  useEffect(() => {
    loadTasks();
    loadThemePreference();
  }, []);

  // Save tasks to AsyncStorage whenever tasks change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // Save theme preference whenever it changes
  useEffect(() => {
    saveThemePreference();
    // Animate theme transition
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

  // Load theme preference
  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("@theme_preference");
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme));
      } else {
        // Use system preference if no stored preference
        setIsDarkMode(systemColorScheme === "dark");
      }
    } catch (error) {
      console.log("Error loading theme preference", error);
    }
  };

  // Save theme preference
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

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Load tasks from AsyncStorage
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

  // Save tasks to AsyncStorage
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("@tasks", JSON.stringify(tasks));
    } catch (error) {
      Alert.alert("Error", "Failed to save tasks");
    }
  };

  // Add a new task
  const addTask = () => {
    if (task.trim().length === 0) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    if (editingId !== null) {
      // Update existing task
      setTasks(
        tasks.map((item) =>
          item.id === editingId ? { ...item, text: task } : item
        )
      );
      setEditingId(null);
    } else {
      // Add new task
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: task,
          completed: false,
          createdAt: new Date(),
        },
      ]);
    }
    setTask("");
  };

  // Delete a task
  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setTasks(tasks.filter((task) => task.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  // Toggle task completion status
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Start editing a task
  const startEditing = (id, text) => {
    setEditingId(id);
    setTask(text);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render individual task item
  const renderItem = ({ item, index }) => {
    // Calculate animation delay based on index
    const animationDelay = index * 50;

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
              {item.completed && <View style={styles.checkmark} />}
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
              {item.createdAt && (
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                  {formatDate(item.createdAt)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.warning }]}
            onPress={() => startEditing(item.id, item.text)}
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
            <Text style={styles.title}>My Tasks</Text>
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
              <Text style={styles.emptyIcon}>📝</Text>
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
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight + 20 : 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 5,
  },
  themeToggle: {
    position: "absolute",
    top: Platform.OS === "android" ? RNStatusBar.currentHeight + 20 : 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  themeToggleText: {
    fontSize: 22,
  },
  taskInputContainer: {
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  input: {
    flex: 1,
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    marginLeft: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    height: 54,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskList: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  taskContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTextContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  taskContent: {
    flex: 1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 14,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "white",
    transform: [{ rotate: "-45deg" }],
    marginTop: -2,
  },
  taskText: {
    fontSize: 17,
    fontWeight: "500",
    flex: 1,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    minWidth: 70,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

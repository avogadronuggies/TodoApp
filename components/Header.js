import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AppLogo from "./AppLogo";
import styles from "../styles";

const Header = ({ theme, tasks, isDarkMode, onToggleTheme }) => {
  return (
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
        style={[styles.themeToggle, { backgroundColor: theme.primaryLight }]}
        onPress={onToggleTheme}
      >
        <Text style={styles.themeToggleText}>{isDarkMode ? "☀️" : "🌙"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

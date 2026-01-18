import React from "react";
import { View, Text } from "react-native";
import AppLogo from "./AppLogo";
import styles from "../styles";

const EmptyState = ({ theme }) => {
  return (
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
  );
};

export default EmptyState;

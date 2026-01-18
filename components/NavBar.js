import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

const NavBar = ({ theme, activeTab, onTabChange }) => {
  const tabs = [
    { id: "tasks", label: "📋 Tasks", icon: "📋" },
    { id: "routine", label: "🔄 Daily Routine", icon: "🔄" },
  ];

  return (
    <View
      style={[
        styles.navBar,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.navTab,
            activeTab === tab.id && [
              styles.navTabActive,
              { backgroundColor: theme.primary },
            ],
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            style={[
              styles.navTabText,
              { color: activeTab === tab.id ? "#ffffff" : theme.textSecondary },
              activeTab === tab.id && styles.navTabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavBar;

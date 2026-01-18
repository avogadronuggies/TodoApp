import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import styles from "../styles";

const TaskItem = ({
  item,
  theme,
  fadeAnim,
  onToggleComplete,
  onEdit,
  onEditTimer,
  onClearDeadline,
  onDelete,
  formatDate,
  getDaysRemaining,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  if (!item) return null;

  const daysRemaining = getDaysRemaining(item?.deadline);
  const isImminent =
    daysRemaining?.includes("hour") ||
    daysRemaining?.includes("minute") ||
    daysRemaining === "Due soon";

  const hasNotes = item.notes && item.notes.trim().length > 0;

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
          onPress={() => onToggleComplete(item.id)}
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

      {/* Notes Section */}
      {hasNotes && (
        <TouchableOpacity
          style={[
            styles.notesContainer,
            {
              backgroundColor: `${theme.primary}15`,
              borderColor: `${theme.primary}30`,
            },
          ]}
          onPress={() => setShowNotes(!showNotes)}
        >
          <View style={styles.notesHeader}>
            <Text style={[styles.notesLabel, { color: theme.primary }]}>
              📝 Notes
            </Text>
            <Text style={[styles.notesToggle, { color: theme.textSecondary }]}>
              {showNotes ? "▲" : "▼"}
            </Text>
          </View>
          {showNotes && (
            <Text style={[styles.notesText, { color: theme.text }]}>
              {item.notes}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.taskActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => onEditTimer(item.id, item.deadline)}
        >
          <Text style={styles.actionButtonText}>
            {item.deadline ? "⏰ Edit" : "⏰ Set"}
          </Text>
        </TouchableOpacity>
        {item.deadline && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.textSecondary },
            ]}
            onPress={() => onClearDeadline(item.id)}
          >
            <Text style={styles.actionButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.warning }]}
          onPress={() => onEdit(item.id, item.text, item.deadline, item.notes)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.danger }]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default TaskItem;

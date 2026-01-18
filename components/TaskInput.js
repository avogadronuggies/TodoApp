import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "../styles";

const TaskInput = ({
  theme,
  task,
  onTaskChange,
  notes,
  onNotesChange,
  deadline,
  onShowDatePicker,
  onAddTask,
  editingId,
  formatDate,
}) => {
  return (
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
          onChangeText={onTaskChange}
        />

        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: theme.inputBg, borderColor: theme.border },
          ]}
          onPress={onShowDatePicker}
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

      <TextInput
        style={[
          styles.notesInput,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Add notes (optional)..."
        placeholderTextColor={theme.textSecondary}
        value={notes}
        onChangeText={onNotesChange}
        multiline={true}
        numberOfLines={2}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={onAddTask}
      >
        <Text style={styles.addButtonText}>
          {editingId !== null ? "Update" : "Add"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default TaskInput;

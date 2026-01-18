import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import styles from "../styles";

// Lottery machine time picker component
const TimePicker = ({ visible, theme, onConfirm, onCancel, initialTime }) => {
  const ITEM_HEIGHT = 50;
  const VISIBLE_ITEMS = 3;

  // Parse initial time or default to 12:00 AM
  const parseInitialTime = () => {
    if (initialTime) {
      const match = initialTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        return {
          hour: parseInt(match[1]),
          minute: parseInt(match[2]),
          period: match[3].toUpperCase(),
        };
      }
    }
    return { hour: 12, minute: 0, period: "AM" };
  };

  const initial = parseInitialTime();
  const [selectedHour, setSelectedHour] = useState(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initial.period);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);
  const periodScrollRef = useRef(null);

  const handleScroll = (event, type) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);

    if (type === "hour") {
      const hour = hours[Math.max(0, Math.min(index, hours.length - 1))];
      setSelectedHour(hour);
    } else if (type === "minute") {
      const minute = minutes[Math.max(0, Math.min(index, minutes.length - 1))];
      setSelectedMinute(minute);
    } else if (type === "period") {
      const period = periods[Math.max(0, Math.min(index, periods.length - 1))];
      setSelectedPeriod(period);
    }
  };

  const handleConfirm = () => {
    const timeString = `${selectedHour}:${selectedMinute.toString().padStart(2, "0")} ${selectedPeriod}`;
    onConfirm(timeString);
  };

  const renderPickerColumn = (data, selectedValue, type, scrollRef) => (
    <View style={[styles.pickerColumn, { backgroundColor: theme.inputBg }]}>
      {/* Selection highlight */}
      <View
        style={[
          styles.pickerHighlight,
          { backgroundColor: `${theme.primary}20`, borderColor: theme.primary },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT,
        }}
        onMomentumScrollEnd={(e) => handleScroll(e, type)}
        onScrollEndDrag={(e) => handleScroll(e, type)}
      >
        {data.map((item, index) => {
          const isSelected =
            type === "hour"
              ? item === selectedHour
              : type === "minute"
                ? item === selectedMinute
                : item === selectedPeriod;

          return (
            <TouchableOpacity
              key={index}
              style={styles.pickerItem}
              onPress={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    y: index * ITEM_HEIGHT,
                    animated: true,
                  });
                }
                if (type === "hour") setSelectedHour(item);
                else if (type === "minute") setSelectedMinute(item);
                else setSelectedPeriod(item);
              }}
            >
              <Text
                style={[
                  styles.pickerItemText,
                  { color: isSelected ? theme.primary : theme.textSecondary },
                  isSelected && styles.pickerItemSelected,
                ]}
              >
                {type === "minute" ? item.toString().padStart(2, "0") : item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.pickerOverlay}>
        <View style={[styles.pickerContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.pickerTitle, { color: theme.text }]}>
            🎰 Set Time
          </Text>

          <View style={styles.pickerWheels}>
            {/* Hour wheel */}
            <View style={styles.pickerWheelWrapper}>
              <Text
                style={[styles.pickerLabel, { color: theme.textSecondary }]}
              >
                Hour
              </Text>
              {renderPickerColumn(hours, selectedHour, "hour", hourScrollRef)}
            </View>

            <Text style={[styles.pickerSeparator, { color: theme.primary }]}>
              :
            </Text>

            {/* Minute wheel */}
            <View style={styles.pickerWheelWrapper}>
              <Text
                style={[styles.pickerLabel, { color: theme.textSecondary }]}
              >
                Min
              </Text>
              {renderPickerColumn(
                minutes,
                selectedMinute,
                "minute",
                minuteScrollRef,
              )}
            </View>

            {/* AM/PM wheel */}
            <View style={styles.pickerWheelWrapper}>
              <Text
                style={[styles.pickerLabel, { color: theme.textSecondary }]}
              ></Text>
              {renderPickerColumn(
                periods,
                selectedPeriod,
                "period",
                periodScrollRef,
              )}
            </View>
          </View>

          {/* Preview */}
          <View
            style={[styles.pickerPreview, { backgroundColor: theme.inputBg }]}
          >
            <Text style={[styles.pickerPreviewText, { color: theme.text }]}>
              ⏰ {selectedHour}:{selectedMinute.toString().padStart(2, "0")}{" "}
              {selectedPeriod}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.pickerButtons}>
            <TouchableOpacity
              style={[
                styles.pickerBtn,
                styles.pickerCancelBtn,
                { borderColor: theme.border },
              ]}
              onPress={onCancel}
            >
              <Text
                style={[styles.pickerBtnText, { color: theme.textSecondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerBtn,
                styles.pickerConfirmBtn,
                { backgroundColor: theme.primary },
              ]}
              onPress={handleConfirm}
            >
              <Text style={[styles.pickerBtnText, { color: "white" }]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DailyRoutine = ({ theme, routines, onRoutinesChange, formatTime }) => {
  const [routineName, setRoutineName] = useState("");
  const [routineTime, setRoutineTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Get today's date string for tracking completion
  const getTodayKey = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const addRoutine = () => {
    if (routineName.trim().length === 0) {
      Alert.alert("Error", "Please enter a routine name");
      return;
    }

    if (editingId !== null) {
      const updatedRoutines = routines.map((item) =>
        item.id === editingId
          ? { ...item, name: routineName, time: routineTime }
          : item,
      );
      onRoutinesChange(updatedRoutines);
      setEditingId(null);
    } else {
      const newRoutine = {
        id: Date.now().toString(),
        name: routineName,
        time: routineTime,
        completedDays: {}, // Track which days it was completed
        createdAt: new Date().toISOString(),
      };
      onRoutinesChange([...routines, newRoutine]);
    }

    setRoutineName("");
    setRoutineTime("");
  };

  const toggleRoutineComplete = (id) => {
    const todayKey = getTodayKey();
    const updatedRoutines = routines.map((item) => {
      if (item.id === id) {
        const completedDays = { ...item.completedDays };
        if (completedDays[todayKey]) {
          delete completedDays[todayKey];
        } else {
          completedDays[todayKey] = true;
        }
        return { ...item, completedDays };
      }
      return item;
    });
    onRoutinesChange(updatedRoutines);
  };

  const deleteRoutine = (id) => {
    Alert.alert(
      "Delete Routine",
      "Are you sure you want to delete this routine?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            onRoutinesChange(routines.filter((r) => r.id !== id));
          },
          style: "destructive",
        },
      ],
    );
  };

  const startEditing = (id, name, time) => {
    setEditingId(id);
    setRoutineName(name);
    setRoutineTime(time || "");
  };

  const getStreak = (routine) => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;

      if (routine.completedDays && routine.completedDays[dateKey]) {
        streak++;
      } else if (i > 0) {
        // Don't break on today if not completed yet
        break;
      }
    }
    return streak;
  };

  const isCompletedToday = (routine) => {
    const todayKey = getTodayKey();
    return routine.completedDays && routine.completedDays[todayKey];
  };

  const getCompletionStats = () => {
    const completed = routines.filter((r) => isCompletedToday(r)).length;
    return { completed, total: routines.length };
  };

  const stats = getCompletionStats();

  const renderRoutineItem = ({ item }) => {
    const completed = isCompletedToday(item);
    const streak = getStreak(item);

    return (
      <View
        style={[
          styles.routineContainer,
          { backgroundColor: theme.card, shadowColor: theme.shadow },
          completed && { borderLeftColor: theme.success, borderLeftWidth: 4 },
        ]}
      >
        <TouchableOpacity
          style={styles.routineContent}
          onPress={() => toggleRoutineComplete(item.id)}
        >
          <View
            style={[
              styles.routineCheckbox,
              { borderColor: completed ? theme.success : theme.primary },
              completed && { backgroundColor: theme.success },
            ]}
          >
            {completed && <Text style={styles.routineCheckmark}>✓</Text>}
          </View>
          <View style={styles.routineInfo}>
            <Text
              style={[
                styles.routineName,
                { color: theme.text },
                completed && {
                  textDecorationLine: "line-through",
                  color: theme.textSecondary,
                },
              ]}
            >
              {item.name}
            </Text>
            <View style={styles.routineMeta}>
              {item.time && (
                <Text
                  style={[styles.routineTime, { color: theme.textSecondary }]}
                >
                  ⏰ {item.time}
                </Text>
              )}
              {streak > 0 && (
                <View
                  style={[
                    styles.streakBadge,
                    { backgroundColor: `${theme.warning}30` },
                  ]}
                >
                  <Text style={[styles.streakText, { color: theme.warning }]}>
                    🔥 {streak} day{streak > 1 ? "s" : ""} streak
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.routineActions}>
          <TouchableOpacity
            style={[
              styles.routineActionBtn,
              { backgroundColor: theme.warning },
            ]}
            onPress={() => startEditing(item.id, item.name, item.time)}
          >
            <Text style={styles.routineActionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.routineActionBtn, { backgroundColor: theme.danger }]}
            onPress={() => deleteRoutine(item.id)}
          >
            <Text style={styles.routineActionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.routineWrapper}>
      {/* Stats Header */}
      <View style={[styles.routineStats, { backgroundColor: theme.card }]}>
        <Text style={[styles.routineStatsText, { color: theme.text }]}>
          Today's Progress: {stats.completed}/{stats.total} completed
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.success,
                width:
                  stats.total > 0
                    ? `${(stats.completed / stats.total) * 100}%`
                    : "0%",
              },
            ]}
          />
        </View>
      </View>

      {/* Add Routine Input */}
      <View
        style={[styles.routineInputContainer, { backgroundColor: theme.card }]}
      >
        <TextInput
          style={[
            styles.routineInput,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Add a daily routine..."
          placeholderTextColor={theme.textSecondary}
          value={routineName}
          onChangeText={setRoutineName}
        />
        <TouchableOpacity
          style={[
            styles.routineTimeButton,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text
            style={[
              styles.routineTimeButtonText,
              { color: routineTime ? theme.text : theme.textSecondary },
            ]}
          >
            {routineTime || "🎰 Tap to set time"}
          </Text>
          {routineTime && (
            <TouchableOpacity
              onPress={() => setRoutineTime("")}
              style={styles.clearTimeBtn}
            >
              <Text style={{ color: theme.danger, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.routineAddBtn, { backgroundColor: theme.primary }]}
          onPress={addRoutine}
        >
          <Text style={styles.routineAddBtnText}>
            {editingId ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <TimePicker
        visible={showTimePicker}
        theme={theme}
        initialTime={routineTime}
        onConfirm={(time) => {
          setRoutineTime(time);
          setShowTimePicker(false);
        }}
        onCancel={() => setShowTimePicker(false)}
      />

      {/* Routine List */}
      {routines.length === 0 ? (
        <View style={styles.routineEmpty}>
          <Text style={[styles.routineEmptyIcon]}>🔄</Text>
          <Text style={[styles.routineEmptyText, { color: theme.text }]}>
            No daily routines yet
          </Text>
          <Text
            style={[styles.routineEmptySubtext, { color: theme.textSecondary }]}
          >
            Add routines to track your daily habits
          </Text>
        </View>
      ) : (
        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={(item) => item.id}
          style={styles.routineList}
          contentContainerStyle={styles.routineListContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default DailyRoutine;

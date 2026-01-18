import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerContent: {
    marginTop: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  themeToggle: {
    position: "absolute",
    right: 20,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  themeToggleText: {
    fontSize: 20,
  },
  taskInputContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 15,
    elevation: 3,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 14,
  },
  addButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  taskList: {
    flex: 1,
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskContainer: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  taskTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-45deg" }],
    marginBottom: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
  },
  taskMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 12,
  },
  // In your styles.js:
  deadlineContainer: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  notesInput: {
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  notesContainer: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  notesToggle: {
    fontSize: 12,
  },
  notesText: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
  },
  // NavBar styles
  navBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  navTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  navTabActive: {
    elevation: 2,
  },
  navTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  navTabTextActive: {
    fontWeight: "bold",
  },
  // Daily Routine styles
  routineWrapper: {
    flex: 1,
  },
  routineStats: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
  },
  routineStatsText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  routineInputContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
  },
  routineInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  routineTimeInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  routineAddBtn: {
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  routineAddBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  routineList: {
    flex: 1,
    marginHorizontal: 20,
  },
  routineListContent: {
    paddingBottom: 20,
  },
  routineContainer: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  routineCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  routineCheckmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  routineMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  routineTime: {
    fontSize: 13,
  },
  streakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  streakText: {
    fontSize: 12,
    fontWeight: "600",
  },
  routineActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
  routineActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  routineActionText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  routineEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  routineEmptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  routineEmptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  routineEmptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  // Lottery machine time picker styles
  routineTimeButton: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routineTimeButtonText: {
    fontSize: 16,
  },
  clearTimeBtn: {
    padding: 5,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "85%",
    maxWidth: 360,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerWheels: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerWheelWrapper: {
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  pickerColumn: {
    height: 150,
    width: 70,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  pickerHighlight: {
    position: "absolute",
    top: 50,
    left: 4,
    right: 4,
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    zIndex: 1,
    pointerEvents: "none",
  },
  pickerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 24,
    fontWeight: "500",
  },
  pickerItemSelected: {
    fontSize: 28,
    fontWeight: "bold",
  },
  pickerSeparator: {
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginTop: 25,
  },
  pickerPreview: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  pickerPreviewText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  pickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  pickerBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerCancelBtn: {
    borderWidth: 1,
  },
  pickerConfirmBtn: {},
  pickerBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

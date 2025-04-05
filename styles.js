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
});

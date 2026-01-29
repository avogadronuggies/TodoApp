# 📋 TaskTrack

A feature-rich task management mobile application built with React Native and Expo that helps users organize their tasks, track daily routines, and stay productive with smart notifications and theme options.

## ✨ Features

### 📝 Task Management

- **Create, edit, and delete tasks** with ease
- **Add notes** to tasks for additional context (collapsible section)
- **Deadline tracking** with visual indicators for urgency
- **Auto-grouping** of tasks by deadline:
  - 🔴 Overdue
  - 📅 Today
  - 📆 Tomorrow
  - 📊 This Week
  - 🗓️ Later
  - ⏳ No Deadline

### 🔄 Daily Routine Tracker

- **Create daily habits** to track every day
- **🎰 Lottery machine time picker** - fun slot-machine style time selector
- **Streak tracking** - see your consecutive completion days with 🔥 badges
- **Progress bar** showing daily completion rate
- **Edit and delete** routines anytime

### 🔔 Smart Notifications

Receive intelligent reminders as deadlines approach:

- 1 day before deadline
- 1 hour before deadline
- 15 minutes before deadline
- At deadline time

### 🎨 Theme Support

- **Light & Dark mode** toggle
- Smooth animated theme transitions
- Persistent theme preference

### 💾 Persistent Storage

- Tasks, routines, and preferences saved between sessions
- Automatic data loading on app start

## 📱 Screenshots

_Coming soon_

## 🛠️ Technologies

- **React Native** - Cross-platform mobile framework
- **Expo SDK 52** - Development platform
- **AsyncStorage** - Local data persistence
- **Expo Notifications** - Push notification reminders
- **React Native DateTimePicker** - Date/time selection
- **SectionList** - Grouped task display

## 📦 Installation

### Prerequisites

- Node.js and npm installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- Android Studio or Xcode for emulation (optional)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/avogadronuggies/TaskTrack.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd TaskTrack
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npx expo start
   ```

5. **Run on a device or emulator:**
   - Scan QR code with Expo Go app on your device
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 📖 Usage

### Adding a Task

1. Enter task description in the input field
2. Add optional notes for extra details
3. Set a deadline using the date/time picker (optional)
4. Press **"Add"** button

### Managing Tasks

| Action             | How To                                       |
| ------------------ | -------------------------------------------- |
| ✅ Complete a Task | Tap on a task to mark as complete/incomplete |
| ✏️ Edit a Task     | Press "Edit" to modify task details          |
| ⏰ Edit Timer Only | Press "Timer" to change just the deadline    |
| ❌ Clear Deadline  | Press "Clear" to remove deadline             |
| 🗑️ Delete a Task   | Press "Delete" to remove the task            |
| 📝 View Notes      | Tap "Notes ▼" to expand/collapse             |

### Daily Routines

1. Navigate to the **"🔄 Daily Routine"** tab
2. Enter routine name (e.g., "Morning Exercise")
3. Tap **"🎰 Tap to set time"** to open the lottery machine time picker
4. Scroll the wheels to select hour, minute, and AM/PM
5. Press **"Confirm"** to set the time
6. Press **"Add"** to create the routine
7. Tap a routine to mark it complete for today
8. Watch your streak grow! 🔥

### Changing Themes

Toggle between light and dark mode by pressing the **☀️/🌙** button in the header.

## 📁 Project Structure

```
TaskTrack/
├── App.js                 # Main application component
├── index.js               # Entry point
├── styles.js              # All StyleSheet definitions
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── assets/                # App icons and images
└── components/
    ├── index.js           # Barrel exports
    ├── AppLogo.js         # App logo component
    ├── Header.js          # Header with theme toggle
    ├── NavBar.js          # Tab navigation
    ├── TaskInput.js       # Task creation form
    ├── TaskItem.js        # Individual task card
    ├── EmptyState.js      # Empty list placeholder
    ├── DailyRoutine.js    # Habit tracker with time picker
    ├── NotificationService.js  # Notification handling
    └── themes.js          # Light/dark theme colors
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community
- Expo team
- All open-source contributors

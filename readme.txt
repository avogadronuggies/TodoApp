Task Management App
A feature-rich task management mobile application built with React Native and Expo that helps users organize their tasks with deadlines, notifications, and theme options.
Features

Task Management: Create, edit, and delete tasks
Deadline Tracking: Set deadlines for tasks with visual indicators for urgency
Smart Notifications: Receive timed reminders as deadlines approach
Theme Support: Toggle between light and dark mode
Persistent Storage: Tasks and preferences are saved between sessions

Screenshots
Show Image
Technologies

React Native
Expo
AsyncStorage for data persistence
Expo Notifications for reminders
React Native DateTimePicker

Installation
Prerequisites

Node.js and npm installed
Expo CLI installed globally
Android Studio or Xcode for emulation (optional)

Steps

Clone the repository:
Copygit clone https://github.com/yourusername/task-management-app.git

Navigate to the project directory:
Copycd task-management-app

Install dependencies:
Copynpm install

Start the development server:
Copynpx expo start

Run on a device or emulator:

Scan QR code with Expo Go app on your device
Press 'a' for Android emulator
Press 'i' for iOS simulator



Usage
Adding a Task

Enter task description in the input field
Set a deadline (optional)
Press "Add" button

Managing Tasks

Complete a Task: Tap on a task to mark it as complete/incomplete
Edit a Task: Press the "Edit" button to modify task details
Delete a Task: Press the "Delete" button to remove a task

Notifications
The app provides timely reminders as task deadlines approach:

Due in 12 hours
Due in 8 hours
Due in 4 hours
Due in 2 hours
Due in 1 hour
Due in 30 minutes
Due in 15 minutes
Due now

Changing Themes
Toggle between light and dark mode by pressing the theme button in the header.




Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

React Native community
Expo team
All open-source contributors
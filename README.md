<img width="1080" height="2204" alt="Screenshot_20260515_221646_healthapp" src="https://github.com/user-attachments/assets/2b4e4cad-b9fd-4b21-8197-2f6061d4fa10" />
# 🏥 VITALS - Health Monitoring App

A comprehensive, cross-platform mobile application built with React Native and Expo to help users monitor their health vitals, manage medical records, and schedule appointments.

## ✨ Features

Based on the current architecture, the app supports the following modules:
- **🔐 Authentication & Onboarding:** Secure login, user registration, and a welcoming getting-started flow.
- **📊 Interactive Dashboard:** A central hub to monitor daily health metrics and vitals at a glance.
- **📂 Medical Records Management:** Store and view past medical history and records securely.
- **📅 Appointments Scheduling:** Keep track of upcoming doctor visits and schedule new appointments.
- **📈 Health Reports:** Detailed visualizations and charts to track health progress over time.
- **💬 Messaging:** Built-in communication tools to stay connected with healthcare providers.
- **🔔 Notifications:** Timely alerts for appointments, medication, and health updates.
- **⚙️ Profile & Settings:** Manage personal information, preferences, and app configurations.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 54)
- **Language:** [TypeScript](https://www.typescriptlang.org/) for robust, type-safe code.
- **Navigation:** [React Navigation](https://reactnavigation.org/) (Native Stack & Bottom Tabs).
- **State Management:** React Context API (`UserContext`).
- **UI Components & Visuals:** 
  - `lucide-react-native` (Icons)
  - `react-native-chart-kit` & `react-native-svg` (Data Visualization)
  - `@react-native-community/datetimepicker` (Date/Time Selection)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sanskar325/VITALS---A-HEALTH-MONITORING-APP.git
   cd healthapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:
```bash
npx expo start
```

Once the server is running, you can:
- Press **`a`** to open the app on an Android Emulator.
- Press **`i`** to open the app on an iOS Simulator (Requires Mac).
- Scan the **QR code** in your terminal using the **Expo Go** app on your physical iOS or Android device.

## 📂 Project Structure

```text
healthapp/
├── assets/                 # Images, fonts, and splash screens
├── src/
│   ├── context/            # Global state management (UserContext)
│   ├── navigation/         # App routing (AppNavigator)
│   ├── screens/            # UI Screens (Dashboard, Login, Reports, etc.)
│   └── types/              # TypeScript type definitions
├── App.tsx                 # Main application entry point
├── app.json                # Expo configuration file
└── package.json            # Project dependencies and scripts
```

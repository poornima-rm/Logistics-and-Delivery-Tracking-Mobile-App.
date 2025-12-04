
# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.


# Logistics & Delivery Tracking App (React Native CLI)

A role-based mobile logistics application built using **React Native CLI**, supporting **Customer**, **Driver**, and **Admin** workflows.  
All backend functionality is powered by **mock APIs and static JSON data**.

This project demonstrates mobile UI development, navigation flows, state management with Redux Toolkit, order lifecycle handling, and separation of logic across multiple user roles.

---

## 🚀 Features

### 🔐 Authentication (Mock)
- Login, Signup
- OTP Verification (mocked)
- Forgot Password flow (mock)
- Role-based authentication (Customer / Driver / Admin)
- Session persistence using AsyncStorage

### 👤 Customer Features
- Home Dashboard (Pending, In Transit, Delivered)
- Create Delivery Order
- Shipping address form
- Delivery type selection (Standard/Express/Same-Day)
- Payment mock simulation (Card/UPI/COD)
- Order success/failure screens
- Order Tracking with Status Timeline
- Proof of Delivery preview
- Delivery History
- orders screen with filters (All, Placed, Shipped, Delivered)
- Profile Page

### 🚚 Driver Features
- View assigned deliveries
- Accept/Start/Update delivery status
- Upload Proof of Delivery image (camera/gallery)
- Delivery History
- Profile Page

### 🛠️ Admin Features
- View all orders system-wide
- Assign orders to drivers
- Change order status
- Delete/remove orders
- Monitor delivery metrics (simple dashboard)
- Profile Page

### 🔔 Notifications (Mock)
- New delivery assigned (Driver)
- Status updated (Customer)
- Pending delivery reminder

---

## 📂 Project Structure

src/
api/ # Mock API modules
data/ # JSON files (orders, users, drivers)
store/ # Redux Toolkit slices
navigation/ # Stack + Tab navigators
components/ # Shared reusable UI components
screens/
auth/ # Login, Signup, OTP, Forgot Password
customer/ # Customer Flow Screens
driver/ # Driver Flow Screens
admin/ # Admin Flow Screens
utils/ # Helpers (formatters, validators)
constants/ # Role constants, status constants


---

## 🛠️ Tech Stack

- **React Native CLI**
- **React Navigation**
- **Redux Toolkit**
- **AsyncStorage**
- **React Native Image Picker**
- **Mock API (local JS/JSON)**

---

## ▶️ Getting Started

### 1. Install Dependencies
npm install


### 2. Install Pods (iOS only)
cd ios
pod install
cd ..

### 3. Start Metro Bundler
npx react-native start

### 4. Run on Android
npx react-native run-android

(or iOS)
npx react-native run-ios
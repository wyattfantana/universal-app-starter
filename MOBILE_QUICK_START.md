# 📱 Mobile Quick Start

**5-minute guide to get your iOS or Android app running.**

---

## iOS (Requires macOS)

### 1. Prerequisites
```bash
# Install Xcode from App Store

# Install Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Add iOS Rust targets
rustup target add aarch64-apple-ios aarch64-apple-ios-sim
```

### 2. Initialize Project
```bash
cd apps/desktop
npm run ios:init
```

### 3. Configure Signing
```bash
# Open in Xcode
open ios/QuoteMaster.xcworkspace

# In Xcode:
# - Select project → Signing & Capabilities
# - Choose your Development Team
# - Select Bundle Identifier
```

### 4. Run
```bash
npm run ios:dev
# Select iPhone simulator when prompted
```

**Done!** App opens in iOS Simulator.

---

## Android (macOS/Linux/Windows)

### 1. Prerequisites
```bash
# Download Android Studio
# https://developer.android.com/studio

# Install SDK (API 33+), NDK, build tools

# Set environment variables
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Add Android Rust targets
rustup target add aarch64-linux-android armv7-linux-androideabi
```

### 2. Initialize Project
```bash
cd apps/desktop
npm run android:init
```

### 3. Create Emulator
```bash
# In Android Studio:
# Tools → Device Manager → Create Device
# Choose: Pixel 6, API 33+
```

### 4. Run
```bash
npm run android:dev
# Emulator launches automatically
```

**Done!** App opens in Android Emulator.

---

## 🔧 Common Issues

### iOS: "No code signing identities found"
- Open Xcode
- Preferences → Accounts → Add Apple ID
- Select project → Signing & Capabilities → Team

### Android: "SDK not found"
Create `apps/desktop/android/local.properties`:
```
sdk.dir=/path/to/Android/sdk
```

### Both: API connection fails
Update `apps/desktop/.env`:
```bash
# iOS Simulator
VITE_API_URL=http://localhost:3000

# Android Emulator
VITE_API_URL=http://10.0.2.2:3000

# Physical Device (use your computer's IP)
VITE_API_URL=http://192.168.1.100:3000
```

---

## 📚 Full Documentation

See [MOBILE_SETUP.md](./MOBILE_SETUP.md) for:
- Complete prerequisites
- Physical device setup
- Debugging guide
- Production builds
- App Store deployment

---

## 🎯 Commands Summary

```bash
# iOS
npm run mobile:ios:init       # One-time setup
npm run mobile:ios:dev        # Run simulator
npm run mobile:ios:build      # Build release

# Android
npm run mobile:android:init   # One-time setup
npm run mobile:android:dev    # Run emulator
npm run mobile:android:build  # Build APK
```

That's it! Your React code now runs on mobile. 🚀

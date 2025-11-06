# Mobile Development Setup

This template supports iOS and Android via Tauri Mobile.

## Prerequisites

### iOS Development
- macOS 12+ (Monterey or later)
- Xcode 14+
- Xcode Command Line Tools
- iOS Simulator or physical device

### Android Development
- Android Studio with SDK
- API Level 24+ (Android 7.0)
- Android emulator or physical device

## iOS Setup

### 1. Install Xcode

Download from Mac App Store or:
```bash
xcode-select --install
```

### 2. Install Rust targets

```bash
rustup target add aarch64-apple-ios aarch64-apple-ios-sim
```

### 3. Initialize iOS project

```bash
cd apps/desktop
npm run tauri ios init
```

### 4. Run in simulator

```bash
npm run tauri ios dev
```

## Android Setup

### 1. Install Android Studio

Download from: https://developer.android.com/studio

### 2. Install SDK and NDK

In Android Studio:
- SDK Platform: API 24+
- Android NDK
- Android SDK Command-line Tools

### 3. Set environment variables

Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/$(ls -1 $ANDROID_HOME/ndk)
```

### 4. Install Rust targets

```bash
rustup target add \
  aarch64-linux-android \
  armv7-linux-androideabi \
  i686-linux-android \
  x86_64-linux-android
```

### 5. Initialize Android project

```bash
cd apps/desktop
npm run tauri android init
```

### 6. Run in emulator

```bash
npm run tauri android dev
```

## Troubleshooting

### iOS: Code signing errors
- Open project in Xcode: `apps/desktop/gen/apple/YourApp.xcodeproj`
- Select your development team in Signing & Capabilities

### Android: Gradle errors
```bash
cd apps/desktop/gen/android
./gradlew clean
```

### Both: Rust compilation errors
```bash
cargo clean
rustup update
```

## Building for Release

### iOS
```bash
npm run tauri ios build
```
Output: `apps/desktop/gen/apple/build/`

### Android
```bash
npm run tauri android build
```
Output: `apps/desktop/gen/android/app/build/outputs/apk/`

---

See [README.md](./README.md) for more details.

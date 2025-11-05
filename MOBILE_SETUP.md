# 📱 QuoteMaster Mobile Setup Guide

Your Tauri app now supports **iOS and Android** using the same React codebase as the desktop app!

## 🎯 Architecture

```
apps/desktop/
├── src/                  # React code (runs on ALL platforms)
├── src-tauri/            # Rust backend (desktop + mobile)
├── ios/                  # iOS project (auto-generated)
└── android/              # Android project (auto-generated)
```

**One codebase → Windows, macOS, Linux, iOS, Android!**

---

## 📋 Prerequisites

### For iOS Development

**Required:**
- macOS (iOS development only works on Mac)
- Xcode 14+ (from Mac App Store)
- Xcode Command Line Tools
- CocoaPods (for dependencies)

**Install Command Line Tools:**
```bash
xcode-select --install
```

**Install CocoaPods:**
```bash
sudo gem install cocoapods
```

### For Android Development

**Required (Works on Windows, macOS, Linux):**
- Android Studio
- Android SDK (API level 24+)
- Java Development Kit (JDK) 17+
- Android NDK (r25 or newer)

**Install Android Studio:**
- Download from: https://developer.android.com/studio
- Install SDK Tools, NDK, and build tools

**Set Environment Variables:**
```bash
# Add to ~/.bashrc, ~/.zshrc, or equivalent
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/<version>
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

### For Both Platforms

**Rust Mobile Targets:**
```bash
# iOS targets
rustup target add aarch64-apple-ios
rustup target add aarch64-apple-ios-sim
rustup target add x86_64-apple-ios

# Android targets
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android
```

---

## 🚀 Quick Start

### iOS Setup

#### 1. Initialize iOS Project

```bash
cd apps/desktop
npm run ios:init
```

This creates the `ios/` directory with your Xcode project.

#### 2. Open in Xcode

```bash
open ios/QuoteMaster.xcworkspace
```

**Configure in Xcode:**
- Select a **Development Team** (Signing & Capabilities)
- Choose your **Bundle Identifier** (default: com.dwdec.quotemaster)
- Select a **deployment target** (iOS 13.0+)

#### 3. Run on Simulator

```bash
npm run ios:dev
```

Or from the root:
```bash
npm run mobile:ios:dev
```

**Select a simulator** when prompted (e.g., iPhone 15 Pro).

#### 4. Run on Physical Device

1. Connect iPhone via USB
2. Trust the device
3. Select your device in Xcode
4. Run: `npm run ios:dev`

**First time:** You may need to trust the developer certificate on the device (Settings → General → Device Management).

#### 5. Build for Release

```bash
npm run ios:build --release
```

App will be in `src-tauri/gen/apple/build/arm64/`.

---

### Android Setup

#### 1. Initialize Android Project

```bash
cd apps/desktop
npm run android:init
```

This creates the `android/` directory with your Android Studio project.

#### 2. Open in Android Studio

```bash
open -a "Android Studio" android/
# Or on Linux/Windows, open Android Studio and select the android/ folder
```

**Configure in Android Studio:**
- Let Gradle sync complete
- Check SDK versions match (minSdk 24)
- Set up emulator or physical device

#### 3. Run on Emulator

**Create an emulator first:**
```bash
# Open Android Studio → Device Manager → Create Virtual Device
# Choose Pixel 6 or similar with API 33+
```

**Run the app:**
```bash
npm run android:dev
```

Or from the root:
```bash
npm run mobile:android:dev
```

#### 4. Run on Physical Device

1. Enable **Developer Options** on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. Connect device via USB
4. Authorize the computer on the device
5. Run: `npm run android:dev`

#### 5. Build for Release

```bash
npm run android:build --release
```

**Signing Required:** For production, you'll need to:
1. Generate a keystore
2. Configure signing in `android/app/build.gradle`
3. Build with `--release`

APK will be in `src-tauri/gen/android/app/build/outputs/apk/`.

---

## 📱 Development Workflow

### Hot Reload

Mobile apps support hot reload just like desktop:
1. Run `npm run ios:dev` or `npm run android:dev`
2. Edit React code in `src/`
3. Changes appear instantly in the simulator/device

### Debugging

#### iOS Debugging:
- **Console logs:** Xcode → Debug Area (Cmd+Shift+Y)
- **Safari DevTools:** Safari → Develop → [Device] → [App]

#### Android Debugging:
- **Console logs:** `adb logcat | grep RustStdoutStderr`
- **Chrome DevTools:** chrome://inspect

### API Connection

Mobile apps connect to your web API just like desktop:

```typescript
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**For local development:**
- iOS Simulator: Use `http://localhost:3000`
- Android Emulator: Use `http://10.0.2.2:3000` (special address for host machine)
- Physical Device: Use your computer's IP (e.g., `http://192.168.1.100:3000`)

Set in `.env`:
```bash
VITE_API_URL=http://192.168.1.100:3000
```

---

## 🔧 Configuration

### App Icons

Replace icons in `apps/desktop/src-tauri/icons/`:
- iOS: Provide all sizes (32x32, 128x128, etc.)
- Android: Tauri auto-generates from source icon

### App Permissions

Edit `src-tauri/tauri.conf.json`:

```json
{
  "plugins": {
    "http": {
      "scope": ["https://api.yourdomain.com/*"]
    }
  },
  "app": {
    "security": {
      "csp": "default-src 'self'; connect-src 'self' https://api.yourdomain.com"
    }
  }
}
```

### iOS Info.plist

After running `ios:init`, edit `ios/QuoteMaster/QuoteMaster_iOS/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>QuoteMaster needs camera access to scan invoices</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>QuoteMaster needs photo access to attach images</string>
```

### Android Permissions

After running `android:init`, edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

---

## 📦 Building for Production

### iOS App Store

1. **Archive in Xcode:**
   - Product → Archive
   - Organizer → Distribute App
   - Choose App Store Connect

2. **Requirements:**
   - Apple Developer Account ($99/year)
   - App Store listing
   - Screenshots and metadata

### Google Play Store

1. **Generate signed APK/AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **Upload to Play Console:**
   - Create app listing
   - Upload AAB file
   - Set up store listing

3. **Requirements:**
   - Google Play Developer Account ($25 one-time)
   - Privacy policy
   - App content rating

---

## 🎨 Mobile-Specific UI Considerations

Your shared components from `@repo/ui` work on mobile, but consider:

### Touch Targets
Make buttons larger (min 44x44 pixels):
```tsx
<Button size="lg" className="min-h-[44px]">Tap Me</Button>
```

### Safe Areas
Handle notches/home indicators:
```css
/* In your global CSS */
@supports (padding: max(0px)) {
  .safe-top {
    padding-top: max(20px, env(safe-area-inset-top));
  }
}
```

### Responsive Layout
Test on different screen sizes:
- iPhone SE (small)
- iPhone 15 Pro (medium)
- iPhone 15 Pro Max (large)
- Android tablets

### Platform Detection
```typescript
import { platform } from '@tauri-apps/plugin-os';

const currentPlatform = platform();
// Returns: 'ios', 'android', 'macos', 'windows', 'linux'
```

---

## 🧪 Testing

### Unit Tests
Same as desktop - run from root:
```bash
npm test
```

### Device Testing Matrix

**iOS:**
- iPhone SE (small screen)
- iPhone 15 Pro (standard)
- iPad Pro (tablet)

**Android:**
- Pixel 4a (small)
- Pixel 6 (medium)
- Samsung Galaxy Tab (tablet)

---

## ⚡ Performance Tips

1. **Optimize Images:** Use WebP format
2. **Lazy Load:** Load data on demand
3. **Cache API Calls:** Use TanStack Query (already installed)
4. **Minimize Bundle Size:** Keep JavaScript minimal
5. **Test on Real Devices:** Simulators are faster than reality

---

## 🐛 Troubleshooting

### iOS: "Failed to launch app"
```bash
# Clean Xcode build
cd ios
xcodebuild clean
rm -rf DerivedData

# Rebuild
npm run ios:dev
```

### Android: "SDK location not found"
Create `android/local.properties`:
```properties
sdk.dir=/Users/yourname/Library/Android/sdk
ndk.dir=/Users/yourname/Library/Android/sdk/ndk/<version>
```

### Both: "Rust compilation failed"
```bash
# Update Rust
rustup update

# Verify targets installed
rustup target list --installed

# Add missing targets
rustup target add aarch64-apple-ios aarch64-linux-android
```

### Mobile app can't reach API
**iOS Simulator:**
- Use `localhost` or `127.0.0.1`

**Android Emulator:**
- Use `10.0.2.2` instead of `localhost`

**Physical Devices:**
- Use your computer's LAN IP (find with `ipconfig`/`ifconfig`)
- Ensure firewall allows connections

---

## 📚 Key Commands Reference

### iOS
```bash
# From root
npm run mobile:ios:init      # One-time setup
npm run mobile:ios:dev       # Run in simulator
npm run mobile:ios:build     # Build release

# From apps/desktop
npm run ios:init
npm run ios:dev
npm run ios:build
```

### Android
```bash
# From root
npm run mobile:android:init  # One-time setup
npm run mobile:android:dev   # Run in emulator
npm run mobile:android:build # Build release

# From apps/desktop
npm run android:init
npm run android:dev
npm run android:build
```

---

## 🎯 Next Steps

1. **Run `mobile:ios:init`** or **`mobile:android:init`**
2. **Configure signing** in Xcode/Android Studio
3. **Test on simulator/emulator**
4. **Connect to your API** (update VITE_API_URL)
5. **Test on physical device**
6. **Optimize for mobile UX**

---

## 🤝 Need Help?

- **Tauri Mobile Docs:** https://tauri.app/v2/guides/distribute/mobile/
- **iOS Setup:** https://tauri.app/v2/guides/distribute/ios/
- **Android Setup:** https://tauri.app/v2/guides/distribute/android/

Your mobile apps are ready to build! 🚀

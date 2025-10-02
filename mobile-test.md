# 📱 Mobile Layout Testing Guide (Chrome)

This guide walks you through verifying mobile responsiveness for the Shunt app using Chrome DevTools.

---

## Quick Steps

1. **Open DevTools**
   - `Cmd + Option + I` (Mac) or `F12` / `Ctrl + Shift + I` (Windows)

2. **Toggle Device Toolbar**
   - Click the mobile/tablet icon in the top-left
   - OR press `Cmd + Shift + M` (Mac) / `Ctrl + Shift + M` (Win)

3. **Choose a Device**
   - Use the dropdown for popular presets like:
     - iPhone SE / 13 / 14
     - Pixel 5
     - iPad
     - Galaxy Fold
   - Or enter a custom size (e.g. `375x667`, `390x844`, `768x1024`)

4. **Rotate the View**
   - Use the rotate icon next to the dimensions to toggle landscape.

5. **Simulate Performance**
   - Use the "No throttling" dropdown to test 3G, Slow 4G, etc.
   - Watch how layout and images respond on slower connections.

6. **Check Touch & Tap Behavior**
   - Interactions behave like a mobile screen (tap, scroll, dropdowns, etc.)

7. **Toggle Tools**
   - Click the three-dot menu in DevTools → "More tools" → enable:
     - **Rendering** (to test prefers-color-scheme, motion)
     - **Network conditions**
     - **Accessibility**

8. **(Optional) Lighthouse Audit**
   - If available: `More Tools` → Lighthouse
   - Run for "Mobile" profile to check:
     - Performance
     - Accessibility
     - SEO

---

## Recommended Breakpoints to Test

| Device        | Width × Height |
|---------------|----------------|
| iPhone SE     | 375×667        |
| iPhone 14     | 390×844        |
| iPad (Portrait) | 768×1024     |
| iPad (Landscape) | 1024×768    |
| Desktop       | ≥1280          |

---

## Tips

- Pin your favorite devices in the dropdown
- Check button tap areas (minimum 48x48px)
- Test in dark mode and light mode (`prefers-color-scheme`)
- Resize manually for edge breakpoints and fluid layouts
- Install [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) to inspect component state and props in DevTools

---

## Android-Specific Testing (Bonus)

If you're targeting Android users or want to verify behavior on actual Android devices:

### Option 1: Test on Real Android Device via USB

1. Enable **Developer Mode** and **USB Debugging** on your Android phone.
2. Connect your phone to your machine via USB.
3. Open `chrome://inspect` in Chrome on your desktop.
4. You'll see your device and open tabs — click "inspect" to debug remotely.
   - This uses the actual screen size, touch input, and hardware.

More details: [Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debug/)

---

### Option 2: Android Emulator (via Android Studio)

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Launch an emulator for the device you want (e.g. Pixel 6, Fold, etc.)
3. Open Chrome inside the emulator, go to your app, and test interactively.
   - Great for simulating foldables and edge-case screen sizes.

---

These methods are great complements to Chrome’s Device Toolbar when you want to validate on real Android behaviors, hardware keyboard popups, or performance quirks.

---

## iOS-Specific Testing

To test on real iPhones or simulate Safari behavior:

### 📱 Option 1: Use Safari’s Responsive Design Mode (Mac only)

1. Open Safari → Preferences → Advanced → Enable **"Show Develop menu in menu bar"**
2. Go to `Develop` menu → **"Enter Responsive Design Mode"**
3. Choose from iPhone models, iPads, etc.
4. You can simulate orientation, throttled networks, and different user agents.

Great for testing Safari quirks, fixed elements, and scroll behavior.

---

### Option 2: Test on Real iOS Device via USB

1. Connect your iPhone/iPad via USB to your Mac.
2. Open Safari → `Develop` → select your device
3. Click the page under your device to inspect it live from your Mac

This is the best way to test actual Safari touch behavior, hardware keyboard overlays, and viewport-safe areas.

More: [Debug Web Content on iOS](https://developer.apple.com/safari/resources/)

---

## Cross-Browser Testing Tips

Even if Chrome is your main dev browser, it's worth validating on:

| Browser | Reason to Test                      |
|---------|-------------------------------------|
| **Safari** | Real-world iOS usage, flexbox quirks |
| **Firefox** | Rendering differences, scrollbar behavior |
| **Edge** | Chromium-based but adds tracking prevention, DNS features |
| **Brave** / **DuckDuckGo** | Privacy-focused, JS blocking edge cases |

Use tools like:

- [BrowserStack](https://www.browserstack.com/)

- [LambdaTest](https://www.lambdatest.com/)

- [Playwright](https://playwright.dev/) for automated cross-browser runs

Or open local builds manually in different browsers to verify layout, fonts, scrolling, and interactive components.
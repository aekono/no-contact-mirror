# Release Checklist

## Pre-Build Preparation

### Configuration
- [ ] **app.json**: Verify name, version, bundle IDs, and permissions
- [ ] **Package.json**: Check version consistency
- [ ] **TypeScript**: Run `npx tsc --noEmit` - no errors
- [ ] **ESLint**: Run `npx eslint src --ext .ts,.tsx` - no errors
- [ ] **Dependencies**: Run `npm audit` - no critical vulnerabilities

### Assets
- [ ] **App icon**: 1024x1024 PNG (./assets/icon.png)
- [ ] **Adaptive icon**: 1024x1024 PNG (./assets/adaptive-icon.png)
- [ ] **Splash screen**: 1284x2778 PNG (./assets/splash-icon.png)
- [ ] **Favicon**: 48x48 PNG (./assets/favicon.png)
- [ ] **All assets**: Optimized and properly sized

### Code Quality
- [ ] **Console logs**: Removed from production code
- [ ] **Dead code**: Removed unused imports and variables
- [ ] **Error handling**: All async operations have proper error handling
- [ ] **Accessibility**: All interactive elements have proper labels

## Build Process

### Development Build
- [ ] **Expo CLI**: `npx expo install --fix` to ensure compatibility
- [ ] **EAS Build**: `eas build --platform ios --profile development`
- [ ] **EAS Build**: `eas build --platform android --profile development`
- [ ] **Build logs**: Review for any warnings or errors

### Production Build
- [ ] **Version bump**: Update version in app.json and package.json
- [ ] **EAS Build**: `eas build --platform ios --profile production`
- [ ] **EAS Build**: `eas build --platform android --profile production`
- [ ] **Build artifacts**: Verify APK/IPA files are generated

## Device Testing

### iOS Testing
- [ ] **iPhone 15 Pro**: Test all screens and interactions
- [ ] **iPhone SE**: Test on smaller screen
- [ ] **iPad**: Test tablet layout (if supported)
- [ ] **iOS 17+**: Test on latest iOS version
- [ ] **Accessibility**: Test with VoiceOver enabled

### Android Testing
- [ ] **Pixel 8**: Test all screens and interactions
- [ ] **Samsung Galaxy**: Test on different manufacturer
- [ ] **Android 14+**: Test on latest Android version
- [ ] **Accessibility**: Test with TalkBack enabled

### Core Functionality
- [ ] **App launch**: Smooth startup and splash screen
- [ ] **Navigation**: All screens accessible and back button works
- [ ] **Check-in flow**: Complete mood selection and note entry
- [ ] **History**: View past check-ins and scroll performance
- [ ] **Analytics**: Chart renders correctly with data
- [ ] **Settings**: All toggles and options work
- [ ] **Feedback**: Email and debug report functionality
- [ ] **Notifications**: Daily reminders (if enabled)

### Edge Cases
- [ ] **Empty state**: App behavior with no data
- [ ] **Large datasets**: Performance with many check-ins
- [ ] **Network offline**: App works without internet
- [ ] **Background/foreground**: App state preservation
- [ ] **Memory usage**: No memory leaks during extended use

## Store Preparation

### App Store (iOS)
- [ ] **App name**: "No-Contact" (matches app.json)
- [ ] **Description**: 4000 character limit, compelling copy
- [ ] **Keywords**: Relevant search terms
- [ ] **Screenshots**: Required sizes for all device types
- [ ] **App icon**: 1024x1024 PNG
- [ ] **Privacy policy**: Link to docs/privacy.md
- [ ] **Age rating**: Appropriate for content

### Google Play (Android)
- [ ] **App name**: "No-Contact" (matches app.json)
- [ ] **Short description**: 80 character limit
- [ ] **Full description**: 4000 character limit
- [ ] **Screenshots**: Required sizes for phone and tablet
- [ ] **App icon**: 512x512 PNG
- [ ] **Privacy policy**: Link to docs/privacy.md
- [ ] **Content rating**: Appropriate for content

## Screenshots Required

### iOS Screenshots
- [ ] **iPhone 6.7"**: Home screen, Journal, History, Analytics, Settings
- [ ] **iPhone 6.5"**: Home screen, Journal, History, Analytics, Settings
- [ ] **iPhone 5.5"**: Home screen, Journal, History, Analytics, Settings
- [ ] **iPad Pro 12.9"**: Home screen, Journal, History, Analytics, Settings

### Android Screenshots
- [ ] **Phone**: Home screen, Journal, History, Analytics, Settings
- [ ] **7" Tablet**: Home screen, Journal, History, Analytics, Settings
- [ ] **10" Tablet**: Home screen, Journal, History, Analytics, Settings

## Final Verification

### Pre-Release
- [ ] **All tests pass**: Manual testing complete
- [ ] **Performance**: Smooth 60fps scrolling
- [ ] **Memory**: No leaks during extended use
- [ ] **Battery**: No excessive battery drain
- [ ] **Accessibility**: Full screen reader support

### Post-Release
- [ ] **Download test**: Install from store on clean device
- [ ] **First launch**: Smooth onboarding experience
- [ ] **Data persistence**: Settings and data save correctly
- [ ] **Notifications**: Work as expected
- [ ] **Feedback**: Users can contact support

## Rollback Plan

### If Issues Found
- [ ] **Immediate**: Disable app in store
- [ ] **Investigation**: Identify root cause
- [ ] **Fix**: Deploy hotfix or new version
- [ ] **Testing**: Verify fix on affected devices
- [ ] **Re-enable**: Re-enable app in store

## Success Metrics

### Technical
- [ ] **Crash rate**: < 1% of sessions
- [ ] **ANR rate**: < 0.5% of sessions (Android)
- [ ] **Load time**: < 3 seconds to first screen
- [ ] **Memory usage**: < 100MB average

### User Experience
- [ ] **Rating**: Target 4.5+ stars
- [ ] **Retention**: 70%+ day 1, 40%+ day 7
- [ ] **Feedback**: Positive user reviews
- [ ] **Support**: Minimal support requests

---

**Note**: This checklist should be completed for each release. Keep a record of any issues found and their resolutions for future reference.

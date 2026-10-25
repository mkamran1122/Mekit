# Firebase Integration for Mekit.online

Firebase Authentication and Cloud Firestore have been provisioned and integrated into **Mekit.online**.

## 1. Project Configuration
- **Firebase Project ID:** `mekit-online`
- **Region:** `asia-southeast1`
- **Firestore Database ID:** `ai-studio-mekitfirstfreeim-a858c668-be60-410b-b14a-9440ec75317f`
- **Web App Config:** Stored securely in `firebase-applet-config.json`

## 2. Privacy-First Architecture (100% Client-Side Processing Preserved)
Mekit's core commitment remains unchanged: **all image compression, resizing, and format conversions execute strictly in the client's web browser.**
- **No image binaries are uploaded to Firebase or any remote server.**
- Firebase Firestore is utilized solely for:
  1. **User Cloud Presets:** Storing custom target KB limits, dimensions, and formats (`/users/{userId}/presets/{presetId}`).
  2. **Audit & Savings History:** Recording optimization statistics (filename, original KB, compressed KB, % reduction, timestamp) under (`/users/{userId}/history/{historyId}`).
  3. **Contact Inquiries:** Storing user messages and bug reports from the Contact page under (`/contact_messages/{messageId}`).

## 3. Security Rules (`firestore.rules`)
Hardened Firestore rules have been deployed enforcing strict user-boundary ownership:
- Each user can only read, create, update, or delete documents inside their own `/users/{userId}` subcollections (`presets` and `history`).
- Processing history entries are write-once and immutable.
- Contact form submissions allow creation with strict string schema validation, but prevent public read, update, or deletion.
- Catch-all rule denies any unauthorized document access.

## 4. UI Capabilities
- **Cloud Sync Header Menu:** Quick access to Google Sign-In, Guest mode, and user profile.
- **Custom Presets Modal:** Save the active compression limits and dimension rules as a reusable preset, or apply saved presets with one click.
- **Processing History Modal:** View recent optimization logs, calculate aggregate bandwidth savings, and export logs as CSV.
- **Contact Form Submission:** Inquiries submitted on `/contact` are sent directly to Cloud Firestore with client feedback and status indicators.

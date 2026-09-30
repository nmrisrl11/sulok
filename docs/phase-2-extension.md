# Phase 2: Browser Extension Plan

> **Status:** Phase 2 Core Implemented (Pending Polish)
> **Goal:** Create a Chrome Extension for Sulok that allows seamless, local-first saving of URLs into the user's IndexedDB without requiring a backend server.

---

## 1. Core Features

### A. The "Save to Sulok" Popup

- **Trigger:** Clicking the Sulok extension icon in the Chrome toolbar.
- **Auto-Fill:** Automatically extracts the current tab's `URL`, `Title`, and attempts to grab the `Favicon`/`OG Image`.
- **Folder Selector:** A beautifully styled dropdown (shadcn/ui `Select`) populated with the user's existing Sulok folders. Allows the user to pick a specific destination folder or default to the root "Library".
- **UX:** Premium design matching Sulok's theme (squircle corners, Manrope font, dark/light mode support). Instantly closes with a success micro-animation upon saving.

### B. Smart Context Menus (Zero-Click Saving)

- **Right-Click Page (`page` context):** "Save Page to Sulok". Captures the active tab's URL and title.
- **Right-Click Link (`link` context):** "Save Link to Sulok". Extracts the specific URL and text of the right-clicked link, allowing users to save articles without opening them.
- **UX:** Background execution. Saves directly to the default root "Library" folder. Provides visual confirmation via a Chrome notification or an injected on-page toast ("Added to your corner!").

---

## 2. Architecture & Logic (The Local-First Bridge)

Because Sulok operates entirely offline via IndexedDB (`sulok-app.vercel.app`) and has no backend API, the extension cannot directly `POST` data. It uses a **Sync Bridge & Queue Architecture**.

### The Sync Engine (Reading Data)

1. The extension injects a lightweight **Content Script** into `sulok-app.vercel.app`.
2. Whenever the user opens the web app, this script reads the current Folder Tree from IndexedDB and syncs a lightweight snapshot to the extension's `chrome.storage.local`.
3. The popup reads this local storage to instantly render the Folder Selector without needing to wake up the web app.

### The "Pending Saves" Queue (Writing Data)

1. When a user saves a link (via Popup or Context Menu), the extension writes the payload (url, title, folderId) into a **"Pending Saves" queue** in `chrome.storage.local`.
2. **Real-time Sync:** If the user has a Sulok tab open in the background, the extension sends a `chrome.tabs.sendMessage` payload. The web app instantly processes the save into IndexedDB and clears the queue.
3. **Deferred Sync:** If Sulok is closed, the links wait safely in the queue. The next time the user opens `sulok-app.vercel.app`, a React hook (`useExtensionBridge`) detects the queue, processes the writes to IndexedDB, clears `chrome.storage.local`, and shows a toast notification ("Saved X links from extension").

---

## 3. Technical Stack & Setup

- **Build Target:** Output a valid Chrome Extension within the existing Vite monorepo/configuration.
- **Framework:** React 19 + TailwindCSS v4 + shadcn/ui.
- **Manifest:** Manifest V3.
- **Required Permissions:**
  - `activeTab`: To securely read the current webpage's URL and Title for the popup.
  - `contextMenus`: To register the right-click "Save to Sulok" actions.
  - `storage`: To persist the folder snapshot and pending saves queue.
  - `scripting`: To inject the bridge script into the Sulok web application domain.
- **Host Permissions:**
  - `*://sulok-app.vercel.app/*` (or localhost for dev) to enable seamless cross-communication.

---

## 4. Implementation Steps (Checklist)

- [x] **Step 1: Build Configuration**
  - Set up a secondary Vite config (or CRXJS plugin) to build the extension alongside the React app.
  - Create `manifest.json` and basic extension entry points (`background.ts`, `popup.tsx`, `content.ts`).
- [x] **Step 2: Web App Bridge (React Side)**
  - Implement `useExtensionBridge.ts` in the main app to export the folder list to the extension and consume the pending saves queue from `chrome.storage`.
- [x] **Step 3: Background Service Worker**
  - Implement `chrome.contextMenus` registration and click handlers.
  - Implement the "Pending Saves" queue logic.
- [x] **Step 4: Popup UI**
  - Build the React interface for the popup.
  - Connect the "Save" button to the queue system.
  - Implement a highly-performant, searchable, and fully virtualized `<Combobox>` (`VirtualFolderCombobox`) to efficiently handle large folder structures (e.g., 500+ folders) without DOM lag.
- [x] **Step 5: Polish & Branding**
  - Extract all static copywriting to use `APP_INFO` constants.
  - Inject proper Sulok branding and icons (`favicon-96x96.png`) into `manifest.json`.
  - Fetch and display the active tab's native `favIconUrl` inside a squircle UI card in the popup.
  - Synchronize the user's active theme (dark/light/custom colors) from the web app to the extension popup via `chrome.storage`.
  - Fix MV3 Content Security Policy (CSP) blocking Vite HMR by allowing `http://localhost:*` in `script-src`.
  - Fix Dev-mode extension font loading (CORS) by manually copying `Fraunces` and `Manrope` font files into the `public/fonts/` directory, resolving them directly from the local bundle.
- [x] **Step 6: Context-Aware Duplicates & Recycle Bin Logic**
  - Update `extension-manager.tsx` to sync a status map (`{ url, isDeleted }`) instead of just raw URLs.
  - Add logic in `popup.tsx` to explicitly block users from saving trashed items, displaying an "In your Recycle Bin" disabled state.
  - Add logic in `background.ts` and `utils.ts` to show specific Chrome notifications ("Already in your corner" vs "Link in Recycle Bin") to prevent misleading success toasts.

---

## 5. Distribution & Installation UI

### The Distribution Strategy

1. **Beta Phase (GitHub Releases):** During initial development and testing, the extension will be distributed as a `.zip` file hosted on GitHub. Users will install it manually by enabling "Developer Mode" in `chrome://extensions` and loading the unpacked folder.
2. **Production Phase (Chrome Web Store):** Once polished, the extension will be officially published to the Chrome Web Store. This provides a trusted, 1-click installation experience and guarantees automatic background updates for all users.

### The In-App UI Integration

To seamlessly funnel users to the extension, we will upgrade the existing `/install` page into a unified **"Get Sulok"** hub:

- **Split Layout:** The page will be divided into two distinct, beautifully animated sections:
  1. _Install the Web App (PWA)_: Instructions for desktop/mobile home screen installation.
  2. _Get the Browser Extension_: A premium card highlighting the extension's zero-click saving features and smart context menus.
- **Dynamic Download Button:**
  - In Beta: Links to the GitHub release with a small "How to install" guide.
  - In Production: A native "Available in the Chrome Web Store" badge that links directly to the store listing.
- **Subtle Nudges:** A dismissible banner within the main Settings page or Library occasionally prompting users who haven't installed the extension yet.

# Phase 3: Device Synchronization (P2P WebRTC)

> **Status:** Planning / In Progress
> **Goal:** Implement a secure, Peer-to-Peer (P2P) device synchronization feature using WebRTC (via PeerJS). This allows users to seamlessly transfer or merge their Sulok library across devices without relying on a backend server, adhering strictly to the local-first philosophy.

---

## 1. Core Features

### A. The "Device Sync" Settings Section

- **Location:** Integrated into the "Data & Storage" tab within the Settings page (`features/settings/components/data-storage/p2p-sync-section.tsx`).
- **UI/UX Design:**
  - Premium, branded Sulok design. Instead of standard buttons, use segmented or beautifully styled action cards for "Send" and "Receive" to maintain the aesthetic of the settings page.
  - Incorporate the Sulo mascot to provide contextual feedback (e.g., Sulo wearing a tiny construction hat or holding an antenna during connection).
  - Follow the Settings hierarchy: Title (left) > Description (left) > Controls (right) or an optimized grid layout for these specific actions.

### B. Hosting (Sending Data)

- **Action:** User initiates "Send" mode.
- **Process:**
  - Generates a unique, readable 6-character PeerJS connection ID (e.g., `A1B2C3`).
  - Displays a responsive Modal (Desktop) or Drawer (Mobile) with the code prominently displayed in a large, monospace font (Geist Mono).
  - Automatically packages the current state from Dexie (Folders, Items) and Zustand (Settings) into a secure `Blob`.
  - Waits for a client connection and transfers the payload upon a successful WebRTC handshake.
  - Displays a success state and automatically cleans up the connection.

### C. Client (Receiving Data)

- **Action:** User initiates "Receive" mode.
- **Process:**
  - Opens a responsive Modal/Drawer prompting the user for the 6-character code.
  - Validates the code length and connects to the host.
  - Receives the JSON payload, strictly validates it using existing Zod domain schemas, and merges it into the local Dexie database.
  - Updates the Zustand state for global Settings (while stripping device-specific configurations like onboarding status or UI toggles).

---

## 2. Architecture & Logic

### PeerJS Integration (`useP2PSync`)

- A custom React hook (`src/hooks/use-p2p-sync.ts`) to encapsulate WebRTC connection logic and the state machine (`idle`, `connecting`, `hosting`, `transferring`, `error`, `success`).
- **Memory Leak Prevention:** WebRTC connections can easily leak memory if not managed. The hook MUST ensure the PeerJS instance is explicitly destroyed (`peer.destroy()`), data channels are closed, and all event listeners are removed during the `useEffect` cleanup phase or when the modal unmounts.

### Data Merging Strategy

- **Folders & Items:** Read from the incoming payload and perform a bulk upsert into Dexie. Use `db.transaction('rw', db.folders, db.items, ...)` to guarantee atomic consistency. If an item/folder ID exists, it is overwritten/updated; if not, it is created.
- **Settings:** Deep merge incoming settings with local settings using the existing `updateSettings` action in the store, ensuring hydration guards are respected.
- **Validation:** Never blindly accept incoming data. Pass all parsed JSON through `FolderSchema` and `ItemSchema` to prevent malformed data from crashing the app.

---

## 3. UI/UX & Styling Guidelines

- **Responsive Dialogs:** Use the `Dialog` (desktop) and `Drawer` (mobile) pattern for the sync interfaces.
- **Visual Polish:**
  - Use frosted glass containers (`bg-muted/40` or `bg-card/80 backdrop-blur-md`) for the connection codes.
  - Apply `corner-squircle` where appropriate to match the premium iOS-like aesthetic.
- **Animations:** Utilize `framer-motion` or Tailwind's `animate-in` for smooth state transitions between "Connecting...", "Transferring...", and "Success!".
- **Notifications:** Use `notify.success` or `notify.error` (from `goey-toast` via `src/lib/notify.ts`) for final feedback once the modal closes.
- **Rate Limiting:** Prevent users from spamming the "Connect" button by disabling it while the state is `connecting`.

---

## 4. Implementation Checklist

- [x] **Step 1: Setup & Dependencies**
  - Install `peerjs` (monitor bundle size impact, consider dynamic imports if it is too heavy).
  - Create a utility for generating short, readable IDs.
- [x] **Step 2: Core Hook (`useP2PSync`)**
  - Implement connection logic, PeerJS initialization, and data channel messaging.
  - Enforce strict cleanup logic (`peer.destroy()`) on unmount.
- [x] **Step 3: Data Packaging & Merging**
  - Implement `exportDataForSync` to generate the Blob payload.
  - Implement `importDataFromSync` with Zod validation and atomic Dexie transactions.
- [x] **Step 4: UI Components**
  - Build `P2PSyncSection` in `features/settings/components/data-storage/p2p-sync-section.tsx`.
  - Build `SyncHostDialog` and `SyncClientDialog` ensuring mobile/desktop responsiveness.
- [x] **Step 5: Testing & Refinement**
  - Verify cross-device connections (e.g., Desktop to Mobile over local Wi-Fi).
  - Handle edge cases: invalid connection codes, network drops mid-transfer, corrupted payloads.

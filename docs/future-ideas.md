# Future Ideas & Feature Backlog — Sulok

> A curated list of potential features, enhancements, and missing standard functionalities for future development phases. This document serves as a backlog for ideas that align with Sulok's local-first, intentional curation philosophy.

---

## 🔍 Missing Standard Functionality (Core Gaps)

These are standard expectations for bookmarking and web library apps that are not yet present in Sulok.

### 1. Netscape Bookmark HTML Import

- **Why it matters:** Every major browser (Chrome, Firefox, Safari) exports bookmarks as a standard HTML file (`bookmarks.html`). Currently, Sulok supports JSON, CSV, and TXT import, which creates a huge friction point for new users trying to migrate their existing browser bookmarks.
- **Implementation idea:** Add an HTML parser to the `src/lib/sync-utils.ts` (or a dedicated import parser) that can read the nested `<DL><DT><A>` structure of Netscape bookmark files and map it to Sulok's folder tree.

### 2. PWA Web Share Target API (Mobile)

- **Why it matters:** Sulok is a PWA, but on mobile devices (Android), users save links primarily via the native OS Share Sheet.
- **Implementation idea:** Implement the [Web Share Target API](https://developer.mozilla.org/en-US/docs/Web/Manifest/share_target) in `public/manifest.webmanifest`. This allows the Sulok PWA to appear as a share destination, receiving the URL and title directly from other mobile apps (like Twitter, Chrome, Safari) via a standard `POST` or `GET` request.

### 3. Manual Tags / Labels

- **Why it matters:** Strict folder trees are great for structure, but links often belong to multiple contexts (e.g., a React tutorial could be in `Programming` but also tagged `#to-read`).
- **Implementation idea:** Add a lightweight array of strings (`tags: string[]`) to the item schema. Keep it strictly manual (no AI auto-tagging) to respect the "intentional curation" philosophy. Add a tag filter to the main Explorer UI.

---

## 💡 Great Ideas to Add (Future Enhancements)

These are premium, "nice-to-have" features that elevate the app's user experience and utility without breaking the local-first, backend-free architecture.

### 1. Command Palette / Spotlight Search (`Ctrl/Cmd + P`)

- **Concept:** A global, keyboard-driven command palette accessible from anywhere in the app.
- **Value:** Power users expect instant keyboard navigation. Since the app is local-first, searching the IndexedDB is practically instantaneous.
- **Features:**
  - Jump to specific folders
  - Search links directly
  - Toggle settings (e.g., "Switch to Dark Mode", "Customize Sulo")
  - Trigger bulk actions

### 2. "Reader Mode" Offline Snapshot

- **Concept:** Combat "link rot" (when saved pages get deleted or paywalled).
- **Value:** When a user saves a link, Sulok could fetch the HTML, parse the core article text (using a library like Mozilla's Readability.js), and save the pure text content into IndexedDB.
- **Features:** A clean, distraction-free reading view using Sulok's premium typography (Manrope/Fraunces), allowing users to read articles completely offline even if the source website disappears.

### 3. Dead Link Checker

- **Concept:** A utility to periodically check if saved URLs are still alive (HTTP 200).
- **Value:** Over time, personal libraries fill up with dead links.
- **Features:** A background process (triggered manually in Settings to save bandwidth) that pings URLs and subtly flags 404/dead links in the UI, prompting the user to either update the URL or delete the item.

### 4. Personal Notes / Annotations

- **Concept:** A dedicated markdown text area for each saved link.
- **Value:** Users often save links and forget _why_ they saved them months later.
- **Features:** A "Personal Note" section in the Item Detail view (or right below the description in the list view) where users can leave memos for their future selves (e.g., "Use this specific CSS trick for the dashboard header").

### 5. Smart Duplicate Resolution UI

- **Concept:** Better handling when saving a link that already exists in the library.
- **Value:** Instead of just rejecting the save or silently dropping it, Sulok should actively help the user find the existing link.
- **Features:** When a duplicate URL is detected, show a rich toast or dialog that says "This link is already in your library" with a button to "Jump to Item", which navigates the tree and highlights the existing item.

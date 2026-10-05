# Future Ideas & Feature Backlog — Sulok

> A curated list of potential features, enhancements, and missing standard functionalities for future development phases. This document serves as a backlog for ideas that align with Sulok's local-first, intentional curation philosophy.

---

## 💡 Great Ideas to Add (Future Enhancements)

These are premium, "nice-to-have" features that elevate the app's user experience and utility without breaking the local-first, backend-free architecture.

### 1. "Reader Mode" Offline Snapshot

- **Concept:** Combat "link rot" (when saved pages get deleted or paywalled).
- **Value:** When a user saves a link, Sulok could fetch the HTML, parse the core article text (using a library like Mozilla's Readability.js), and save the pure text content into IndexedDB.
- **Features:** A clean, distraction-free reading view using Sulok's premium typography (Manrope/Fraunces), allowing users to read articles completely offline even if the source website disappears.

### 2. Dead Link Checker

- **Concept:** A utility to periodically check if saved URLs are still alive (HTTP 200).
- **Value:** Over time, personal libraries fill up with dead links.
- **Features:** A background process (triggered manually in Settings to save bandwidth) that pings URLs and subtly flags 404/dead links in the UI, prompting the user to either update the URL or delete the item.

### 3. Personal Notes / Annotations

- **Concept:** A dedicated markdown text area for each saved link.
- **Value:** Users often save links and forget _why_ they saved them months later.
- **Features:** A "Personal Note" section in the Item Detail view (or right below the description in the list view) where users can leave memos for their future selves (e.g., "Use this specific CSS trick for the dashboard header").

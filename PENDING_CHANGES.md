# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Interactive Brand Mascot: Introduced the "NomiBot" animated component to the global footer. It features smooth, physics-based body collision, eye blinking, and expressive states (winking, looking) triggered by user interactions.

### Changed

- Install Page UI: Redesigned the Install page to be visually cohesive, compact, and responsive. Introduced dynamic, platform-specific guided installation cards (iOS, Desktop, Supported) for improved UX.
- App Layout & Header: Unified the global Footer placement inside the main application layout to ensure it appears consistently across all views. Resolved iOS safe area layout shifts by implementing a sticky translucent header, and adapted the Updates page layout to account for the new header positioning.
- UI Consistency: Standardized the top padding and layout margins across the Settings, About, and Updates pages to ensure a unified responsive structure.
- Copywriting: Updated footer labels to better reflect Sulok's local-first identity (e.g., "Manage Data" instead of "Sync Data").
- Sulo Mascot & Header UX: Refined the online/offline status whisper messages for conciseness. Implemented a dynamic header navigation that elegantly hides the right navigation links on mobile devices when the wide "Sulok" text logo is visible, preventing layout overflow, and smoothly reveals them when it morphs into the compact Sulo mascot.
- Component Reorganization: Migrated `PwaManager` into the global `src/components/managers` directory and renamed the explorer sidebar to `ExplorerNav` to better reflect its horizontal navigation role.
- Design System: Refined the border radius scale and squircle classes across all components for perfect mathematical consistency and nesting aesthetics. Adjusted UI containers to use `rounded-xl` (squircle `4xl`), inner cards to `rounded-lg` (squircle `2xl`), and internal controls to `rounded-md` (squircle `xl`).

### Fixed

- Install Page Skeleton: Rebuilt the global page-level `InstallSkeleton` to pixel-perfectly match the structure of the redesigned Install page, eliminating a massive layout shift during lazy-loading.
- Install Prompt State: Fixed an edge case where dismissing the PWA install prompt could prevent it from cleanly resetting its internal state for future attempts.
- iOS Safe Area Collision: Added `viewport-fit=cover` to the application and implemented top safe-area insets directly on the sticky header to prevent collisions with the iOS status bar and dynamic island on mobile devices.
- Slider Interaction in Drawers: Fixed an issue where interacting with sliders inside mobile drawers (like the Settings Drawer) would inadvertently drag and close the drawer.
- PWA Configuration Refactoring: Extracted the PWA manifest screenshots configuration into a centralized constants file and introduced rich install UI assets.
- Mascot Whisper Context: Fixed an issue where the whisper speech bubble would awkwardly point to the "Sulok" text logo instead of the Sulo mascot by strictly conditionally rendering the whisper only when the mascot is fully visible and not being hovered.
- Pill Navigation Clipping: Resolved an issue where active navigation backgrounds with `shadow-engraved` were being sliced off by their container's overflow bounds. Implemented a mathematically precise concentric padding layout with fixed heights to perfectly align border radii and preserve outer shadows.

---

## Changelog Format

```markdown
### Added

- New feature description

### Changed

- Changed behavior description

### Fixed

- Bug fix description

### Removed

- Removed feature description
```

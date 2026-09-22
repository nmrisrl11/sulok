# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added a visual indicator in the Recycle Bin showing how many days are left before items and folders are permanently deleted, which updates automatically at midnight without refreshing.
- Added an automated background cleanup process to permanently delete items and folders in the Recycle Bin once their 30-day retention period expires.
- Added contextual status hints (e.g. "Already in this folder") when dragging items over the active folder path in the breadcrumb bar.

### Changed

- Refined drag-and-drop collision detection to improve precision and prevent items from accidentally snapping to distant drop zones.
- Single and bulk drag operations now silently ignore invalid drops (like dropping an item onto its current location) without distracting error messages, matching standard file-explorer UX.
- Overhauled the underlying list virtualization engine to completely eliminate FPS drops and lag when scrolling through hundreds of items.
- Implementing native scrollbar scrubbing behavior: dragging the scrollbar handle at high speed now defers rendering to keep the handle buttery smooth, matching standard heavy-data table UX.
- Implemented rate-limiting (spam prevention) on quick actions like "Favorite" to prevent overlapping UI flashes and notification spam while ensuring database integrity.

### Fixed

- Fixed a severe rendering crash ("Too many re-renders") caused by a strict equality type mismatch (`undefined !== null`) when dynamically deriving component state during the render phase.
- Fixed a rendering crash ("Cannot read properties of undefined (reading 'map')") that occurred when switching between List and Grid views while heavily scrolled down.
- Fixed an issue where drag-and-drop operations on mobile devices would clash with native text selection, long-press context menus, and page scrolling.

### Removed

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

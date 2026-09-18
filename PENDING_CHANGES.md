# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added contextual status hints (e.g. "Already in this folder") when dragging items over the active folder path in the breadcrumb bar.

### Changed

- Refined drag-and-drop collision detection to improve precision and prevent items from accidentally snapping to distant drop zones.
- Single and bulk drag operations now silently ignore invalid drops (like dropping an item onto its current location) without distracting error messages, matching standard file-explorer UX.

### Fixed

- Fixed an issue where drag-and-drop operations on mobile devices would clash with native text selection and long-press context menus.

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

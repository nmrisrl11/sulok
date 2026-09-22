# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added support for folder hierarchy preservation when exporting and importing data.
- Added a new hierarchical tree visualizer in the Import Preview dialog.
- Added TanStack Virtualization to the Move Items Dialog.
- Added Recycle Bin retention text (days remaining before auto-deletion) to Trash items and folders.
- Added Data Storage settings (showing DB usage metrics).
- Added an optional Referral Tracking setting to anonymously let websites know you discovered them via Sulok.

### Changed

- Significantly improved Explorer, Import Preview, and Move Dialog scrolling performance for large libraries using TanStack virtualized lists.
- Replaced all per-item dropdown menus with a unified global Action Drawer for both items and folders. This dramatically reduces DOM nodes and improves scrolling performance in virtualized lists. On desktop, the drawer elegantly adapts into a centered floating action sheet.
- Prevented UI re-rendering cascades during list scrolling by properly isolating and memoizing virtualized components.
- Refined duplicate detection during import to safely ignore items already in the Recycle Bin.

### Fixed

- Fixed a bug where clicking a folder from Search results would not properly clear the search scope.
- Fixed a bug where importing items correctly placed in folders could fail or display incorrectly.
- Fixed an issue where importing folders with conflicting IDs would fail instead of assigning new safe IDs.
- Fixed a rendering bug in the Import Preview tree where folders with missing parent references were excluded rather than falling back to the root level.

### Removed

- Removed the redundant external link button from grid cards to keep the UI cleaner (clicking the card itself opens the link).

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

# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added support for folder hierarchy preservation when exporting and importing data.
- Added a new hierarchical tree visualizer in the Import Preview dialog.

### Changed

- Significantly improved Import Preview scrolling performance using TanStack virtualized lists.
- Refined duplicate detection during import to safely ignore items already in the Recycle Bin.

### Fixed

- Fixed a bug where importing items correctly placed in folders could fail or display incorrectly.
- Fixed an issue where importing folders with conflicting IDs would fail instead of assigning new safe IDs.
- Fixed a rendering bug in the Import Preview tree where folders with missing parent references were excluded rather than falling back to the root level.

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

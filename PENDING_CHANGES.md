# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Animated List Sorting**: Smooth, hardware-accelerated FLIP transitions when changing sort options in the main explorer, powered natively by the Web Animations API with zero external dependencies and zero layout lag.

### Changed

- Swapped **About** and **Guide** navigation placement: promoted **Guide** to the top header alongside **Settings** for instant access to workflows and shortcuts, and positioned **About** in the global footer as part of the meta product hub (`About • Get App • Updates • App Tour`).
- Streamlined global footer into a single quiet row (`About • Get App • Updates • App Tour`) by relocating the **Developed by** credit to the bottom of the **About** page alongside the app version.

### Fixed

- **Recycle Bin Hierarchy & Independent Restoration**: Fixed an issue where trashing a folder would absorb links that had already been deleted individually into the Recycle Bin beforehand, causing them to disappear from the Recycle Bin list and erroneously restore back into the folder upon restoring or undoing folder deletion. Individually trashed links now remain preserved in the Recycle Bin independently.

### Removed

- Removed redundant "Go to your corner" and "See what's new" navigation links from the bottom of the About page.

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

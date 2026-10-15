# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Folder Item Counts**: Displayed live item and link counts directly under folder names in list, grid, Recycle Bin (`X items • Y days left`), and Command Palette views using monospace typography (`font-mono text-muted-foreground`), matching the URL styling of link cards and providing immediate context without needing to open folders.
- **Folder Item Counts Display Setting**: Added a dedicated toggle under **Interface & Layout** in **Settings > Appearance** and inside the **Quick Customize** side drawer (`Shift + C`), allowing users to easily toggle folder item counts on or off across list, grid, Recycle Bin, and Command Palette views.
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

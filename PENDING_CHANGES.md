# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added a Quick Customize side sheet (accessible globally via `Shift + C`) to instantly tweak themes, sounds, and mascot settings without leaving your current view.
- Added new curated Workspace Themes (Sepia, Sand, Midnight, Mocha) to fully personalize the lighting environment.

### Changed

- Redesigned the Workspace Theme selection UI in the Appearance settings to be more compact and user-friendly across all devices.
- Improved accessibility for the Accent Color picker by providing explicit labels for screen readers.
- Refactored all internal UI components to strictly use named React imports, ensuring cleaner code and full compatibility with modern TypeScript build tools.

### Fixed

- Fixed a "Flash of Unstyled Content" (FOUC) issue where the screen would briefly flash white before applying custom dark themes like Mocha or Midnight on initial load.
- Fixed a visual bug where the outer selection ring of the Accent Color picker was being clipped at the edges of the settings accordion.
- Fixed an issue where the `Shift + C` Quick Customize shortcut would accidentally trigger while typing in rich text editors or content-editable areas.

### Removed

- Removed the legacy light/dark mode toggle from the navigation bar to prevent conflicts with the new custom Workspace Themes.

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

# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Command Palette search now matches domains and displays the parent folder context for each result.
- Added support for the native OS Share menu (Web Share Target). You can now seamlessly share links from other apps directly to Sulok on Android and ChromeOS.

### Changed

- The Command Palette and main Home page now use a sleek custom scroll-fade effect at the top and bottom edges.
- Expanded Command Palette search limits, allowing up to 50 matching results to be displayed instantly while maintaining rendering performance.
- The Command Palette container and internal items now support the global squircle corner radius setting.

- Centered the "Data Protected" card layout in Data & Storage settings to prevent uneven empty space when the protect button is hidden.
- Adjusted "Sync Browser Bookmarks" visibility in Data & Storage settings to correctly show for resized desktop windows while remaining hidden on true mobile devices.

### Fixed

- Improved link extraction when sharing from other apps (Web Share Target) to properly ignore trailing sentence punctuation and invalid schemes.

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

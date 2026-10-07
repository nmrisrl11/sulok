# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Backup Reminders:** The app now intelligently reminds you to back up your library based on your activity and data volume. You can customize the reminder frequency or turn it off entirely in Settings.

### Changed

- Improved Device Sync deduplication: Syncing data from another device now intelligently merges folders and updates duplicate links using a "Latest Wins" approach, keeping your newest modifications intact.
- Danger Zone actions ("Delete Library" and "Factory Reset") now thoroughly clean up offline cache storage in addition to local data.

### Fixed

- Fixed an issue where previewing bookmarks during import would aggressively cache images and favicons before saving them.
- Fixed a bug where the browser extension could break after a Factory Reset on the web app.
- Fixed the Backup Reminder setting incorrectly displaying an overdue warning for new users before they had enough saved data.

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

# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Native Tooltips:** Added helpful hover tooltips to the Header's Search and Quick Customize icons to explicitly surface their keyboard shortcuts (`Cmd/Ctrl+K` and `Shift+C`).
- **Personal Notes & Annotations:** You can now add an optional personal note or reminder to any link you save. This makes intentional curation much easier—never forget _why_ you saved something!
  - Added a new distinct UI "Note" squircle indicator to link cards.
  - Clicking the note pill works as an instant shortcut, automatically opening the editor and dropping your cursor right into the note field.
  - The import preview screen also identifies which incoming links contain personal notes.
  - Fully integrated with local-first export/import (JSON, CSV, TXT) and on-device syncing.

### Fixed

- **Command Palette UI:** Fixed a visual clipping bug where the smooth scroll-fade effect would incorrectly mask the bottom of the list when there were too few search results to require scrolling.

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

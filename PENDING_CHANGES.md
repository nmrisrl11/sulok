# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Flat View Mode:** Added a dedicated toggle icon in the Explorer Toolbar to instantly switch your library between standard folder hierarchy ("Show Folder Hierarchy") and a flat, unified list of all your saved links ("Show All Links"). When activating this view, the app now automatically clears your current folder and navigates back to the root Library to ensure the breadcrumbs always accurately reflect the scope of the links being shown.
- **Native Tooltips:** Added helpful hover tooltips to the Header's Search and Quick Customize icons to explicitly surface their keyboard shortcuts (`Cmd/Ctrl+K` and `Shift+C`).
- **Personal Notes & Annotations:** You can now add an optional personal note or reminder to any link you save. This makes intentional curation much easier—never forget _why_ you saved something!
  - Added a new distinct UI "Note" squircle indicator to link cards.
  - Clicking the note pill works as an instant shortcut, automatically opening the editor and dropping your cursor right into the note field.
  - The import preview screen also identifies which incoming links contain personal notes.
  - Fully integrated with local-first export/import (JSON, CSV, TXT) and on-device syncing.
  - **Browser Extension:** The extension popup now fully supports adding personal notes! The UI perfectly mirrors the web app's style and character tracking, and notes are instantly synced back to your local corner upon saving.
- **With Notes Filter:** Added a new "With Notes" filter option to the Explorer toolbar dropdown. This allows you to instantly filter the explorer to only display links that contain personal notes or annotations.

### Fixed

- **Command Palette UI:** Fixed a visual clipping bug where the smooth scroll-fade effect would incorrectly mask the bottom of the list when there were too few search results to require scrolling.
- **Favicon Alignment:** Fixed a visual alignment issue on list cards where links without a custom logo fallback would render at a different width than standard favicons, pushing their titles out of alignment. All favicons now strictly respect a uniform 24x24 pixel grid.
- **Selection State Persistence:** Fixed an issue where active selections were not correctly cleared when toggling Flat View mode, preventing invisible items from remaining selected in the background.

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

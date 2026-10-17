# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Bookmark and Backup File Drag-and-Drop:** Drag a bookmark file (`.html`) or library backup file (`.json`, `.csv`, `.txt`) anywhere onto the Sulok window to automatically parse and open the interactive Import Preview Dialog. Preview folders and links before adding them to your library with duplicate detection and folder hierarchy preservation.
- **External Link Drag-and-Drop:** Drag any bookmark link from your browser's bookmark bar, address bar, or external windows directly into Sulok. Dropping onto a specific folder card or breadcrumb instantly saves the link directly inside that folder with undo support and automatic background metadata fetch. Dropping onto the Explorer main area opens the Item Dialog with the title, URL, and active folder pre-filled for immediate preview and editing.

### Changed

- **File Drop Overlay Design & Layout:** Redesigned the file drop card with a bespoke peeking-folder illustration where the 4 supported format documents (`FileCodeIcon` for `.HTML`, `FileBracesIcon` for `.JSON`, `FileSpreadsheetIcon` for `.CSV`, `FileTextIcon` for `.TXT`) fan out and peek from inside the folder with colors matched to the guide's `import-data-mock`. Streamlined the layout to three clean hierarchy tiers (illustration, title, description), softened the card shadow (`shadow-lg`), enlarged the file document cards for readability, and blocked underlying page interactions while the overlay is active.
- **Notification Typography & Formatting:** Enhanced `notify` to automatically format long toast messages into clean 2-liner toasts (header title + description body) while preventing wide overflowing pills and ensuring responsive max-width with text wrapping.

### Fixed

- **Recycle Bin Import Duplicate Detection & Preservation:** Enhanced import preview analysis to inspect both active and trashed records. Links and folders sitting in the Recycle Bin are now accurately flagged as duplicates with an explicit 'IN TRASH' badge rather than appearing as fresh entries to import. Prevented imported files from silently restoring trashed links or cloning deleted folders, preserving intentional deletions and keeping the Recycle Bin intact.
- **File Drop Stacking & Interaction Isolation:** Elevated the global file drop overlay z-index to `z-[100]` and removed pass-through pointer events to cleanly cover the Header navbar and bottom Quick Action Bar, preventing background elements from triggering hover states or intercepting drops.
- **File Drop Modal Lock & Concurrency Protection:** Prevented dropping additional backup files or triggering the drag overlay while the Import Preview Dialog is open or actively writing to the library database. Dragging over the window when a dialog is open now shows a blocked cursor (`dropEffect: "none"`) and dropping displays a helpful warning toast rather than interrupting the active review or corrupting sequential database imports.

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

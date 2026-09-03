# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### ✨ Added

- Fully functional Bookmark CRUD operations (Create, Read, Update, Delete) integrated with Dexie.js local database.
- Implemented Repository Pattern (`BookmarkRepository`) for scalable IndexedDB operations.
- Global Confirmation Modal architecture to avoid DOM bloat when confirming destructive actions on lists.
- Basic simplified single-column layout for the MVP list view.
- Integrated Google Favicon API for fetching domain favicons.
- Implemented full variable axes for Fraunces font to allow fine-tuning styling.

### 🗑️ Removed

- Mock data layer (`src/lib/mock-data.ts`) was removed in favor of live IndexedDB data.

### 🔧 Changed

- Switched from the planned complex two-pane layout to a simplified centered layout to expedite core MVP development.
- Mapped Tailwind CSS variables in `index.css` to accurately use custom Sulok brand color tokens (Amber, Linen, Cream, Charcoal, Stone).

---

### 🎉 Initial Release (Planned)

**Core Features**

- Save, edit, and delete bookmarks/links
- Create, rename, and delete folders
- Organize links into folders with drag and drop
- File tree view for folder/link hierarchy
- Open links in a new tab
- Copy link URL to clipboard
- Search bookmarks by title, URL, or tags
- Sort by name, date added, or manual order
- Filter by folder, tag, or bookmark type
- Pagination for large collections
- Assign tags and categories to bookmarks
- Automatic favicon fetching for saved sites
- Import bookmarks from JSON
- Export bookmarks to JSON
- Responsive layout for mobile devices
- PWA support — install as app, works offline

---

## Changelog Format

```markdown
## [version] — YYYY-MM-DD

### ✨ Added

- New feature description

### 🔧 Changed

- Changed behavior description

### 🐛 Fixed

- Bug fix description

### 🗑️ Removed

- Removed feature description
```

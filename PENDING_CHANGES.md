# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### ✨ Added

- Implemented performance optimizations (React.lazy and Suspense) for route-level and dialog code splitting, reducing the initial bundle size below 500kB.
- Implemented a beautiful and concise About Page (`/about`) that communicates the Sulok brand, tagline, and meaning.
- Integrated React Router DOM v7 to establish a scalable routing architecture and layout separation.
- Updated application metadata inside `app-info.ts` for centralized management of app version, meaning, and description.
- Implemented a metadata preview component in the "Add to Sulok" form that automatically fetches Title, Description, and Image from URLs using `microlink.io`.
- Enforced strict `@typescript-eslint/no-explicit-any` rule to ensure robust type safety across the repository.
- Replaced generic "Bookmark/Link" terminology with "Item" and "Sulok" to align with the core brand identity.
- Fully functional Item CRUD operations (Create, Read, Update, Delete) integrated with Dexie.js local database.
- Implemented Repository Pattern (`ItemRepository`) for scalable IndexedDB operations.
- Centralized domain schema validation (`item.schema.ts`) in `src/schemas/` to prevent corrupted saves/updates.
- Added shadcn `Tooltip`s to item action buttons for improved UX.
- Implemented App Referrer Link tracking for external item links using centralized `APP_INFO.appUrl`.
- Added dynamic copy-to-clipboard state feedback (green checkmark and tooltip) using a custom `useCopyToClipboard` hook.
- Redesigned and implemented a robust Empty State UI (`ItemEmptyState`) using shadcn/ui patterns.
- Refactored Skeleton loading states to be fully co-located with their respective components (`ItemCardSkeleton`).
- Global Confirmation Modal architecture to avoid DOM bloat when confirming destructive actions on lists.
- Added graceful error handling and `ErrorBoundary` fallback states for Dexie.js queries and mutations.
- Basic simplified single-column layout for the MVP list view.
- Integrated Google Favicon API for fetching domain favicons.
- Implemented full variable axes for Fraunces font to allow fine-tuning styling.

---

### 🎉 Initial Release (Planned)

**Core Features**

- Save, edit, and delete items
- Create, rename, and delete folders
- Organize items into folders with drag and drop
- File tree view for folder/item hierarchy
- Open item links in a new tab
- Copy link URL to clipboard
- Search items by title, URL, or tags
- Sort by name, date added, or manual order
- Filter by folder, tag, or item type
- Pagination for large collections
- Assign tags and categories to items
- Automatic favicon fetching for saved sites
- Import items from JSON
- Export items to JSON
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

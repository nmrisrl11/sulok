# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### ✨ Added

- Implemented dark and light mode theme switching, including a ThemeProvider and a ModeToggle switch in the header.
- Implemented performance optimizations (React.lazy and Suspense) for route-level and dialog code splitting, reducing the initial bundle size below 500kB.
- Implemented a beautiful and concise About Page (`/about`) that communicates the Sulok brand, tagline, and meaning.
- Integrated React Router DOM v7 to establish a scalable routing architecture and layout separation.
- Updated application metadata inside `app-info.ts` for centralized management of app version, meaning, and description.
- Implemented a metadata preview component in the "Add to Sulok" form that automatically fetches Title, Description, and Image from URLs using `microlink.io`.
- Enforced a uniform and standard size for all favicons using a bounded rounded box to ensure visual consistency regardless of native icon paddings.
- Integrated `@toolwind/corner-shape` to provide premium iOS-style squircle corners across the UI (Buttons, Cards, Favicons).
- Implemented a graceful fallback architecture using Tailwind CSS `@supports` feature queries to ensure unsupported browsers correctly degrade to standard rounded rectangles rather than rendering unintended circles.

### 🔧 Changed

- Redesigned `ItemForm` UI to strictly auto-populate and display Site Name and Description as read-only metadata fields, rather than editable inputs.
- Enforced strict URL domain validation (requiring a valid TLD or localhost) before permitting saves to prevent corrupt data entry.
- Updated Item URL metadata fetching to safely redact sensitive URL components (e.g. username, password) and restricted automatic fetching exclusively to changed URLs to prevent unnecessary external requests.
- Updated the URL schema refinement to be case-insensitive for `http://` and `https://`.

### 🐛 Fixed

- Fixed a bug where the metadata preview was not showing when editing an existing item.
- Fixed a bug causing the edit form preview to flash and overwrite state during the dialog's close animation by deriving `activeItem` state during render instead of using `useEffect`.
- Resolved TypeScript strictness error in `addItem` mutation when inferring from Zod schemas.
- Fixed a bug where favicons for modern apps hosted on PaaS (like Vercel) failed to load by fetching the full origin (`https://...`) instead of just the hostname.
- Fixed a race condition in the Add Item form that allowed saving empty metadata if submitted while the preview was fetching.
- Fixed a bug where the form retained old metadata if a subsequent URL failed to fetch.
- Fixed `formatUrl` utility so it preserves valid trailing slashes on deep paths, safely trimming only root origin trailing slashes.
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

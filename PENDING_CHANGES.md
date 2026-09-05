# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### ✨ Added

- Implemented responsive action affordances on `ItemCard`: touch devices now use an explicit "More" (`⋮`) dropdown menu, while desktop retains clean, hover-based inline actions.
- Made the primary content of item cards (favicon, title, and URL) a fully clickable area to drastically improve the mobile UX for opening links.
- Implemented a persistent `QuickLinkActionBar` anchored to the bottom for rapid URL entry and inline preview validation.
- Implemented a coordinated `BottomActionSystem` to dynamically swap between the `QuickLinkActionBar` and `BulkActionBar` (with React.lazy loading) depending on the selection state.
- Integrated the Sulo mascot into the Quick Link Action Bar, featuring contextual emotional reactions (sleepy, curious, attentive, confused) based on input focus and URL validation state.
- Implemented Bulk Delete functionality for items, featuring an animated floating Bulk Action Bar.
- Added "Select All" capability and individual selection checkboxes to the home page item list.
- Added `Checkbox` component from shadcn/ui to support item selection.
- Extended `ItemRepository` with `deleteMany` for efficient bulk deletions via Dexie's `bulkDelete`.
- Added localized whisper feedback UI on the header, separated from the Sulok logo click area, utilizing `goey-toast` state alongside `logo-store.ts`.
- Abstracted whisper phrases into `constants/whispers.ts` for randomized context-aware feedback (positive, negative, warning, info).
- Refined the whisper bubble styling to use `font-mono` and high-contrast `bg-foreground text-background` mapping for visibility in light mode.
- Integrated `goey-toast` as the global notification system (`src/lib/notify.ts`), replacing standard toasts, and enhancing UX copywriting to align with the brand (e.g., "Added to your corner" instead of "Item saved").
- Added a neutral, layout-compact error state with a subtle "confused" Sulo mascot when URL metadata preview fails (e.g., hitting rate limits).
- Redesigned the application header with a responsive layout, including dynamic logo scaling on mobile devices.
- Refined the header navigation into a high-contrast iOS-style segmented control pill to improve active state visibility in light mode.
- Refactored `HomePage` internal data fetching to directly return `<HomeRouteFallback />` when loading, gracefully handling state without duplicating layout logic and avoiding layout flashes for new users.
- Added a `disabled` state to `ItemEmptyState` (rendering it semi-transparent and unclickable) to allow safe use during route-level background loading states.
- Integrated `react-error-boundary` to provide robust, localized error recovery without requiring full-page reloads.
- Redesigned the global Error Boundary fallback UI to natively match the brand's aesthetic (similar to the Not Found page), featuring the Sulo mascot (sad expression) and playful, non-technical copywriting to soften unexpected failure states.
- Expanded Sulo mascot expressions to include angry, attentive, happy, laughing, neutral, proud, sad, scared, and surprised states.
- Implemented custom scrollbar styling globally for a refined and consistent UI experience.
- Added interactive Sulo mascot reaction (excited state) when hovering over the Empty State call-to-action button.
- Implemented an interactive Sulo mascot and Sulok logo with flawless SVG path morphing using `framer-motion` and `flubber`.
- Integrated a global `useLogoStore` to manage Sulo's emotional expressions (e.g., `sleepy`, `shy`, `confused`) which react to user hover events across the app.
- Configured Vite `manualChunks` in Rollup options as a function to accurately categorize and split heavy third-party dependencies (React, DB, UI, Animation) into separate domain chunks, fully resolving Vite's >500kB chunk size warnings and optimizing load times.
- Implemented dark and light mode theme switching, including a ThemeProvider and a ModeToggle switch in the header.
- Implemented performance optimizations (React.lazy and Suspense) for route-level and dialog code splitting, reducing the initial bundle size below 500kB.
- Implemented a beautiful and concise About Page (`/about`) that communicates the Sulok brand, tagline, and meaning.
- Integrated React Router DOM v7 to establish a scalable routing architecture and layout separation.
- Updated application metadata inside `app-info.ts` for centralized management of app version, meaning, and description.
- Implemented a metadata preview component in the "Add to Sulok" form that automatically fetches Title, Description, and Image from URLs using `api.ogfetch.com` with in-memory caching to prevent rate limits.
- Enforced a uniform and standard size for all favicons using a bounded rounded box to ensure visual consistency regardless of native icon paddings.
- Integrated `@toolwind/corner-shape` to provide premium iOS-style squircle corners across the UI (Buttons, Cards, Favicons).
- Implemented a graceful fallback architecture using Tailwind CSS `@supports` feature queries to ensure unsupported browsers correctly degrade to standard rounded rectangles rather than rendering unintended circles.

### 🗑️ Removed

- Removed the "Add to Sulok" button from the top of the Home page layout to consolidate item creation through the new `QuickLinkActionBar`.

### 🔧 Changed

- Improved item title typography by using `line-clamp-2` instead of single-line truncation, allowing titles to wrap naturally when space permits.
- Optimized mobile dropdown menu touch targets ("fat finger rule") with comfortable `py-2.5` padding while maintaining a refined aesthetic with smaller, lower-opacity icons.
- Enhanced the interactive morphing logo with a 2-second debounce on `MouseLeave` for a smoother, sticky morphing experience that avoids rapid jitter.
- Optimized SVG path morphing computations by deferring execution to the background (via `setTimeout`), preventing the animation logic from blocking the main thread during the initial page load.

- Redesigned `ItemForm` hierarchy to place the URL input first and simplified the presentation by removing redundant metadata fields.
- Improved the `ItemPreview` card layout to standard rich-link styling (image top, text bottom).
- Enforced strict URL domain validation (requiring a valid TLD or localhost) before permitting saves to prevent corrupt data entry.
- Overrode `goey-toast` / `sonner` mobile offset constraints with dynamic CSS variables measured via `ResizeObserver`, preventing toast notifications from overlapping the bottom action bars on mobile viewports.
- Updated Item URL metadata fetching to safely redact sensitive URL components (e.g. username, password) and restricted automatic fetching exclusively to changed URLs to prevent unnecessary external requests.
- Updated the URL schema refinement to be case-insensitive for `http://` and `https://`.

### 🐛 Fixed

- Fixed a layout collapse bug on the About Page and its Skeleton loader by explicitly defining `w-full` on the root container, ensuring `mx-auto` centers content correctly across the full viewport width instead of shrinking to fit narrow skeleton elements.
- Fixed `use-metadata.ts` to execute schema parsing and cache population outside of the `isMounted` boundary to ensure fetched data is successfully cached even if the component unmounts mid-request.
- Added bounded size cache eviction (max 50 entries) to the URL metadata cache in `use-metadata.ts` to prevent memory leaks over the tab's lifetime.
- Resolved a React Compiler hook dependency mutability warning in `sulok-logo.tsx` by reordering the `hoverTimeoutRef` declaration above its use inside effect cleanups.
- Fixed a timeout memory leak in the Mascot logo component by properly clearing and resetting `hoverTimeoutRef.current` upon component unmount and timeout execution.
- Added `role="alert"` to the URL metadata preview error state to ensure asynchronous fetch failures are properly announced by screen readers.
- Fixed TypeScript type constraints in the global `notify` utility by making the `id` option optional and accepting both `string` and `number`, ensuring full compatibility with the underlying `goey-toast` API.
- Fixed an issue on mobile where tapping and holding the logo would trigger the browser's default text selection menu by applying `select-none` and `[-webkit-touch-callout:none]`.
- Resolved a React hook lint warning in `useIsMobile` by initializing state directly during render (via `window.innerWidth`) rather than updating it synchronously within `useEffect`, preventing cascading renders.
- Fixed flexbox layout squishing and sharp edges on the URL metadata preview card within the scrollable Item Form dialog by enforcing `shrink-0` and `overflow-hidden`.
- Enforced a fixed Dialog Header and Footer pattern in the Add/Edit Item dialog to ensure consistent content scrolling without expanding beyond the viewport (`max-h-[90vh]`).
- Fixed a Flash of Unstyled Content (FOUC) causing a brief bright flicker on page load when Dark mode was active by injecting a synchronous theme initialization script into `index.html`.
- Fixed an organic blinking memory leak in the Mascot component where orphaned inner timeout chains could persist after unmounting by implementing an `isActive` unmount flag.
- Fixed an accessibility interaction where the disabled "What's new" button blocked mouse hover events, preventing Sulo from reacting.
- Refined Vite `manualChunks` splitting to parse absolute package names accurately, preventing false positive matches across deep `node_modules` file paths.

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

# Sulok — AI Agent Rules

> These rules govern how AI agents should approach implementation, design, and decision-making when working on Sulok.

---

## Core Principles

1. **Read first.** Always read `CURRENT_STATE.md`, `DESIGN.md`, and `AGENTS.md` before making changes.
2. **Stay local-first.** All data lives in IndexedDB via Dexie.js. Never introduce server dependencies for core functionality.
3. **Ship small.** Prefer small, testable changes over large refactors.
4. **Match the system.** Follow existing patterns. Don't introduce new libraries, patterns, or abstractions without explicit approval.
5. **Reference vs Copying.** When provided with reference code (like DayBook), use it for architectural patterns and ideas, but do not blindly copy its complexity if Sulok can achieve the same result more simply. Always prefer "Simple now, scalable later."

---

## Technology Rules

### Stack Constraints

- **Framework:** React 19 + Vite + TypeScript. No Next.js, no Remix, no SSR.
- **Styling:** TailwindCSS v4 + shadcn/ui only. No CSS modules, no styled-components, no tailwind.config.js (use index.css @theme).
- **State:** Zustand for app state.
- **Routing:** React Router DOM v7. Keep routing simple (`BrowserRouter` in `App.tsx`); do not over-engineer or over-abstract routing registries.
- **Forms:** React Hook Form + Zod for validation.
- **URL State:** nuqs for URL query parameters within pages. All `nuqs` parsers MUST be centralized in `src/lib/search-params.ts`. Do not define inline parsers in components.
- **Data:** IndexedDB via Dexie.js. No localStorage for structured data. No SQLite.
- **PWA:** Vite PWA plugin. Service worker for offline support.

### Dependency Rules

- Do NOT add new dependencies without explicit user approval.
- Prefer built-in browser APIs over libraries.
- If a feature can be built in < 50 lines, don't add a library.
- Check bundle size impact before suggesting a dependency.

---

## Design Rules

### Visual

- Follow the color palette defined in `DESIGN.md` (via `index.css`).
- Use Fraunces for display fonts and Manrope for UI.
- Components must use shadcn/ui primitives where available.
- Custom components should follow shadcn/ui conventions (cn utility, cva variants).
- **Mathematical Consistency**: Ensure perfect nesting aesthetics by subtracting the padding from the outer radius to find the inner radius (e.g. `rounded-md` inner + 6px padding = `rounded-xl` outer). If using `overflow-hidden` with outer shadows (like `shadow-engraved`), ensure the inner clipping container has at least 1-2px of internal padding to prevent decapitating the shadow, and use fixed heights to enforce radius constraints.
- No decorative elements, illustrations, or gradients in the general UI (the Sulo mascot is an exception, used for contextual feedback, empty states, and error boundaries).

### Layout

- Compact, dense but breathable spacing.
- Single-column layout on mobile, expandable on desktop.
- File tree structure for folder/link hierarchy.
- Drag-and-drop for organization.
- Sidebar navigation exists for the main file explorer (Library), keeping navigation structured.
- **Global Navigation & Meta Attribution**: Maintain a strict separation between in-app utilities and meta links. The Header is reserved for active tools (Guide, Settings, Search, Quick Customize). The Footer is reserved for secondary product links (About, Get App, Updates, App Tour) and must remain a single, quiet horizontal line without stacked branding. Developer provenance credits (Nomer with NomiBot) and app version belong on the About page.

### Interaction

- Every action should feel instant (< 100ms perceived).
- Optimistic updates — update UI before confirming write.
- Undo support for destructive actions (delete, move).
- No confirmation modals for non-destructive actions.
- Toast notifications for feedback, not alert dialogs. Always use `notify` from `src/lib/notify.ts` (powered by `goey-toast`), and never standard `sonner`. ALWAYS provide an explicit, entity-specific `id` property (e.g., `id: item-restored-${existing.id}`, `id: explorer-dup-${existing.id}`) to forcefully debounce notifications and prevent toast stacking or screen clutter during rapid actions.
- **List UX (Checkboxes)**: Checkboxes on items and folders in the main explorer should be hidden on desktop by default, appearing only on hover or when focused/selected. On mobile/touch devices, keep them visible.
- **Duplicate Link Prevention**: When a user attempts to add an existing URL, instantly notify them with a "Go to link" action (or "Restore" if in the trash) to guide them to the existing item, instead of simply blocking the creation with an error. This reinforces the "Save it now, find it later" brand philosophy.
- **List UX (Folders vs Items)**: Folders and links must be distinctly separated in list views (Folders first, then Items). Sorting applies independently within these groups. Do not completely merge them.
- **Animated List Sorting**: When changing sorting options in the main explorer, items glide smoothly into their new positions using hardware-accelerated FLIP transitions via the Web Animations API. Compute coordinates relative to the common container element, elevate virtual row z-index during the glide, and always respect `prefers-reduced-motion`.
- **Contextual Action Bars**: Bulk action bars must be scoped to the page component they operate on (e.g., `HomePage`) rather than being rendered globally in the layout, to prevent them from persisting across unrelated views.
- **Recycle Bin Context & Cascade Isolation**:
  - Clicking on a deleted folder or item in the trash should strictly toggle selection. It should NOT open the link or navigate into the folder.
  - Deleting a parent folder cascade-deletes only active children (setting `cascadeParentId = folderId`). Items and subfolders already in the Recycle Bin independently beforehand remain untouched and visible in the trash.
  - In the Recycle Bin view, only directly deleted entries (`!cascadeParentId`) are rendered.
  - Restoring a parent folder (or clicking Undo) only restores the folder and its cascaded children (`cascadeParentId === folderId`), keeping individually trashed items safe in the Recycle Bin.
  - Restoring an item or folder whose parent is in the Recycle Bin or missing must safely unorganize it to root (`folderId: undefined` / `parentId: null`).
  - Permanently deleting a folder only removes active/cascaded items; individually trashed items have their `folderId` cleared to `undefined`.
  - When performing batch soft-deletion of folders, load each target folder and skip updating it if it was already cascade-deleted by an earlier processed ancestor in the ongoing transaction (`folder.deletedAt === now && folder.cascadeParentId`), preventing accidental detachment of nested subfolders.
  - In database migrations or schema upgrades resolving cascade deletion hierarchy, assign `cascadeParentId` to the topmost ancestor in the matching `deletedAt` chain (with cycle and missing parent guards) so multi-level descendants restore cleanly with the root ancestor.
- **Drag & Drop UX**:
  - Ensure `pointerWithin` collision is used to prevent elements from snapping to distant drop zones.
  - Apply `select-none touch-callout-none` to all draggable items to prevent mobile long-press context menus and text selection from interrupting the drag flow.
  - Avoid visual noise during drag operations. Do not aggressively change the UI of invalid drop targets in the main grid; prefer silent returns for invalid drops (like Google Drive), saving explicit error feedback for edge cases like bulk moving a folder into itself.
  - **External Link Drag-and-Drop & Nested Targets**: When supporting drag-and-drop for external links or files with nested targets (e.g., explorer main area containing folder cards and breadcrumbs), manage targets centrally (`useExternalDragStore`). Dragging over a child target must exclusively activate that target and immediately hide the surrounding parent explorer dropzone indicator and badge. Always call `clearExternalDrag()` at the start of drop operations, and register global window event listeners (`dragend`, `drop`, `dragleave` when leaving window, and `Escape` key) to prevent drop overlays from sticking on screen. In window drop listeners (`handleWindowDrop`), always call `e.preventDefault()` for any recognized external drag before checking view state or routing to specific view handlers to prevent default browser navigation away from the app. Always wrap database saves in drop handlers (`saveExternalLinkToFolder`) in `try...catch` blocks to handle validation or duplicate constraint failures with user-facing error toasts instead of unhandled promise rejections.
  - **Active Folder Resolution in Explorer**: Never search child folder collections (`homeData.folders`) to find the active folder's name or metadata; the active folder is the parent and will not exist in child collections. Query `FolderRepository.getById(folderId)` directly via `useLiveQuery` to accurately display the active folder's name in dropzone hints and headers.
  - **Global File Drop Management (Bookmark & Backup Files)**: Differentiate OS file drops from link drags by checking `types.includes("Files")`. Global file drops are coordinated via `FileDropManager` in `App.tsx`. The full-viewport overlay sits at `z-[100]` to cleanly cover both the header navbar and bottom quick action bar, blocking underlying hover states and interactions while active. Track drag depth with a window event counter (`dragCounterRef`) to prevent flickering `dragleave` events when the cursor moves over child elements, and register global event listeners for `dragend`, `drop`, `dragleave` (checking window bounds), and `Escape` to ensure clean cancellation. Guard asynchronous file parsing against race conditions with an incremental request identifier (`importIdRef`) to ignore stale results from rapid consecutive drops, and cancel any pending dialog cleanup timer (`cleanupTimerRef`) before setting new parsed data. Lazily load the `ImportPreviewDialog` only when a valid file is parsed. **Modal Lock & Concurrency Protection:** While an `ImportPreviewDialog` is open or actively importing (`onImportingChange`), or when any modal dialog is mounted (`[role="dialog"]`, `[role="alertdialog"]`, `[data-slot="dialog-content"]`), `FileDropManager` must suppress the drag overlay (resetting drag counters and clearing active overlay state during `dragover` / `dragenter`) and set `e.dataTransfer.dropEffect = "none"` with `e.preventDefault()` on drag events. Furthermore, asynchronous file parsing must re-verify that no dialog was mounted during reading before opening the preview dialog. If a drop occurs while a dialog or import is active, abort file processing and notify the user with a debounced warning toast (`import-in-progress-blocked`, `import-preview-active-blocked`, or `modal-open-drop-blocked`) rather than overwriting preview data or causing database race conditions.
  - **Recycle Bin Import Duplicate Detection & Deletion Preservation**: When importing bookmark or backup files (e.g. in `import-utils.ts` and `ItemRepository`), ALWAYS check against both active and soft-deleted records (`getAllIncludingTrash()`). Links and folders sitting in the Recycle Bin must be flagged as duplicates (`isDuplicate: true, inTrash: true`) and skipped by default with an `IN TRASH` badge in `ImportPreviewDialog`. NEVER silently restore or un-delete trashed items or clone deleted folders on import without explicit user consent, preserving intentional deletions and keeping the Recycle Bin intact.
- **Interactive Sounds**: Use `cuelume` for UI sound effects. Global interactions are handled automatically via `useGlobalSoundInteractions.ts`. To opt a specific element (and its children) out of hover/click sounds, add the `data-no-sound="true"` attribute to the element.
- **Search Scope Clearance**: When navigating into a folder from a search result or breadcrumb, always explicitly clear the search query parameter (e.g., `setSearchQuery(null)`) to ensure the UI successfully exits "Search Mode" and displays the destination folder's normal contents.
- When positioning global overlays (like `GooeyToaster`) above persistent floating UI elements (like `BottomActionSystem`), use dynamic CSS variables (`--bottom-action-height`) powered by `ResizeObserver` instead of hard-coded offset values. Note: `sonner` enforces `--mobile-offset-bottom` on mobile viewports (< 600px), which must be explicitly overridden via a global `<style>` tag to support custom dynamic offsets on mobile.

---

## Code Rules

### File Organization

```
src/
├── components/       # Reusable UI components (App-specific global components go here)
│   └── ui/           # Strictly for external UI libraries like shadcn/ui and its registries. Never create internal/app-specific UI here.
├── constants/        # Centralized app metadata and global constants
├── data/             # Static data (e.g. changelog)
├── features/         # Feature modules
│   └── [feature]/    # e.g., items, settings
│       ├── components/
│       ├── actions/
│       ├── hooks/
│       └── utils/
├── hooks/            # Global custom React hooks
├── lib/              # Global utilities, helpers, constants
├── pages/            # Routable page components (Home, About, Settings, Updates)
├── schemas/          # Zod schemas defining core domain entities (shared between UI and DB)
├── stores/           # Zustand stores
├── db/               # Dexie.js database schema, repositories, and operations
├── types/            # Global TypeScript type definitions
└── App.tsx           # Root component
```

### Centralized App Data

- All application metadata (name, shortName, tagline, description, themeColor, keywords, author, etc.) MUST be centralized in `src/constants/app-info.ts`.
- **Version Numbering:** The active UI version is driven dynamically by `src/data/changelog.ts` (`CHANGELOG_DATA[0].version`). Do not store the version property in `app-info.ts` or hardcode it in components.
- **Do not hardcode app metadata (like the app name "Sulok") in UI components (headers, dialogs, buttons, empty states).** Always import `APP_INFO` from `src/constants/app-info.ts` and use `APP_INFO.name` or other relevant properties.
- Do not hardcode app metadata in `index.html` or `vite.config.ts`. Instead, use Vite plugins or template interpolation to inject data from this centralized file.

### Naming Conventions

- **Files:** kebab-case (`item-card.tsx`, `use-folders.ts`)
- **Components:** PascalCase (`ItemCard`, `FolderCard`)
- **Hooks:** camelCase with `use` prefix (`useFolders`, `useItems`)
- **Stores:** camelCase with `Store` suffix (`useFolderStore`, `useItemStore`)
- **Types:** PascalCase (`Folder`, `Item`, `ItemType`)
- **Constants:** SCREAMING_SNAKE_CASE (`DEFAULT_FOLDER_NAME`, `MAX_ITEMS`)
- **Icons:** When importing icons from `lucide-react`, ALWAYS import the version with the `Icon` suffix directly instead of using the `as` alias (e.g., `import { SettingsIcon } from "lucide-react";`, NOT `import { Settings as SettingsIcon }`). For deletion actions, ALWAYS use the bespoke custom icons from `@/components/icons`: `TrashClockIcon` (soft delete), `TrashXMarkIcon` (permanent delete), and `TrashUndoIcon` (restore), instead of generic lucide trash icons.

### TypeScript

- **Strict mode enabled. NEVER use `any` or bypass types.**
  - This rule is strict and heavily enforced by `oxlint`. Additionally, deep relative imports (`../../`) are actively blocked by a custom `no-restricted-imports` oxlint rule. The production build will explicitly fail on any warnings (`oxlint --deny-warnings`) or if `@ts-ignore`/`@ts-expect-error` bypasses are used.
  - Do not use `any`, `any[]`, `Record<string, any>`, or bypass types with `as any`.
  - Use `unknown` for unpredictable structures, then type guard or narrow them.
  - `verbatimModuleSyntax` is enabled in `tsconfig.app.json`. You MUST import types using the `type` modifier for external and internal types (e.g., `import { type ReactNode, type ComponentProps } from "react";`).
- **Fast Refresh Architecture:** Files containing React components (`.tsx`) MUST ONLY export React components. If a file needs to export a constant (like `cva` button variants), a custom hook, or a Context, extract those non-components into a separate file (e.g. `button-variants.ts`, `use-theme.ts`). Do not use `eslint-disable` to bypass this rule.
- **React Imports:** NEVER use namespace imports for React (e.g., `React.useState`, `React.ReactNode`, `React.ComponentProps`). Always use named imports (e.g., `import { useState, useEffect, type ReactNode } from "react";`). For React types (like `ComponentProps`, `ReactNode`, `MouseEvent`, `FormEvent`), you MUST prefix them with the `type` keyword inside the import block to comply with `verbatimModuleSyntax`.
- Use Zod schemas as the source of truth for types where possible.
- Export types from their feature module, not from a global types file.

### Import Aliases

- **NEVER use deep relative imports** (e.g., `../../` or `../../../`). You MUST always use the `@` alias for absolute imports when importing from outside the current feature module or from global directories.
- The `@` symbol maps to the `src` directory (configured in both `tsconfig.app.json` and `vite.config.ts`).
- Example: Use `import { Button } from "@/components/ui/button";` instead of `import { Button } from "../../../components/ui/button";`.
- Relative imports (e.g., `./` or `../`) are **ONLY permitted for co-located files within the exact same feature boundary** to preserve module cohesion (e.g., importing `./item-form` from `./item-dialog.tsx`).
- **Barrel Files:** Core layers like `stores/`, `hooks/`, `schemas/`, and `components/icons/` use `index.ts` barrel files to serve as public APIs and prevent circular dependencies. Consumers must import from the directory root (e.g., `@/stores` or `@/components/icons`) rather than directly importing individual files.

### Component Patterns

- Prefer function components with hooks.
- Extract logic into custom hooks when a component exceeds ~100 lines.
- Co-locate component, hook, and types in the same feature folder.
- Use `React.memo` only when profiling shows a performance need.
- **React Context Performance:** When building a React Context that provides both a state value and a stable dispatch/setter function, split them into two separate contexts (e.g., `ThemeStateContext` and `ThemeDispatchContext`). This ensures that components only needing the setter function do not unnecessarily re-render every time the state changes.
- **PWA Installation Events:** The `beforeinstallprompt` and `appinstalled` events fire outside the typical React lifecycle. Do NOT attempt to capture them exclusively inside a React `useEffect`. Always stash `beforeinstallprompt` via a lightweight inline script in `index.html` (e.g., `window.__deferredPrompt`), and specify that `appinstalled` clears `window.__deferredPrompt` and `window.__isInstallable` before dispatching a custom global event (like `app-installable`) that React can reliably consume once it mounts to synchronize its internal state.
- **PWA Manifest Screenshots:** When configuring screenshots for the Web App Manifest in `src/constants/pwa-screenshots.ts`, ensure wide form factor (`wide`, 1920x1080) and narrow form factor (`narrow`, 1080x1920) entries have consistent, descriptive labels and point to actual verified JPEG assets located in `public/rich-install-ui/desktop/` and `public/rich-install-ui/mobile/`.
- **Zustand Performance & Selectors:** NEVER destructure the entire state object from a store (e.g., `const { selectedIds } = useStore()`). This subscribes the component to every state change in the store, causing massive performance drops, unnecessary React Fiber node generation, and rapid memory inflation during development. ALWAYS use explicit atomic selectors (e.g., `const selectedIds = useStore((state) => state.selectedIds)`).
- **URL State Subscriptions in Lists:** When rendering large lists or virtualized collections, do NOT subscribe to URL parameters (via `useQueryState` or similar hooks) directly inside the individual list items (like `FolderCard` or `ItemCard`). Doing so creates hundreds of concurrent state subscriptions that destroy main thread performance when the URL changes. Instead, own the URL state in the parent container (like `ExplorerMain`) and pass down stable callbacks to the list items.
- **Folder Item Counts in Virtual Lists:** Never query or calculate item counts inside individual virtualized folder cards (e.g., querying `db.items.where("folderId").count()` inside `FolderCard` or `FolderGridCard`). When scrolling virtual lists rapidly, mounting folder rows triggers dozens of parallel database queries that stall the main thread and destroy scroll performance. Instead, aggregate item and folder counts at the container level via a single parent live query (`FolderRepository.getItemCounts()` inside `useHomeData` or in-memory aggregation in `useCommandSearch`) and pass down primitive `itemCount` props. In `React.memo` custom comparators for folder cards, ALWAYS check `prev.itemCount === next.itemCount` and `prev.showItemCount === next.showItemCount` alongside standard fields (`prev.folder.name === next.folder.name`, `isFavorite`, `isSelected`, etc.) so count or display setting updates only re-render the affected folder cards and avoid list-wide render cascades. Furthermore, when computing Recycle Bin folder counts, account for cascaded items and subfolders (`cascadeParentId`) to accurately reflect all nested content awaiting permanent deletion. Skeletons (`FolderCardSkeleton`, `FolderGridCardSkeleton`) must account for the active view and `showFolderItemCounts` (rendering the metadata placeholder when `view === "trash"` or item counts are enabled) to guarantee exact height parity and prevent layout shifts.
- **Radix UI Select Performance:** When rendering a `<Select>` component with a large number of `<SelectItem>` children (e.g., mapping over 50+ items), unconditionally rendering the items inside `<SelectContent>` can cause massive main-thread blocking during initial component mount. Always conditionally render the children using an `isOpen` state tracker (derived from `onOpenChange`) to strictly defer DOM generation until the dropdown is opened by the user.
- **Global Modals & Drawers Pattern:** Do not render `<Dialog />`, `<AlertDialog />`, `<Drawer />`, or `<DropdownMenu />` components inside list items or virtualized loops (e.g., placing a `<DropdownMenu />` inside an `ItemCard` mapped over 1000 items creates massive DOM bloat that destroys scroll performance). Instead, create a global store (e.g., `ActionDrawerStore`) and render a single global component in the app layout that opens when triggered via a simple button inside the list item.
- **Derive State During Render (React Compiler Strictness):** NEVER use `useEffect` to synchronize local state with incoming props (e.g., `useEffect(() => setLocalValue(value), [value])`). This is a strict anti-pattern flagged by React Compiler because calling `setState` synchronously within a `useEffect` triggers cascading renders. Instead, store the previous value in state and update the local value directly during render: `const [prev, setPrev] = useState(value); if (value !== prev) { setPrev(value); setLocalValue(value); }`. Or initialize state dynamically using `key={value}` on the component wrapper if full remounting is acceptable. **Crucially, retain this render-time previous-value pattern ONLY for local state or props. For external-store subscriptions (like Zustand), ensure selectors return a stable snapshot; avoid returning unstable object literals or mapping arrays inline, which causes the selector to return a new reference on every read and triggers infinite render retries in React Compiler.**
- **React Hook Form state sync:** When using `setValue` for fields that do not have explicitly rendered and interactive text inputs (e.g. hidden inputs), the values might not be accurately reflected in the `handleSubmit` payload during form submission. Always use `getValues()` inside your submit handler to extract the correct internal state or merge fallback values directly. Be mindful that an empty string `""` is not nullish, so use logical OR `||` instead of nullish coalescing `??` if you want empty strings to fall back to a default value.
- **Lazy Loading Dialogs:** When lazy loading Radix UI dialogs to reduce bundle size, do not conditionally render the component directly inside `Suspense` based on its `isOpen` state, as this immediately unmounts it on close and breaks exit animations. Instead, use a derived `hasLoaded` state flag to defer the initial download until the dialog is opened for the first time, and keep it mounted afterward so Radix can handle the exit transition.
- **Error Boundaries:** Wrap top-level routes and lazy-loaded chunks (like dialogs) with a global `ErrorBoundary` to gracefully handle chunk loading failures and render crashes. Use `react-error-boundary` to provide a functional, component-based recovery UI (via `resetErrorBoundary`) instead of forcing full-page reloads. Design fallback states to be friendly, branded (e.g., using Sulo mascot), and non-technical for end users, only exposing raw stack traces in development.
- **Empty States:** Empty states should be designed beautifully using dedicated components (e.g., `FolderEmptyState`) with illustrations/icons, clear messaging, and an actionable primary button to guide the user. Do not use plain text for empty states. Hide irrelevant UI controls (like search or sort filters) when a collection is truly empty to reduce clutter, but ensure they remain visible during active filtering (e.g., 0 search results).
- **Navigation Tabs:** Horizontal scrollable tabs (e.g., in Settings) must use CSS scroll snap (`snap-x`, `snap-start`). Furthermore, implement a `useEffect` inside a dedicated TabTrigger component to programmatically scroll the tab into view (`scrollIntoView({ behavior: 'smooth', inline: 'center' })`) whenever it becomes active.
- **Skeletons (Loading States):** Do not scatter generic `<Skeleton />` components in layout files. Always co-locate loading skeletons to their parent feature, page, or component (e.g., `ItemCardSkeleton` alongside `ItemCard`). When fetching data asynchronously via IndexedDB (like `useLiveQuery`), always account for the initial `undefined` state by explicitly tracking a loading boolean and rendering the appropriate skeleton to prevent UI flashes. Wrap main skeleton components in an element with `role="alert"` and a descriptive `aria-label` to ensure screen readers immediately announce the loading state.
- **Progressive Enhancement (Squircles):** We use `@toolwind/corner-shape` to implement premium iOS-style squircles. Because the native CSS `corner-shape` property is an emerging standard with limited support, ALWAYS provide a graceful fallback. Combine a standard Tailwind border-radius (e.g., `rounded-md`) with a `supports-[]` variant for the squircle radius (e.g., `supports-[corner-shape:squircle]:rounded-xl corner-squircle`). This ensures unsupported browsers get a standard rounded rectangle instead of an unintended circle.
- **Performance / Animations:** Heavy path interpolation calculations (like `flubber.combine`) must be deferred to the background (e.g., inside a `useEffect` with a `setTimeout`) and a static path rendered initially, to prevent blocking the main thread synchronously during page load.
- **Mock UI Animations:** When building continuous mock UI animations (like in the Guide page), orchestrate steps using an asynchronous `while(isMounted)` loop inside a `useEffect`. Use `await new Promise(r => setTimeout(r, ms))` to manage timing and CSS transitions. Always conditionally bypass animation delays or render static states when `useReducedMotion()` is active to respect accessibility preferences. The animation loop must be fluid: after the final action (like a success toast), the cursor should move out of the way and there must be a clear "fade-out" pause before the sequence restarts to avoid jarring resets. Success toasts should use `whitespace-nowrap` to prevent text wrapping. Ensure decorative mock containers and visually inactive elements (like fading toasts) are properly hidden from screen readers using `aria-hidden`.
- **Theme Initialization (FOUC):** To prevent Flash of Unstyled Content (FOUC) when hydrating themes, a synchronous inline `<script>` must exist in `index.html` to apply the initial dark/light class before React loads.
- **Recursive Timeouts:** When scheduling recursive asynchronous timeouts (e.g., organic blinking animations), always use an `isActive` boolean flag and clear all associated inner/outer timeout handles on unmount to prevent memory leaks and orphaned timer chains.
- **Vite Chunking:** When configuring `vite.config.ts`, always use `rollupOptions.output.manualChunks` as a function to logically group `node_modules` into domain-specific chunks (e.g., `vendor-react`, `vendor-db`, `vendor-ui`, `vendor-virtual`, `vendor-animation`) to prevent bundle size warnings (>500kB). Do not rely on a single monolithic `vendor` chunk.
- **Accessibility (ARIA):**
  - Always use `role="alert"` for dynamically rendered error states or asynchronous fallbacks (e.g., metadata fetch failures) to ensure screen readers immediately announce them without requiring user focus.
  - Maintain sequentially-descending heading hierarchies (e.g., `h1` -> `h2` -> `h3`) and ensure all interactive elements, particularly icon-only buttons, have accessible names via `aria-label` or `.sr-only` text to pass strict Lighthouse audits. For lists and loops, ensure these labels are entity-specific (e.g., `Actions for {folder.name}`) to provide unambiguous context to screen reader users.
- **Metadata Fetching Optimization:** When editing an existing item, do not refetch metadata from external APIs (like `ogfetch`) unless the URL has explicitly changed. Utilize the locally stored metadata (`title`, `description`, `image`, `logo`) to populate the preview and form state to conserve API limits.
- **SEO & Dynamic Meta Tags:** We use `react-helmet-async` for dynamic SEO (Title, Description, Canonical). Because this is a Client-Side Rendering (CSR) SPA, search engine bots that do not execute JS (like Twitter/Discord) rely on the static tags in `index.html`. To prevent `react-helmet-async` from duplicating these tags when the React app mounts, the static fallback tags in `index.html` MUST use the `data-static-seo="true"` attribute. A cleanup script in `src/main.tsx` explicitly removes these tags right before `createRoot` renders the app. Open Graph (`og:image`, `twitter:image`) metadata in `index.html` must use absolute canonical URLs to work correctly on social platforms (Vite injects `%APP_URL%`).
- **Agentic Browsing:** The `public/llms.txt` file must strictly follow the `llmstxt.org` standard format to ensure AI crawlers correctly parse the app's local-first architecture and available routes.
- **Mobile Touch Targets ("Fat Finger" Rule):** When designing interactive elements for mobile (like dropdown items or icon buttons), explicitly increase vertical/horizontal padding (e.g., `py-2.5 md:py-1.5`) so the hit area remains large enough for comfortable tapping, even if the internal icons or text are styled compactly.

---

## Data Rules

### Schema

- All entities must have `id` (string, nanoid), `createdAt`, and `updatedAt` timestamps.
- Folders have a `parentId` for tree structure (null = root).
- Items belong to a folder via `folderId`.
- URLs are unique.
- Sort order is maintained via an `order` field (number).

### Repository Pattern

- Abstract all database operations into a centralized repository object (e.g., `ItemRepository`, `FolderRepository`).
- A repository acts as the single source of truth for interacting with Dexie.js for a specific entity.
- Do NOT make direct Dexie.js (`db.bookmarks.put(...)`) calls inside React components, hooks, or Zustand stores.
- Repositories should handle:
  - Basic CRUD operations (`getAll`, `getById`, `save`, `update`, `delete`).
  - Bulk operations (`bulkSave`, `bulkDelete`).
  - Mapping or parsing incoming models into database records if they differ (e.g., extracting domain from a URL).
  - Executing internal transactions when multiple collections are affected (e.g., deleting a folder and cascading deletes to its items).
  - Calling storage hint functions (e.g., setting `localStorage` flags for app initialization).

### Operations

- All CRUD operations go through Dexie.js via the aforementioned Repositories.
- Wrap multi-step operations in Dexie transactions inside the repository methods.
- **Atomic Validation:** When enforcing uniqueness or checking for duplicates before saving, perform the read check and the write operation inside the same Dexie transaction to ensure atomic consistency.
- Validate all input with Zod before writing to the database.

### Import/Export & Device Sync

- Export formats are JSON, CSV, and TXT.
- Exported data must be self-contained (no external references).
- Data exports and P2P device sync strictly exclude items and folders in the Recycle Bin (`!deletedAt`) to keep archives clean and prevent sync trash pollution.
- Import must validate and deduplicate before inserting. If an imported link or folder currently exists in the local Recycle Bin, it is treated as a duplicate and skipped without restoring it, keeping the Recycle Bin intact.

---

## Git & Workflow Rules

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- One feature per branch.
- Keep PRs small and focused.
- Update `CURRENT_STATE.md` after completing a feature.
- Update `PENDING_CHANGES.md` for user-facing changes.
- **Changelog Workflow**:
  - `PENDING_CHANGES.md` acts as a staging area. It tracks raw, atomic, bulleted updates as they are developed.
  - When releasing a new version, DO NOT blindly copy the raw bullet points from `PENDING_CHANGES.md` into `src/data/changelog.ts`.
  - Instead, you MUST intelligently group related raw bullets into cohesive, user-facing feature paragraphs (e.g., merge multiple UI fixes into one "Polished UI Details" bullet).
  - Write them with a friendly, marketing-style tone focusing on user impact and value (e.g., "Drag-and-Drop Organization: You can now...").
  - Finally, add them to `src/data/changelog.ts` and empty the `Unreleased` section in `PENDING_CHANGES.md`.

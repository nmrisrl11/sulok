# AGENTS.md — Sulok

> Instructions for AI agents working on this project.

## Project Overview

**Sulok** is a personal web library — a local-first app for saving, organizing, and rediscovering bookmarks/links from the web.

- **Tagline:** Your corner of the web.
- **Stack:** React 19 + Vite + TypeScript + TailwindCSS v4 + shadcn/ui + Zustand + Dexie.js
- **Architecture:** Local-first, no backend, IndexedDB storage, PWA-capable
- **Deployment:** Vercel (sulok-app.vercel.app)

## Before You Start

1. Read `CURRENT_STATE.md` to understand what exists and what's in progress.
2. Read `DESIGN.md` for the design system, color palette, and component conventions.
3. Read `docs/rules.md` for implementation rules and constraints.
4. Read `PENDING_CHANGES.md` for what's queued for the next release.

## Source of Truth Hierarchy

- **Codebase**: Source of truth for actual implementation.
- **`PENDING_CHANGES.md`**: Source of truth for _unreleased_ user-facing changes.
- **`src/data/changelog.ts`**: Source of truth for _released_ user-facing changes AND the active UI version.
- **`CURRENT_STATE.md`**: Source of truth for current product/architecture state.
- **`package.json`**: Source of truth for the npm/build version.

## Key Architecture Decisions

### Tailwind v4

The project uses Tailwind v4. There is no `tailwind.config.js`. All custom themes, fonts, and variables are defined in `src/index.css` using the `@theme` directive.

### Local-First

All data is stored in IndexedDB via Dexie.js. There is no backend, no API, no authentication. The app works entirely offline. This is intentional — not a limitation.

### File Tree Structure

Links are organized in a folder tree (like a file explorer). Folders can be nested. Links belong to folders. This is the primary organizational metaphor.

### No AI Features

Sulok is intentionally simple. Do not add AI-powered features (auto-tagging, summarization, smart search) unless explicitly requested. The product is about manual, intentional curation.

### Single Page App

The app is a single-page React application. Uses `react-router-dom` for application routing (`/`, `/about`, etc). Use URL query params (via nuqs) for search/filter state. All `nuqs` parsers MUST be centralized in `src/lib/search-params.ts`. Do not define inline parsers inside components.

## File Structure

```
sulok/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/      # App layout, header, footer
│   │   └── ui/          # shadcn/ui components
│   ├── constants/       # App metadata and global constants
│   ├── data/            # Static data (e.g. changelog)
│   ├── features/
│   │   ├── items/       # Item CRUD, cards, list
│   │   └── settings/    # Settings configuration and UI
│   ├── pages/
│   │   ├── about/
│   │   ├── home/
│   │   ├── not-found/
│   │   ├── settings/
│   │   └── updates/
│   ├── hooks/
│   ├── lib/
│   ├── schemas/         # Zod schemas (domain) (*.schema.ts)
│   ├── stores/
│   ├── db/
│   ├── types/
│   └── App.tsx
├── docs/
│   ├── brand.md
│   └── rules.md
├── AGENTS.md
├── DESIGN.md
├── CURRENT_STATE.md
└── PENDING_CHANGES.md
```

## Conventions

- Use shadcn/ui components. Run `npx shadcn@latest add <component>` to add new ones.
- **Component Folder Rule:** App-specific global components go in `src/components/`. The `src/components/ui/` folder is strictly dedicated to external UI library components (like shadcn/ui). Do not put internal/custom logic components in `components/ui`.
- **Settings Layout & Hierarchy:** Group related settings into dedicated cards (e.g., using `SettingsCard`). For settings with descriptions, strictly prefer vertical lists with dividers (`divide-y`) over multi-column grids to prevent visual crowding. Enforce a clear hierarchy: Title (left) > Description (left) > Control (right). For settings that trigger a simple reset or restart action, use the unified `ResetButton` component (an icon button) placed in the same row as the Title, with the Description spanning full width underneath.
- Use `cn()` utility for conditional class merging.
- **Zustand Performance & Selectors:** NEVER destructure the entire state object from a store (e.g., `const { selectedIds } = useStore()`). This subscribes the component to every state change in the store, causing massive performance drops and unnecessary re-renders. ALWAYS use explicit atomic selectors (e.g., `const selectedIds = useStore((state) => state.selectedIds)`).
- **Radix UI Select Performance:** When rendering a `<Select>` component with a large number of `<SelectItem>` children (e.g., mapping over 50+ items), unconditionally rendering the items inside `<SelectContent>` can cause massive main-thread blocking during initial component mount. Always conditionally render the children using an `isOpen` state tracker (derived from `onOpenChange`) to strictly defer DOM generation until the dropdown is opened by the user.
- **Component State Isolation:** If a component subscribes to global state but its wrapper doesn't need to, extract the state-dependent UI into its own smaller component. This ensures that state changes only trigger re-renders exactly where the data is displayed, isolating layout shifts and preventing parent component cascades.
- **Dexie Live Query Re-renders:** When rendering collections of items from Dexie (like via `useLiveQuery`), arrays are recreated on every change. To prevent massive cascading re-renders across the whole collection when a single item changes (e.g. toggling favorite), ALWAYS wrap list item components in `React.memo` and provide a custom `areEqual` function that explicitly compares all the rendered fields (e.g. `prev.item.title === next.item.title && prev.item.isFavorite === next.item.isFavorite`). Do not rely solely on `updatedAt` as it may skip updates if the timestamp remains unchanged.
- **Virtualization Performance & Database Overload:** Never use `useLiveQuery` inside individual virtualized list items (like `ItemCard` or `ItemGridCard`). When rapidly scrolling a virtual list, mounting dozens of items instantly triggers dozens of parallel IndexedDB transactions, forcing massive asynchronous re-renders that destroy the frame rate. Instead, use a localized memory cache (e.g., a `Map`) backed by standard `useEffect` promises, ensuring data is instantly available without database listeners if previously cached.
- **URL State Subscriptions in Lists:** When rendering large lists or virtualized collections, do NOT subscribe to URL parameters (via `useQueryState` or similar hooks) directly inside the individual list items (like `FolderCard` or `ItemCard`). Doing so creates hundreds of concurrent state subscriptions that destroy main thread performance when the URL changes. Instead, own the URL state in the parent container (like `ExplorerMain`) and pass down stable callbacks to the list items.
- **Buttery Smooth Virtualization Scrubbing:** When using TanStack Virtual (`useVirtualizer`), wrap the `getVirtualItems()` output in React 18's `useDeferredValue`. This prioritizes scrollbar handle movement on the main thread, resulting in a perfectly smooth, lag-free scrub exactly like native scrollbars. **Important:** When applying `useDeferredValue` alongside synchronous data chunking (e.g. changing between List and Grid modes), you MUST add a guard (`if (!chunk) return null;`) to safely skip out-of-bounds index errors during the split-second deferred render.
- **Local-First Rate Limiting (Spam Prevention):** Because local IndexedDB transactions complete in 1-2 milliseconds, standard asynchronous locks often release too quickly to prevent users from spamming UI toggles (like "Favorite"). While technically safe for the database, this can cause jarring UI flashes or notification spam. Use a simple `useRef` guard to block concurrent overlap, and ALWAYS pass an explicit, entity-specific ID to the `notify` toast (e.g., `id: item-fav-${item.id}`) to forcefully debounce the visual notifications.
- **Memoization & Transient State:** When a component needs to hold transient local state (e.g., `useState` for hover previews) that causes its parent wrapper to re-render frequently, extract its static children or headers into their own `memo`ized components (using `React.memo`), and wrap stable functions in `useCallback`. This guarantees that frequent state changes in the parent do not cause massive cascading re-renders across expensive sibling components (like complex forms or dropdowns).
- **React Context Performance:** When building a React Context that provides both a state value and a stable dispatch/setter function, split them into two separate contexts (e.g., `ThemeStateContext` and `ThemeDispatchContext`). This ensures that components only needing the setter function do not unnecessarily re-render every time the state changes.
- **Zod Whitespace Validation:** When validating user-input strings with Zod, always chain `.trim()` before `.min(1)` (e.g., `z.string().trim().min(1)`) so that whitespace-only inputs are properly rejected and normalized.
- Zustand stores use the slice pattern if they grow beyond ~50 lines.
- **Strict Hydration Guards:** Never blindly deep merge unvalidated payloads from `localStorage` (via Zustand persist) if they map to complex domain types or string literals. Always validate and sanitize the inbound state payload inside the `merge` function before merging it with default settings to prevent malformed or obsolete local data from crashing the UI.
- **Data Layer:** Dexie operations must be abstracted into a Repository object in `src/db/repositories/` (e.g., `ItemRepository`). Never call IndexedDB or `db` directly from a component or store.
- **Dexie Transaction Safety:** When performing Dexie transactions (e.g. `db.transaction`), DO NOT use dynamic `await import()` inside the transaction block. Yielding the event loop for an import causes the IndexedDB transaction to commit prematurely, resulting in `PrematureCommitError`. Always statically import dependencies required for a transaction at the top of the file, or dynamically import them _before_ opening the transaction.
- **Atomic Validation & Bulk Operations:** When enforcing uniqueness, checking for duplicates before saving, or processing bulk actions across multiple entities (e.g., deleting/moving both items and folders simultaneously), always perform the read checks and write operations inside a single, unified Dexie transaction (e.g., `db.transaction("rw", db.folders, db.items, ...)`). This ensures cross-table consistency and prevents partial updates if one entity fails. Abstract these operations into specialized repositories (like `BulkRepository`).
- **Naming Collision Resolution:** When creating, renaming, moving, or restoring folders and items, the application must intelligently handle duplicate names in the destination folder. Do not blindly append counters (e.g., `Test (1) (1)`). Instead, use the `generateUniqueName` utility from `src/lib/utils.ts`, which parses existing numerical suffixes via regex and selects the first available positive numerical suffix. It fills gaps rather than simply incrementing the highest existing counter (e.g., if `Test (1)` and `Test (3)` exist, the new name will be `Test (2)`).
- **Strict TypeScript & Build:** The project strictly enforces `typescript/no-explicit-any` and bans `@ts-ignore` bypasses via `oxlint`. Code formatting is handled by `oxfmt`. The production build is configured to strictly fail on any warnings (`--deny-warnings`). NEVER use `any`. Use `unknown` and type guard it if necessary. When using Vite, `verbatimModuleSyntax` is enabled, so you must use type-only imports for TypeScript types (e.g., `import { type ReactNode, type ComponentProps } from "react";`).
- **Fast Refresh Strictness:** To ensure React Fast Refresh works perfectly without losing component state, component files (`.tsx`) must strictly ONLY export components. The `react/only-export-components` rule permits constant exports, but non-components (like custom hooks or Context objects) must be extracted into dedicated files (e.g. `hooks/use-theme.ts`). Do not bypass the `react/only-export-components` rule.
- **React Imports:** NEVER use namespace imports for React (e.g., `React.useState`, `React.ReactNode`, `React.ComponentProps`). Always use named imports (e.g., `import { useState, useEffect, type ReactNode } from "react";`). For React types (like `ComponentProps`, `ReactNode`, `MouseEvent`, `FormEvent`), you MUST prefix them with the `type` keyword inside the import block to comply with `verbatimModuleSyntax`.
- **Import Aliases & Barrel Files:** Always use the `@` alias for absolute imports instead of relative deep imports (e.g., `../../../`). When importing from directories that have an `index.ts` barrel file (e.g., `src/components/icons`, `src/stores`, `src/hooks`, `src/schemas`), always import through the barrel file (e.g., `import { FolderLinkIcon } from "@/components/icons";`) rather than directly importing the individual files.
- **Icons:** When importing standard utility icons from `lucide-react`, ALWAYS import the version with the `Icon` suffix directly instead of using the `as` alias (e.g., `import { SettingsIcon } from "lucide-react";`). For item and folder actions, ALWAYS use the bespoke custom icons from `@/components/icons`. These are grouped logically into domain subdirectories (e.g., `/actions`, `/folders`, `/trash`) but must always be imported directly from the root barrel file (e.g., `import { TrashClockIcon } from "@/components/icons";`). Additionally, ALWAYS use the custom `FolderIcon` from `@/components/icons` which utilizes a 3-layer CSS variable architecture (`--folder-color-back`, `--folder-color-paper`, `--folder-color-front`) to support future theme color customizations.
- **Responsive Dialogs:** Forms and configuration modals (like `ItemDialog`, `FolderDialog`, `MoveDialog`) MUST implement a responsive UI pattern: render as a centered `Dialog` on desktop and a bottom `Drawer` on mobile using the `useIsMobile()` hook. This ensures optimal touch accessibility.
- **Global Modals & Drawers Pattern:** Do not render `<Dialog />`, `<AlertDialog />`, `<Drawer />`, or `<DropdownMenu />` components inside list items or virtualized loops. Doing so creates massive DOM bloat that destroys scrolling performance. Instead, create a global store (e.g., `ActionDrawerStore`) and render a single global component in the app layout (`GlobalActionDrawers`) that opens when triggered via a simple button inside the list item.
- **Derive State During Render (React Compiler Strictness):** NEVER use `useEffect` to synchronize local state with incoming props (e.g., `useEffect(() => setLocalValue(value), [value])`). This is a strict anti-pattern flagged by React Compiler because calling `setState` synchronously within a `useEffect` triggers cascading renders. Instead, store the previous value in state and update the local value directly during render: `const [prev, setPrev] = useState(value); if (value !== prev) { setPrev(value); setLocalValue(value); }`. Or initialize state dynamically using `key={value}` on the component wrapper if full remounting is acceptable. **Crucially, retain this render-time previous-value pattern ONLY for local state or props. For external-store subscriptions (like Zustand), ensure selectors return a stable snapshot; avoid returning unstable object literals or mapping arrays inline, which causes the selector to return a new reference on every read and triggers infinite render retries in React Compiler.** **Important Type Strictness:** When deriving state from optional props (e.g., `string | undefined`), ensure your previous value's state type strictly matches (`useState<string | undefined>`). Using a mismatched type (like `useState<string | null>(value || null)`) causes the strict equality check `if (value !== prev)` to fail (e.g., `undefined !== null`), triggering an infinite render loop.
- **Impure Functions in Render (React Compiler Purity):** NEVER call impure functions (e.g., `Math.random()`, `crypto.randomUUID()`, or `Date.now()`) directly during render or inside `useMemo`. Doing so causes React Compiler to flag the component as impure and skip optimization entirely (`react(purity)` bailout), which leads to unpredictable updates and destroys scroll virtualization performance. If you need a stable sequential key for temporary items inside a `useMemo`, declare a block-scoped `let counter = 0;` and use `counter++` instead.
- **React Hook Form state sync:** When using `setValue` for fields that do not have explicitly rendered and interactive text inputs (e.g. hidden inputs), the values might not be accurately reflected in the `handleSubmit` payload during form submission. Always use `getValues()` inside your submit handler to extract the correct internal state or merge fallback values directly. Be mindful that an empty string `""` is not nullish, so use logical OR `||` instead of nullish coalescing `??` if you want empty strings to fall back to a default value.
- **Centralized Metadata:** Do not hardcode app names or URLs in UI components. Always use `APP_INFO` from `src/constants/app-info.ts` (e.g. `APP_INFO.name`, `APP_INFO.appUrl`).
- **Breadcrumbs & Path Navigation:** When building breadcrumb interfaces or path navigators, ALWAYS use the centralized `FolderBreadcrumbs` component from `src/features/folders/components/folder-breadcrumbs.tsx` to ensure consistent truncation, dropdown behavior, and styling across the main explorer and dialogs.
- **Navigation Tabs:** Horizontal scrollable tabs (e.g., in Settings) must use CSS scroll snap (`snap-x`, `snap-start`). Furthermore, implement a `useEffect` inside a dedicated TabTrigger component to programmatically scroll the tab into view (`scrollIntoView({ behavior: 'smooth', inline: 'center' })`) whenever it becomes active.
- **Accessibility (ARIA):** Always use `role="alert"` for dynamically rendered error states or asynchronous fallbacks (e.g., metadata fetch failures). Maintain sequentially-descending heading hierarchies (e.g., `h1` -> `h2` -> `h3`) and ensure all interactive elements, particularly icon-only buttons, have accessible names via `aria-label` or `.sr-only` text to pass strict Lighthouse audits. For lists and loops, ensure these labels are entity-specific (e.g., `Actions for {folder.name}`) to provide unambiguous context to screen reader users.
- **Drag & Drop (dnd-kit):** When implementing drag-and-drop, ALWAYS include `KeyboardSensor`. Use dynamic collision detection (`pointerWithin` for pointers to prevent distant snapping, and `closestCenter` for keyboards). ALWAYS use `MouseSensor` (with distance constraint) and `TouchSensor` (with delay constraint) instead of `PointerSensor`. Modern mobile browsers use pointer events, so a generic `PointerSensor` will greedily steal mobile touches without preventing native scrolling, causing the browser to cancel the drag mid-gesture. When applying `listeners` to interactive cards that also implement custom `onKeyDown` or `onClick` handlers, you MUST manually call `listeners?.onKeyDown?.(e)` inside your custom handler to prevent overriding the library's built-in keyboard navigation. Use strict event filtering (e.g. `e.target !== e.currentTarget` and `.closest()`) to prevent clicks on nested elements from triggering drag actions or duplicate navigation. Always apply `select-none touch-callout-none` to draggable cards to prevent native mobile text selection and context menus from clashing with the drag sensors. When using `DragOverlay`, always implement a custom modifier to constrain its coordinates to the `windowRect` to prevent drag badges or custom cursors from clipping outside the screen edges (especially important for mobile views).
- **Skeletons & Empty States:** Co-locate loading skeletons with their respective components. Use dedicated beautifully designed components for empty states rather than plain text. Hide irrelevant UI controls (like search or sort filters) when a collection is truly empty to reduce clutter, but ensure they remain visible during active filtering (e.g., 0 search results). Use route-specific fallbacks (e.g., `HomeRouteFallback`, `AboutSkeleton`) wrapped in `<Suspense>` per route. Avoid layout flashes by ensuring fallback states exactly match the layout structure of the empty state they resolve to. When fetching data asynchronously via IndexedDB (like `useLiveQuery`), always account for the initial `undefined` state by explicitly tracking a loading boolean and rendering the appropriate skeleton to prevent UI flashes. Wrap main skeleton components in an element with `role="alert"` and a descriptive `aria-label` to ensure screen readers immediately announce the loading state. When asynchronously seeding default data for new users (e.g., on DB initialization), immediately set `hasDataHint` to `true` to ensure the initial page load renders the Skeleton loader rather than incorrectly flashing the Empty Route Fallback.
- **Skeleton & Fallback Parity (Preventing Layout Shifts):** Skeletons and route fallbacks MUST strictly mirror the responsive structural classes of the actual components they mock (e.g., flex directions, grid columns, padding, mobile visibility overrides like `hidden sm:flex`). Whenever you modify the layout, structure, or responsive behavior of a core component (like the sidebar, toolbar, or item cards), you MUST identically update its corresponding skeleton and fallback route components. A failure to synchronize responsive classes between the actual UI and its skeleton creates severe layout shifts, mismatched spacing, and flickering on smaller devices.
- **Scrollbars:** Always use the `.custom-scrollbar` class on any scrollable container (e.g., `overflow-y-auto`) to ensure a consistent, branded scrollbar styling across the application.
- **Full-Height Scrollable Layouts:** To create a layout where the main body does not scroll but an inner list scrolls (like the DayBook pattern), DO NOT use `flex-1` down the entire tree if the parent lacks a strict height boundary, as this allows the container to infinitely grow and causes body scrolling. Instead, calculate the fixed header heights and use `max-h-[calc(100dvh-offset)]` on the scrollable container. This mathematically guarantees the layout never exceeds the viewport.
- **Edge Clipping in Scroll Containers:** When adding selection outlines to items inside an `overflow-y-auto` or `overflow-hidden` container, DO NOT use `ring-1` or `outline` as they draw outside the element's bounding box and will be clipped by the scroll container's bounds. Instead, pre-allocate a transparent border (`border border-transparent`) and swap the border color on selection (`border-border`), ensuring the highlight stays safely within the box model.
- **Progressive Enhancement (Squircles):** The project uses `@toolwind/corner-shape` (`corner-squircle`) for iOS-like corner smoothing. ALWAYS provide a graceful fallback by combining a standard Tailwind border-radius (e.g., `rounded-md`) with a `supports-[]` variant for the squircle radius (e.g., `supports-[corner-shape:squircle]:rounded-xl corner-squircle`).
- **Notifications:** Do not use `sonner` or shadcn's `useToast` directly. Always use the `notify` utility from `src/lib/notify.ts` which wraps `goey-toast` for fluid, animated notifications.
- **Notification Actions & Undo:** When implementing undo actions via notifications, do NOT use `successLabel` if the action is asynchronous. Instead, await the asynchronous operation (e.g., restoring items) inside the `onClick` handler. To prevent overlapping toasts, explicitly call `notify.dismiss(originalToastId)` before manually triggering `notify.success` or `notify.error`. This ensures success is not reported prematurely and the UI remains clean.
- **Interactive Sounds:** Use `cuelume` for UI sound effects. Global interactions are handled automatically via `useGlobalSoundInteractions.ts`. To opt a specific element (and its children) out of hover/click sounds, add the `data-no-sound="true"` attribute to the element.
- **Floating UI Coordination:** When positioning global overlays (like `GooeyToaster`) above persistent floating UI elements (like `BottomActionSystem`), use dynamic CSS variables (`--bottom-action-height`) powered by `ResizeObserver` instead of hard-coded offset values. Note: `sonner` enforces `--mobile-offset-bottom` on mobile viewports (< 600px), which must be explicitly overridden via a global `<style>` tag to support custom dynamic offsets on mobile.
- **Safe Area Insets:** When building fixed UI elements anchored to the bottom (like the `BottomActionSystem`), always incorporate `env(safe-area-inset-bottom)` into their positioning. The main app layout (`AppLayout`) ensures scrollable content isn't obscured by providing safe bottom padding on mobile viewports.
- **Glassmorphism:** Bottom floating action bars use a glassmorphic effect (`bg-card/80 backdrop-blur-md`) to blend smoothly with scrolling content.
- **Route-Specific State Cleanup:** Always clear contextual global state (like `selectedIds` for bulk actions) when the associated page component (e.g., `HomePage`) unmounts to prevent UI components from persisting improperly across different routes.
- **List UX (Folders vs Items):** When rendering mixed collections of folders and links/items in the main explorer, they MUST be separated into distinct groups (Folders first, then Items). Sorting (e.g., alphabetically or by date) must be applied independently _within_ those groups. Never completely merge them into a single sorted list, as this breaks standard file-explorer UX conventions (e.g., Google Drive, Terabox).
- **Contextual Action Bars:** Bulk action bars and selection states must be scoped strictly to the page component they operate on (e.g., `HomePage`) rather than being rendered globally in the `AppLayout`. This prevents contextual tools from persisting incorrectly when navigating to unrelated views (like Settings). Global utilities (like `QuickLinkActionBar`) belong in the global layout.
- **List UX (Checkboxes):** Checkboxes on items and folders in the main explorer should be hidden on desktop by default, appearing only on hover or when focused/selected. On mobile/touch devices, keep them visible.
- **Interactive Onboarding (Joyride):** When implementing interactive tours via `react-joyride`, always use `CustomTooltip` and pass `skipProps` for navigation rather than `closeProps` to ensure consistent step tracking. Strictly gate the tour's execution (`run={isRunning}`) by validating the current route (e.g., `location.pathname === "/"`) to prevent the tour from crashing the UI when users navigate away and target elements unmount.
- **Feature Independence & Global Stores:** Features (e.g., `folders`, `items`) must remain cohesive and independent. Do not cross-import feature-specific stores or state directly into another feature. If state needs to be shared across multiple features (such as `active-drag-store`), lift it out of the feature and into the global `src/stores/` directory.
- **Import Paths (Alias vs Relative):** Use relative paths (e.g., `../hooks/use-metadata`) when importing from co-located files within the same feature module to preserve boundary cohesion. Use the `@/` alias (e.g., `@/components/ui/button`) strictly when importing from outside the current feature or from global directories.
- **Smart Selection UX:** When implementing interactive list items or cards, if the application is currently in a "selection mode" (e.g., when items or folders are actively selected for bulk actions), clicking anywhere on the item should strictly toggle its selection state rather than triggering its primary action (like navigating or opening links).
- **Duplicate Link Prevention:** When a user attempts to add an existing URL, instantly notify them with a "Go to link" action (or "Restore" if in the trash) to guide them to the existing item, instead of simply blocking the creation with an error. This reinforces the "Save it now, find it later" brand philosophy.
- **Recycle Bin Context:** Clicking on a deleted folder or item in the trash should strictly toggle selection. It should NOT open the link or navigate into the folder. Deleting a parent folder hides its children from the UI. Restoring the parent restores the entire tree.
- **Recycle Bin Metadata:** When rendering items or folders inside the Recycle Bin, display the remaining retention days (e.g., "30 days left") as subtle metadata. Do NOT use heavy badges, background colors, or icons for this; use a clean, icon-less monospace font (`font-mono text-muted-foreground`) to minimize visual noise.
- **Favicon fetching:** Attempt to use the locally saved `logo` URL from the item first. If unavailable or if it fails to load, gracefully fall back to Google's S2 service: `https://www.google.com/s2/favicons?domain=[origin]&sz=64` (use the full origin, e.g. `https://domain.com`, to ensure it resolves modern PaaS deployments properly).
- **Metadata fetching:** Uses `api.ogfetch.com` for robust open-graph metadata preview. **Optimization Rule:** When editing an existing item, do not refetch metadata from external APIs unless the URL has explicitly changed. Utilize the locally stored metadata (`title`, `description`, `image`, `logo`) to populate the preview and form state to conserve API limits.
- **SEO & Social Previews:** Open Graph (`og:image`, `twitter:image`) tags in `index.html` must use absolute canonical URLs. Do not use relative paths for social images. Vite's `html-transform` plugin injects `%APP_URL%`.
- **Agentic Browsing:** The `public/llms.txt` file must strictly follow the `llmstxt.org` standard, containing a blockquote summary, detailed description, agent guidelines, and a `## Resources` section with absolute markdown links.
- **Vite Chunking:** Always use `rollupOptions.output.manualChunks` as a function in `vite.config.ts` to logically group dependencies into domain-specific chunks (e.g., `vendor-react`, `vendor-db`) to prevent massive bundle sizes.
- **Development Tools & Mock Data:** When including tools or scripts meant only for local testing (like database seeders or stress tests), do not manually comment/uncomment imports. Instead, wrap the import in `if (import.meta.env.DEV) { import(...) }`. This ensures Vite completely strips the dead code from the production bundle while keeping it automatically available during local development.
- **Mobile Touch Targets ("Fat Finger" Rule):** When designing interactive elements for mobile (like dropdown items or icon buttons), explicitly increase vertical/horizontal padding (e.g., `py-2.5 md:py-1.5`) to ensure the hit area is large enough for comfortable tapping, even if internal icons/text are styled compactly.
- **Pagination:** Avoid traditional table pagination. Since the app is local-first (Dexie), rely on native page scrolling for lists, and upgrade to virtualization only when rendering performance degrades.
- **Search Scope Clearance:** When navigating into a folder from a search result or breadcrumb, always explicitly clear the search query parameter (e.g., `setSearchQuery(null)`) to ensure the UI successfully exits "Search Mode" and displays the destination folder's normal contents.
- **Changelog Copywriting & Release Workflow:**
  - `PENDING_CHANGES.md` acts as a staging area for raw, atomic bullet points as features are built.
  - When migrating entries from `PENDING_CHANGES.md` to `src/data/changelog.ts` during a release, you MUST NOT copy the raw bullet points verbatim.
  - You MUST intelligently group related changes together (e.g., merge 5 small UI fixes into a single "Polished UI Details" paragraph).
  - You MUST rewrite them for users, not developers. Absolutely **NO** technical jargon (e.g., do not mention `oxlint`, `Zustand selectors`, `LCP`, `DOM`, `React Fast Refresh`, `robots.txt`).
  - Focus on the _value_ and _impact_ on the user experience (e.g., "Snappier Performance: We completely overhauled how the app renders behind the scenes").
  - Once a release is shipped and the grouped entries are added to `src/data/changelog.ts`, the historical unreleased items must be completely removed from `PENDING_CHANGES.md`.
- **Strict Markdown Rules:** Do NOT use emojis in Markdown documentation (especially `PENDING_CHANGES.md`).

## What NOT To Do

- Do not add a backend, API, or authentication.
- Do not add new npm dependencies without explicit approval.
- Do not change the color palette or fonts without approval.
- Do not add AI/ML features unless explicitly requested.
- Do not use `localStorage` for structured data — use Dexie.js.

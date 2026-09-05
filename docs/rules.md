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
- **URL State:** nuqs for URL query parameters within pages.
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
- Use Fraunces for display fonts and Geist for UI.
- Components must use shadcn/ui primitives where available.
- Custom components should follow shadcn/ui conventions (cn utility, cva variants).
- No decorative elements, illustrations, or gradients in the general UI (the Sulo mascot is an exception, used for contextual feedback, empty states, and error boundaries).

### Layout

- Compact, dense but breathable spacing.
- Single-column layout on mobile, expandable on desktop.
- File tree structure for folder/link hierarchy.
- Drag-and-drop for organization.
- No sidebar navigation — header-based navigation only.

### Interaction

- Every action should feel instant (< 100ms perceived).
- Optimistic updates — update UI before confirming write.
- Undo support for destructive actions (delete, move).
- No confirmation modals for non-destructive actions.
- Toast notifications for feedback, not alert dialogs. Always use `notify` from `src/lib/notify.ts` (powered by `goey-toast`), and never standard `sonner`.
- When positioning global overlays (like `GooeyToaster`) above persistent floating UI elements (like `BottomActionSystem`), use dynamic CSS variables (`--bottom-action-height`) powered by `ResizeObserver` instead of hard-coded offset values. Note: `sonner` enforces `--mobile-offset-bottom` on mobile viewports (< 600px), which must be explicitly overridden via a global `<style>` tag to support custom dynamic offsets on mobile.

---

## Code Rules

### File Organization

```
src/
├── components/       # Reusable UI components (App-specific global components go here)
│   └── ui/           # Strictly for external UI libraries like shadcn/ui and its registries. Never create internal/app-specific UI here.
├── constants/        # Centralized app metadata and global constants
├── features/         # Feature modules
│   └── [feature]/    # e.g., folders, items, search
│       ├── components/
│       ├── actions/
│       ├── hooks/
│       └── utils/
├── hooks/            # Global custom React hooks
├── lib/              # Global utilities, helpers, constants
├── schemas/          # Zod schemas defining core domain entities (shared between UI and DB)
├── stores/           # Zustand stores
├── db/               # Dexie.js database schema, repositories, and operations
├── types/            # Global TypeScript type definitions
└── App.tsx           # Root component
```

### Centralized App Data

- All application metadata (name, shortName, tagline, description, themeColor, keywords, author, etc.) MUST be centralized in `src/constants/app-info.ts`.
- **Do not hardcode app metadata (like the app name "Sulok") in UI components (headers, dialogs, buttons, empty states).** Always import `APP_INFO` from `src/constants/app-info.ts` and use `APP_INFO.name` or other relevant properties.
- Do not hardcode app metadata in `index.html` or `vite.config.ts`. Instead, use Vite plugins or template interpolation to inject data from this centralized file.

### Naming Conventions

- **Files:** kebab-case (`item-card.tsx`, `use-folders.ts`)
- **Components:** PascalCase (`ItemCard`, `FolderTree`)
- **Hooks:** camelCase with `use` prefix (`useFolders`, `useItems`)
- **Stores:** camelCase with `Store` suffix (`useFolderStore`, `useItemStore`)
- **Types:** PascalCase (`Folder`, `Item`, `ItemType`)
- **Constants:** SCREAMING_SNAKE_CASE (`DEFAULT_FOLDER_NAME`, `MAX_TAGS`)
- **Icons (lucide-react):** When importing icons from `lucide-react`, ALWAYS import the version with the `Icon` suffix directly instead of using the `as` alias (e.g., `import { SettingsIcon } from "lucide-react";`, NOT `import { Settings as SettingsIcon }`).

### TypeScript

- **Strict mode enabled. NEVER use `any`.**
  - This rule is strict and heavily enforced by ESLint (`@typescript-eslint/no-explicit-any`).
  - Do not use `any`, `any[]`, `Record<string, any>`, or bypass types with `as any`.
  - Use `unknown` for unpredictable structures, then type guard or narrow them.
- Use Zod schemas as the source of truth for types where possible.
- Export types from their feature module, not from a global types file.

### Import Aliases

- Always use the `@` alias for absolute imports instead of relative deep imports (e.g., `../../../`).
- The `@` symbol maps to the `src` directory (configured in both `tsconfig.app.json` and `vite.config.ts`).
- Example: Use `import { Button } from "@/components/ui/button";` instead of `import { Button } from "../../../components/ui/button";`.
- Relative imports should only be used for files within the same feature or deeply nested local folders (e.g., `./item-form` from `./item-dialog.tsx`).

### Component Patterns

- Prefer function components with hooks.
- Extract logic into custom hooks when a component exceeds ~100 lines.
- Co-locate component, hook, and types in the same feature folder.
- Use `React.memo` only when profiling shows a performance need.
- **Global Dialogs Pattern:** Do not render `<Dialog />` or `<AlertDialog />` components inside list items or looped components (e.g., placing an `AlertDialog` inside a `ItemCard` mapping over 1000 items creates 1000 hidden dialogs in the DOM). Instead, create a global store (e.g., `ConfirmationStore`) and render a single global dialog component in the app layout that opens when needed.
- **Derive State During Render:** Avoid calling `setState` synchronously within a `useEffect` to synchronize state with props or external stores, as this triggers cascading renders. Instead, derive the value during render or update it directly from the event that caused the change (e.g., `if (isOpen && activeItem !== item) setActiveItem(item);`).
- **Lazy Loading Dialogs:** When lazy loading Radix UI dialogs to reduce bundle size, do not conditionally render the component directly inside `Suspense` based on its `isOpen` state, as this immediately unmounts it on close and breaks exit animations. Instead, use a derived `hasLoaded` state flag to defer the initial download until the dialog is opened for the first time, and keep it mounted afterward so Radix can handle the exit transition.
- **Error Boundaries:** Wrap top-level routes and lazy-loaded chunks (like dialogs) with a global `ErrorBoundary` to gracefully handle chunk loading failures and render crashes. Use `react-error-boundary` to provide a functional, component-based recovery UI (via `resetErrorBoundary`) instead of forcing full-page reloads. Design fallback states to be friendly, branded (e.g., using Sulo mascot), and non-technical for end users, only exposing raw stack traces in development.
- **Empty States:** Empty states should be designed beautifully using dedicated components (e.g., `ItemEmptyState`) with illustrations/icons, clear messaging, and an actionable primary button to guide the user. Do not use plain text for empty states.
- **Skeletons (Loading States):** Do not scatter generic `<Skeleton />` components in layout files. Always co-locate loading skeletons to their parent feature, page, or component (e.g., `ItemCardSkeleton` alongside `ItemCard`).
- **Progressive Enhancement (Squircles):** We use `@toolwind/corner-shape` to implement premium iOS-style squircles. Because the native CSS `corner-shape` property is an emerging standard with limited support, ALWAYS provide a graceful fallback. Combine a standard Tailwind border-radius (e.g., `rounded-md`) with a `supports-[]` variant for the squircle radius (e.g., `supports-[corner-shape:squircle]:rounded-xl corner-squircle`). This ensures unsupported browsers get a standard rounded rectangle instead of an unintended circle.
- **Performance / Animations:** Heavy path interpolation calculations (like `flubber.combine`) must be deferred to the background (e.g., inside a `useEffect` with a `setTimeout`) and a static path rendered initially, to prevent blocking the main thread synchronously during page load.
- **Theme Initialization (FOUC):** To prevent Flash of Unstyled Content (FOUC) when hydrating themes, a synchronous inline `<script>` must exist in `index.html` to apply the initial dark/light class before React loads.
- **Recursive Timeouts:** When scheduling recursive asynchronous timeouts (e.g., organic blinking animations), always use an `isActive` boolean flag and clear all associated inner/outer timeout handles on unmount to prevent memory leaks and orphaned timer chains.
- **Vite Chunking:** When configuring `vite.config.ts`, always use `rollupOptions.output.manualChunks` as a function to logically group `node_modules` into domain-specific chunks (e.g., `vendor-react`, `vendor-db`, `vendor-ui`, `vendor-animation`) to prevent bundle size warnings (>500kB). Do not rely on a single monolithic `vendor` chunk.
- **Accessibility (ARIA):** Always use `role="alert"` for dynamically rendered error states or asynchronous fallbacks (e.g., metadata fetch failures) to ensure screen readers immediately announce them without requiring user focus.
- **Mobile Touch Targets ("Fat Finger" Rule):** When designing interactive elements for mobile (like dropdown items or icon buttons), explicitly increase vertical/horizontal padding (e.g., `py-2.5 md:py-1.5`) so the hit area remains large enough for comfortable tapping, even if the internal icons or text are styled compactly.

---

## Data Rules

### Schema

- All entities must have `id` (string, nanoid), `createdAt`, and `updatedAt` timestamps.
- Folders have a `parentId` for tree structure (null = root).
- Items belong to a folder via `folderId`.
- Tags are stored as string arrays on the item entity.
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
- Validate all input with Zod before writing to the database.

### Import/Export

- Export format is JSON.
- Exported data must be self-contained (no external references).
- Import must validate and deduplicate before inserting.

---

## Git & Workflow Rules

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- One feature per branch.
- Keep PRs small and focused.
- Update `CURRENT_STATE.md` after completing a feature.
- Update `PENDING_CHANGES.md` for user-facing changes.

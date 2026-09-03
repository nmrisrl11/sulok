# Sulok — AI Agent Rules

> These rules govern how AI agents should approach implementation, design, and decision-making when working on Sulok.

---

## Core Principles

1. **Read first.** Always read `CURRENT_STATE.md`, `DESIGN.md`, and `AGENTS.md` before making changes.
2. **Stay local-first.** All data lives in IndexedDB via Dexie.js. Never introduce server dependencies for core functionality.
3. **Ship small.** Prefer small, testable changes over large refactors.
4. **Match the system.** Follow existing patterns. Don't introduce new libraries, patterns, or abstractions without explicit approval.

---

## Technology Rules

### Stack Constraints

- **Framework:** React 19 + Vite + TypeScript. No Next.js, no Remix, no SSR.
- **Styling:** TailwindCSS v4 + shadcn/ui only. No CSS modules, no styled-components, no tailwind.config.js (use index.css @theme).
- **State:** Zustand for app state.
- **Forms:** React Hook Form + Zod for validation.
- **URL State:** nuqs for URL query parameters.
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
- No decorative elements, illustrations, or gradients in the UI (mascot is for marketing only).

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
- Toast notifications for feedback, not alert dialogs.

---

## Code Rules

### File Organization

```
src/
├── components/       # Reusable UI components (App-specific global components go here)
│   └── ui/           # Strictly for external UI libraries like shadcn/ui and its registries. Never create internal/app-specific UI here.
├── constants/        # Centralized app metadata and global constants
├── features/         # Feature modules
│   └── [feature]/    # e.g., folders, links, search
│       ├── components/
│       ├── actions/
│       ├── hooks/
│       └── utils/
├── hooks/            # Global custom React hooks
├── lib/              # Global utilities, helpers, constants
├── stores/           # Zustand stores
├── db/               # Dexie.js database schema, repositories, and operations
├── types/            # Global TypeScript type definitions
└── App.tsx           # Root component
```

### Centralized App Data

- All application metadata (name, shortName, tagline, description, themeColor, keywords, author, etc.) MUST be centralized in `src/constants/app-info.ts`.
- Do not hardcode app metadata in `index.html` or `vite.config.ts`. Instead, use Vite plugins or template interpolation to inject data from this centralized file across the application.

### Naming Conventions

- **Files:** kebab-case (`link-card.tsx`, `use-folders.ts`)
- **Components:** PascalCase (`LinkCard`, `FolderTree`)
- **Hooks:** camelCase with `use` prefix (`useFolders`, `useLinks`)
- **Stores:** camelCase with `Store` suffix (`useFolderStore`, `useLinkStore`)
- **Types:** PascalCase (`Folder`, `Link`, `BookmarkType`)
- **Constants:** SCREAMING_SNAKE_CASE (`DEFAULT_FOLDER_NAME`, `MAX_TAGS`)
- **Icons (lucide-react):** When importing icons from `lucide-react`, ALWAYS import the version with the `Icon` suffix directly instead of using the `as` alias (e.g., `import { SettingsIcon } from "lucide-react";`, NOT `import { Settings as SettingsIcon }`).

### TypeScript

- Strict mode enabled. No `any` types.
- Use Zod schemas as the source of truth for types where possible.
- Export types from their feature module, not from a global types file.

### Import Aliases

- Always use the `@` alias for absolute imports instead of relative deep imports (e.g., `../../../`).
- The `@` symbol maps to the `src` directory (configured in both `tsconfig.app.json` and `vite.config.ts`).
- Example: Use `import { Button } from "@/components/ui/button";` instead of `import { Button } from "../../../components/ui/button";`.
- Relative imports should only be used for files within the same feature or deeply nested local folders (e.g., `./bookmark-form` from `./bookmark-dialog.tsx`).

### Component Patterns

- Prefer function components with hooks.
- Extract logic into custom hooks when a component exceeds ~100 lines.
- Co-locate component, hook, and types in the same feature folder.
- Use `React.memo` only when profiling shows a performance need.
- **Global Dialogs Pattern:** Do not render `<Dialog />` or `<AlertDialog />` components inside list items or looped components (e.g., placing an `AlertDialog` inside a `LinkCard` mapping over 1000 items creates 1000 hidden dialogs in the DOM). Instead, create a global store (e.g., `ConfirmationStore`) and render a single global dialog component in the app layout that opens when needed.

---

## Data Rules

### Schema

- All entities must have `id` (string, nanoid), `createdAt`, and `updatedAt` timestamps.
- Folders have a `parentId` for tree structure (null = root).
- Links belong to a folder via `folderId`.
- Tags are stored as string arrays on the link entity.
- Sort order is maintained via an `order` field (number).

### Repository Pattern

- Abstract all database operations into a centralized repository object (e.g., `BookmarkRepository`, `FolderRepository`).
- A repository acts as the single source of truth for interacting with Dexie.js for a specific entity.
- Do NOT make direct Dexie.js (`db.bookmarks.put(...)`) calls inside React components, hooks, or Zustand stores.
- Repositories should handle:
  - Basic CRUD operations (`getAll`, `getById`, `save`, `update`, `delete`).
  - Bulk operations (`bulkSave`, `bulkDelete`).
  - Mapping or parsing incoming models into database records if they differ (e.g., extracting domain from a URL).
  - Executing internal transactions when multiple collections are affected (e.g., deleting a folder and cascading deletes to its links).
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

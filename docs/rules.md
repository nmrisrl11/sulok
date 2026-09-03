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
├── components/       # Reusable UI components
│   └── ui/           # shadcn/ui primitives
├── features/         # Feature modules (folders, links, search)
├── hooks/            # Custom React hooks
├── lib/              # Utilities, helpers, constants
├── stores/           # Zustand stores
├── db/               # Dexie.js database schema and operations
├── types/            # TypeScript type definitions
└── App.tsx           # Root component
```

### Naming Conventions

- **Files:** kebab-case (`link-card.tsx`, `use-folders.ts`)
- **Components:** PascalCase (`LinkCard`, `FolderTree`)
- **Hooks:** camelCase with `use` prefix (`useFolders`, `useLinks`)
- **Stores:** camelCase with `Store` suffix (`useFolderStore`, `useLinkStore`)
- **Types:** PascalCase (`Folder`, `Link`, `BookmarkType`)
- **Constants:** SCREAMING_SNAKE_CASE (`DEFAULT_FOLDER_NAME`, `MAX_TAGS`)

### TypeScript

- Strict mode enabled. No `any` types.
- Use Zod schemas as the source of truth for types where possible.
- Export types from their feature module, not from a global types file.

### Component Patterns

- Prefer function components with hooks.
- Extract logic into custom hooks when a component exceeds ~100 lines.
- Co-locate component, hook, and types in the same feature folder.
- Use `React.memo` only when profiling shows a performance need.

---

## Data Rules

### Schema

- All entities must have `id` (string, nanoid), `createdAt`, and `updatedAt` timestamps.
- Folders have a `parentId` for tree structure (null = root).
- Links belong to a folder via `folderId`.
- Tags are stored as string arrays on the link entity.
- Sort order is maintained via an `order` field (number).

### Operations

- All CRUD operations go through Dexie.js.
- Wrap multi-step operations in Dexie transactions.
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

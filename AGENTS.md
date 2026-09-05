# AGENTS.md — Sulok

> Instructions for AI agents working on this project.

## Project Overview

**Sulok** is a personal web library — a local-first app for saving, organizing, and rediscovering bookmarks/links from the web.

- **Tagline:** Your corner of the web.
- **Stack:** React 19 + Vite + TypeScript + TailwindCSS v4 + shadcn/ui + Zustand + Dexie.js
- **Architecture:** Local-first, no backend, IndexedDB storage, PWA-capable
- **Deployment:** Vercel (sulok.vercel.app)

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

The app is a single-page React application. Uses `react-router-dom` for application routing (`/`, `/about`, etc). Use URL query params (via nuqs) for search/filter state.

## File Structure

```
sulok/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/      # App layout, header, footer
│   │   └── ui/          # shadcn/ui components
│   ├── features/
│   │   ├── folders/     # Folder CRUD, tree, drag-drop
│   │   ├── items/       # Item CRUD, cards, list (formerly links)
│   │   └── search/      # Search, filter, sort
│   ├── pages/
│   │   ├── home/
│   │   ├── about/
│   │   └── not-found/
│   ├── hooks/
│   ├── lib/
│   ├── schemas/         # Zod schemas (domain)
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
- Use `cn()` utility for conditional class merging.
- Zustand stores use the slice pattern if they grow beyond ~50 lines.
- **Data Layer:** Dexie operations must be abstracted into a Repository object in `src/db/repositories/` (e.g., `ItemRepository`). Never call IndexedDB or `db` directly from a component or store.
- **Strict TypeScript:** The project strictly enforces `@typescript-eslint/no-explicit-any`. NEVER use `any`. Use `unknown` and type guard it if necessary.
- **React Imports:** Always use named imports for React hooks (e.g., `import { useState, useEffect } from "react";`) rather than namespace imports (`React.useState`). This ensures consistency across the codebase.
- **Import Aliases:** Always use the `@` alias for absolute imports instead of relative deep imports (e.g., `../../../`).
- **Icons (lucide-react):** When importing icons from `lucide-react`, ALWAYS import the version with the `Icon` suffix directly instead of using the `as` alias (e.g., `import { SettingsIcon } from "lucide-react";`, NOT `import { Settings as SettingsIcon }`).
- **Global Dialogs Pattern:** Do not render `<Dialog />` or `<AlertDialog />` components inside list items or looped components. Instead, create a global store (e.g., `ConfirmationStore`) and render a single global dialog component in the app layout that opens when needed.
- **Derive State During Render (React Compiler Strictness):** Avoid calling `setState` synchronously within a `useEffect` to synchronize state or initialize values that can be derived during render (e.g., reading from `window` or `navigator`). Doing so triggers cascading renders and causes React Compiler to skip optimization. Derive the value directly during render instead.
- **Centralized Metadata:** Do not hardcode app names or URLs in UI components. Always use `APP_INFO` from `src/constants/app-info.ts` (e.g. `APP_INFO.name`, `APP_INFO.appUrl`).
- **Skeletons & Empty States:** Co-locate loading skeletons with their respective components. Use dedicated beautifully designed components for empty states rather than plain text. Use route-specific fallbacks (e.g., `HomeRouteFallback`, `AboutSkeleton`) wrapped in `<Suspense>` per route, rather than generic loading labels. Avoid layout flashes by handling loading states centrally at the route component level.
- **Scrollbars:** Always use the `.custom-scrollbar` class on any scrollable container (e.g., `overflow-y-auto`) to ensure a consistent, branded scrollbar styling across the application.
- **Notifications:** Do not use `sonner` or shadcn's `useToast` directly. Always use the `notify` utility from `src/lib/notify.ts` which wraps `goey-toast` for fluid, animated notifications.
- **Floating UI Coordination:** When positioning global overlays (like `GooeyToaster`) above persistent floating UI elements (like `BottomActionSystem`), use dynamic CSS variables (`--bottom-action-height`) powered by `ResizeObserver` instead of hard-coded offset values. Note: `sonner` enforces `--mobile-offset-bottom` on mobile viewports (< 600px), which must be explicitly overridden via a global `<style>` tag to support custom dynamic offsets on mobile.
- **Safe Area Insets:** When building fixed UI elements anchored to the bottom (like the `BottomActionSystem`), always incorporate `env(safe-area-inset-bottom)` into their positioning. The main app layout (`AppLayout`) ensures scrollable content isn't obscured by providing safe bottom padding on mobile viewports.
- **Glassmorphism:** Bottom floating action bars use a glassmorphic effect (`bg-card/80 backdrop-blur-md`) to blend smoothly with scrolling content.
- **Route-Specific State Cleanup:** Always clear contextual global state (like `selectedIds` for bulk actions) when the associated page component (e.g., `HomePage`) unmounts to prevent UI components from persisting improperly across different routes.
- Favicon fetching: `https://www.google.com/s2/favicons?domain=[origin]&sz=64` (use the full origin, e.g. `https://domain.com`, to ensure it resolves modern PaaS deployments properly).
- Metadata fetching: Uses `api.ogfetch.com` for robust open-graph metadata preview.
- **Vite Chunking:** Always use `rollupOptions.output.manualChunks` as a function in `vite.config.ts` to logically group dependencies into domain-specific chunks (e.g., `vendor-react`, `vendor-db`) to prevent massive bundle sizes.
- **Mobile Touch Targets ("Fat Finger" Rule):** When designing interactive elements for mobile (like dropdown items or icon buttons), explicitly increase vertical/horizontal padding (e.g., `py-2.5 md:py-1.5`) to ensure the hit area is large enough for comfortable tapping, even if internal icons/text are styled compactly.
- **Pagination:** Avoid traditional table pagination. Since the app is local-first (Dexie), rely on native page scrolling for lists, and upgrade to virtualization only when rendering performance degrades.

## What NOT To Do

- Do not add a backend, API, or authentication.
- Do not add new npm dependencies without explicit approval.
- Do not change the color palette or fonts without approval.
- Do not add a sidebar layout. The app uses a header + content layout.
- Do not add AI/ML features unless explicitly requested.
- Do not use `localStorage` for structured data — use Dexie.js.

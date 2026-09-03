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
- **Import Aliases:** Always use the `@` alias for absolute imports instead of relative deep imports (e.g., `../../../`).
- **Icons (lucide-react):** When importing icons from `lucide-react`, ALWAYS import the version with the `Icon` suffix directly instead of using the `as` alias (e.g., `import { SettingsIcon } from "lucide-react";`, NOT `import { Settings as SettingsIcon }`).
- **Global Dialogs Pattern:** Do not render `<Dialog />` or `<AlertDialog />` components inside list items or looped components. Instead, create a global store (e.g., `ConfirmationStore`) and render a single global dialog component in the app layout that opens when needed.
- **Centralized Metadata:** Do not hardcode app names or URLs in UI components. Always use `APP_INFO` from `src/constants/app-info.ts` (e.g. `APP_INFO.name`, `APP_INFO.appUrl`).
- **Skeletons & Empty States:** Co-locate loading skeletons with their respective components. Use dedicated beautifully designed components for empty states rather than plain text.
- Favicon fetching: `https://www.google.com/s2/favicons?domain=[domain]&sz=64`
- Metadata fetching: Uses `microlink.io` for robust open-graph metadata preview.

## What NOT To Do

- Do not add a backend, API, or authentication.
- Do not add new npm dependencies without explicit approval.
- Do not change the color palette or fonts without approval.
- Do not add a sidebar layout. The app uses a header + content layout.
- Do not add AI/ML features unless explicitly requested.
- Do not use `localStorage` for structured data — use Dexie.js.

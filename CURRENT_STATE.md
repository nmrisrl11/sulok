# CURRENT_STATE.md — Sulok

> Last updated: 2026-09-03

## Project Status: 🟡 Pre-Development

The project is in the **brand foundation and documentation phase**.

---

## What Exists

- [x] Brand name finalized: **Sulok**
- [x] Brand identity documented (`docs/brand.md`)
- [x] Design system documented (`DESIGN.md`)
- [x] AI agent rules documented (`docs/rules.md`, `AGENTS.md`)
- [x] Changelog structure established (`PENDING_CHANGES.md`)
- [x] Repository created
- [x] Vite + React 19 + TypeScript project initialized
- [x] TailwindCSS v4 + shadcn/ui configured
- [x] Basic layout implemented (simplified single-column MVP)
- [ ] Dexie.js database schema defined
- [ ] Zustand stores scaffolded
- [ ] PWA configured

---

## Current Phase: Setup

### Next Steps

1. Set up centralized app metadata (`src/constants/app-info.ts`) and integrate with `index.html`/Vite.
2. Set up Dexie.js with initial schema (links)
3. Connect the simplified UI to Dexie.js for saving, reading, and deleting links.
4. Implement folder CRUD (post-MVP)
5. Implement link tags and search

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│           React 19 + Vite           │
│  ┌──────────┐  ┌────────────────┐  │
│  │ Zustand   │  │ React Hook     │  │
│  │ (State)   │  │ Form + Zod     │  │
│  └────┬──────┘  └───────┬────────┘  │
│       │                 │           │
│  ┌────▼─────────────────▼────────┐  │
│  │         Dexie.js              │  │
│  │      (Data Layer)             │  │
│  └────────────┬──────────────────┘  │
│               │                     │
│  ┌────────────▼──────────────────┐  │
│  │        IndexedDB              │  │
│  │     (Browser Storage)         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Feature Roadmap

### Phase 1 — Core (Current)

- Folder CRUD (tree structure)
- Link CRUD (save, edit, delete)
- Drag-and-drop organization
- Open / Copy link buttons
- Search, sort, filter, pagination
- Bookmark type, tags, categories
- Favicon fetching
- Import/Export JSON
- Responsive/mobile UI
- PWA/offline support

### Phase 2 — Browser Extension

- Chrome extension for quick save
- "Save to Sulok" button
- Popup with folder selector

### Phase 3 — Device Sync

- P2P sync via WebRTC + Peer.js
- No server required
- Device discovery and pairing

---

## Known Decisions

| Decision         | Choice                         | Rationale                                                      |
| ---------------- | ------------------------------ | -------------------------------------------------------------- |
| Data storage     | IndexedDB + Dexie.js           | Local-first, offline-capable, no backend                       |
| State management | Zustand                        | Minimal, performant, TypeScript-friendly                       |
| UI framework     | shadcn/ui                      | Composable, accessible, customizable                           |
| Styling          | TailwindCSS v4                 | Utility-first, fast iteration, modern CSS variables via @theme |
| Routing          | None (SPA, nuqs for URL state) | Simplicity — single page is sufficient                         |
| Auth             | None                           | Personal-use app, no accounts                                  |
| Backend          | None                           | Local-first architecture                                       |

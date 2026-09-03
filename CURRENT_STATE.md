# CURRENT_STATE.md — Sulok

> Last updated: 2026-09-03

## Project Status: 🟢 Development

The project is currently in the **core features implementation phase**.

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
- [x] Dexie.js database schema defined and Repository Pattern implemented
- [x] Zustand stores scaffolded (Bookmark and Confirmation stores)
- [x] Link CRUD (Create, Read, Update, Delete) integrated with Dexie
- [ ] PWA configured

---

## Current Phase: Core Development

### Next Steps

1. Implement folder CRUD (post-MVP)
2. Implement link tags, categories, search, and filter capabilities.
3. Hook up Import/Export JSON functionality.
4. Finalize overall UI polish for mobile responsiveness.

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
│  │      Dexie Repository         │  │
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

- [ ] Folder CRUD (tree structure)
- [x] Link CRUD (save, edit, delete)
- [ ] Drag-and-drop organization
- [x] Open / Copy link buttons
- [ ] Search, sort, filter, pagination
- [ ] Bookmark type, tags, categories
- [x] Favicon fetching
- [ ] Import/Export JSON
- [ ] Responsive/mobile UI
- [ ] PWA/offline support

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

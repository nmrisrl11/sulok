# Sulok

> **Your corner of the web.**

Sulok is a beautifully designed, local-first personal web library for saving, organizing, and rediscovering the links and bookmarks you find on the internet.

---

## 📖 About the App

**Sulok** (pronounced _SOO-lok_) is the Tagalog word for "corner".

The web is vast, noisy, and constantly changing. Sulok is designed to be your quiet, organized space—a personal corner where you can intentionally curate the things that matter to you.

Our philosophy is simple: **Your data belongs to you.** Sulok is a true local-first application. There is no backend, no cloud database, and no account required. Everything you save lives entirely on your device.

---

## ✨ Features

- **📂 Folder Organization**: Keep your links organized in a clean, hierarchical file tree structure.
- **📝 Item Management**: Save, edit, and delete links with auto-fetched metadata (titles, descriptions, and images).
- **🎨 Beautiful UI**: A highly polished, responsive design featuring iOS-style squircle corners, fluid animations, and custom scrollbars.
- **🌓 Theme Support**: Seamless switching between Dark and Light modes.
- **⚡ Local-First**: Lightning-fast operations powered by IndexedDB.
- **🌐 Offline Capable**: Designed to work offline for local data and existing items (metadata fetching requires network access; PWA support coming soon).
- **🎉 Sulo Mascot**: A responsive, interactive brand mascot that reacts to your actions throughout the app.

---

## 🔒 Privacy & Data Philosophy

Sulok is built on a **local-first architecture**.

- **No Accounts:** You don't need to sign up or log in.
- **No Cloud Database:** We don't store your bookmarks on our servers. In fact, we don't have servers.
- **Browser Storage:** Folders and items are saved locally on your device using IndexedDB, while theme and settings use localStorage.
- **External Requests:** The app fetches link metadata (via `microlink.io`) when adding a new item, and requests favicons (via Google's Favicon API) whenever an item card renders.

_Note: Device synchronization and Import/Export capabilities are planned for future releases to help you securely move your data between devices._

---

## 🛠️ Tech Stack

Sulok is built with modern, performant, and type-safe web technologies.

**Frontend & Framework**

- **React 19**
- **TypeScript**
- **Vite**

**UI & Styling**

- **TailwindCSS v4** (Utility-first styling)
- **shadcn/ui** (Accessible component primitives)
- **Framer Motion & Flubber** (Fluid animations and SVG path morphing)

**Architecture & State**

- **React Router DOM v7** (Application routing)
- **Zustand** (Global state management)
- **React Hook Form & Zod** (Form validation)

**Data & Storage**

- **IndexedDB & Dexie.js** (Local database)

**Tooling**

- **Oxlint & Oxc Formatter** (Extremely fast linting and formatting)

---

## 🏗️ Architecture & Project Structure

Sulok enforces a scalable, modular architecture with strict boundaries between the UI and the data layer.

```text
src/
├── components/       # Global App UI (layout, branding, mascots)
│   └── ui/           # Generic shadcn/ui primitive components
├── constants/        # Centralized app configuration (APP_INFO)
├── db/               # Dexie.js setup and Repository pattern (Data Layer)
├── features/         # Domain-specific modules (items, folders, search)
├── pages/            # Routable page components (Home, About)
├── schemas/          # Zod validation schemas for core entities
├── stores/           # Zustand global state
└── App.tsx           # Router and Theme Provider root
```

**Key Conventions:**

- **Repository Pattern:** React components never query the database directly. All Dexie operations are abstracted into `Repositories` inside `src/db/`.
- **Feature-driven:** Logic is grouped by feature (`src/features/items/`) rather than by file type.

---

## 🤖 Documentation for AI Agents

Are you an AI agent assisting a developer with this repository? **Stop and read the internal documentation first.**

Sulok has a highly structured set of rules, design guidelines, and architectural decisions that you **must** follow. Do not invent patterns or dependencies.

Before modifying code, read:

- `.agents/workflows/load-project-context.md` (Workflow for loading context)
- `AGENTS.md` (Agent-specific rules and instructions)
- `docs/rules.md` (Strict implementation constraints)
- `DESIGN.md` (Brand, colors, and UI conventions)
- `CURRENT_STATE.md` (What is currently built)
- `PENDING_CHANGES.md` (Work queued or planned for the next release)

---

## 💻 Development

Want to run Sulok locally? Follow these steps:

**1. Install Dependencies**

```bash
npm install
```

**2. Start the Development Server**

```bash
npm run dev
```

**3. Build for Production**

```bash
npm run build
```

**4. Preview Production Build**

```bash
npm run preview
```

**Code Quality Commands**

- Lint the codebase: `npm run lint`
- Format the codebase: `npm run format`
- Check formatting: `npm run format:check`

_(No `.env` file is required to run the application locally.)_

---

## 🔮 Roadmap

We are currently focused on completing Phase 1 of our roadmap. Future plans include:

- Drag-and-drop folder organization
- Advanced search, sorting, and tag filtering
- Import/Export functionality via JSON
- Full Progressive Web App (PWA) installation support
- Chrome Extension for quick-saving
- Peer-to-peer (WebRTC) device synchronization without a backend

_(Check `CURRENT_STATE.md` for detailed tracking)._

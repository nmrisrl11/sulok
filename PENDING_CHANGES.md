# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

- 🔧 Enforced zero-tolerance strict production builds by configuring `oxlint` to block on warnings, strictly banning `any` and `@ts-ignore`, enforcing `verbatimModuleSyntax`, and refactoring exports for robust React Fast Refresh.
- ✨ Added a dedicated Settings page with a tabbed layout, replacing the old Settings Sheet.
- ✨ Added interactive UI sound effects (powered by cuelume), configurable in the Sound FX settings.
- 💄 Redesigned the Data & Backup section with modern, premium cards for Export and Restore functionality.
- ✨ Made the Quick Link Action Bar an expandable Floating Action Button (FAB) to reduce visual clutter. Expands via click, `Ctrl+K`, or `Ctrl+V`.
- ✨ Added Data Import/Export functionality with JSON, CSV, and TXT support (including human-readable dates).
- ✨ Switched UI font to Manrope for improved optical alignment and cleaner metrics.
- ✨ Added Action Bar with Search and Sort controls to the Home page.
- 🔧 Replaced "links" terminology with "items" across the application to consistently reflect the product's branding.
- 🔧 Replaced native WebKit search cancel button with a custom branded clear button.
- 🐛 Fixed "Select All" checkbox to accurately select only the currently visible items when search filters are active.
- ⚡ Optimized initial load performance (LCP) and fixed layout shifts.
- 🔧 Improved UX by hiding search and sort controls when the library is completely empty.
- 🌐 Added SEO and Agentic Browsing foundations (`robots.txt`, `sitemap.xml`, and `llms.txt`).
- 🐛 Fixed Sulo incorrectly cheering when deleting items by introducing a `hideReaction` toast option.
- 🐛 Improved duplicate link detection by fuzzy-matching URLs to ignore `www.` prefixes and trailing slashes.
- 🐛 Fixed a bug where the site title and description were not correctly saved for new items.
- 🐛 Fixed `ItemRepository` to preserve custom ports when normalizing URLs for duplicate detection, and enforced uniqueness atomically during database transactions.
- 🐛 Fixed an issue in `ItemForm` where explicitly clearing the title or description would incorrectly revert to the original metadata upon save.
- 💄 Updated item cards to use a sleek monospace font for URLs.
- ♿ Improved keyboard accessibility for the collapsed Quick Link Action Bar (FAB) to support focus and Enter/Space activation.
- 🐛 Fixed race condition in Data Backup import preview where rapid file selections could result in incorrect data rendering.
- 🐛 Fixed Radix UI style selectors (`slider`, `switch`, `select`) in Tailwind v4 to properly target state data attributes (`data-[state=...]`).
- 🐛 Fixed header navigation active state styling by properly using `useLocation` with `Button asChild`.
- 🧹 Cleaned up unused `shadcn/ui` components (`alert`, `card`, `sheet`, `textarea`), legacy scripts, and unused dependencies.

---

## Changelog Format

```markdown
## [version] — YYYY-MM-DD

### ✨ Added

- New feature description

### 🔧 Changed

- Changed behavior description

### 🐛 Fixed

- Bug fix description

### 🗑️ Removed

- Removed feature description
```

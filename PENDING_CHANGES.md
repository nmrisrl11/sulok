# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added bespoke `MergeIcon` for mixing/separating data view modes.

### Changed

- Completely redesigned the `HomePage` layout to a single-column layout, transforming the `ExplorerSidebar` into horizontal navigation tabs alongside the header.
- Refined the `ExplorerToolbar` responsive layout (3-row grid on mobile) and enhanced the squircle border-radius computation for perfect nesting.
- Reorganized all custom SVG icons in `src/components/icons` into logical domain subdirectories (e.g. `/actions`, `/folders`, `/view`) utilizing a unified barrel export.
- Re-integrated the Quick Customize button (sparkles icon) directly into the main navigation header for a cohesive layout.
- Removed aggressive engraved shadow effects from Settings cards and About page, reverting to a cleaner, subtle shadow.
- Enhanced breadcrumbs layout to intelligently display up to 6 items on desktop while maintaining a compact 3-item view on mobile.
- Updated the empty state UI for search/filter operations to use a bespoke "Lost in your corner?" message with a Clear Filters button.
- Disabled native browser autocomplete, autocorrect, and spellcheck on the Explorer search input to prevent annoying suggestions overlapping the UI.
- Rewrote the naming collision engine (used when creating, renaming, moving, and restoring folders or links) to behave like a native operating system. It now intelligently extracts numerical suffixes (e.g. `Test (1)`) and increments them correctly to `Test (2)`, rather than blindly stacking counters like `Test (1) (1)`.

### Fixed

- Fixed a significant performance lag when navigating settings tabs (specifically Sound FX and Sulo Customization) by optimizing how Radix UI dropdown menus render their internal items.
- Fixed a bug where the Explorer toolbar would completely disappear (preventing users from clearing filters) if an active type filter resulted in 0 items.

### Removed

---

## Changelog Format

```markdown
### Added

- New feature description

### Changed

- Changed behavior description

### Fixed

- Bug fix description

### Removed

- Removed feature description
```

# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added robust drag-and-drop organization allowing you to effortlessly move individual links, folders, or bulk selections directly into other folders or via the breadcrumb navigation.
- Added an interactive onboarding tour for new users to explain the app's layout and core features.
- Added a default "Welcome to Sulok" folder and sample link for new users to explore.
- Improved the initial loading experience to feel seamless and prevent jarring empty screens when the app first opens.
- Added an intelligent "Go to link" action button when attempting to save a duplicate link, instantly navigating to its existing folder.
- Added a "Restore" action button when attempting to save a link that is currently in the recycle bin.
- Added clickable folder badges to items displayed during search, allowing users to jump directly to the item's location.
- Added bespoke `MergeIcon` for mixing/separating data view modes.

### Changed

- Standardized the "Restart App Tour" settings card to use the unified `ResetButton` component and match the layout of other settings sections.
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

- Fixed an issue where navigating away from the home page during the onboarding tour would cause the app to crash; the tour now gracefully pauses on other pages.
- Fixed an issue where restarting the tour from the Settings page wouldn't bring you back to the home page to start the tour properly.
- Fixed an issue where an empty screen would briefly flash when the app finishes setting up your default data.
- Fixed an issue where restoring deleted items from the Recycle Bin would sometimes cause an error.
- Dramatically improved scrolling and clicking performance in the main library by optimizing how folders and links update on the screen.
- Fixed a significant performance lag when navigating settings tabs (specifically Sound FX and Sulo Customization) by optimizing how Radix UI dropdown menus render their internal items.
- Fixed a bug where the Explorer toolbar would completely disappear (preventing users from clearing filters) if an active type filter resulted in 0 items.
- Fixed accessibility warnings (missing aria-labels and invalid heading hierarchies) to ensure the app remains fully screen-reader friendly.
- Fixed an issue where the drag-and-drop system lacked keyboard accessibility and sometimes conflicted with nested button clicks.
- Fixed a bug that allowed users to move a folder into itself or its subfolders, which could corrupt the folder structure.

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

# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Redesigned the Empty State screens for the Library, Favorites, and Recycle Bin to feature a sleeker, more sophisticated card layout with refined copywriting and clear calls-to-action ("Add to your corner").
- Redesigned the main navigation sidebar for mobile devices. It now transforms into a sleek, horizontal pill layout that smoothly sticks to the top of the screen as you scroll, complete with a beautiful frosted glass effect.
- Brought complete feature parity to the Grid View mode. You can now individually select folders and links using checkboxes, and access all actions (Favorite, Edit, Delete, Move, etc.) via new three-dot dropdown menus right from the grid.
- Grid View now beautifully displays the real website favicons for your saved links instead of a generic placeholder.
- Added a completely new, bespoke two-tone Folder Icon SVG that replaces the generic folder icon across the app. This new icon is built with dynamic CSS variables, paving the way for future custom folder colors and themes!
- Added the ability to instantly Favorite or Unfavorite folders and links directly from the list view.
- Added support for bulk favoriting or unfavoriting multiple items at once using the bulk action bar.
- Added a Quick Customize side sheet (accessible globally via `Shift + C`) to instantly tweak themes, sounds, and mascot settings without leaving your current view.
- Added new curated Workspace Themes (Sepia, Sand, Midnight, Mocha) to fully personalize the lighting environment.

### Changed

- Enhanced the Undo notification with a smooth morphing animation and contextual feedback (e.g., "Folder restored" or "Link restored") when restoring items from the Recycle Bin.

- The search bar now finds everything across your entire corner of the web, not just the folder you're currently viewing. Search is also heavily optimized behind the scenes for snappier performance.
- Sorting options (like Name or Date Added) now intelligently group Folders and Links separately, making it much easier to scan and organize your content.
- When you add a new link from an empty folder, it now intelligently saves directly into that folder instead of going to your unorganized space.
- The bulk action bar is now strictly contextual, appearing only on the main explorer views and automatically clearing your selections when switching between spaces (like moving from Library to Favorites).
- Redesigned the Empty Folder state to clarify that you can add both links and subfolders, adding a new quick-action button specifically for creating folders.
- Automatically hides the Search and View Mode options in the toolbar when your Library or Favorites are completely empty, keeping the interface clean and focused.
- Increased the spacing between items and folders in the main list view for a more breathable, easier-to-read layout.

- Redesigned the "Move to..." dialog to use an intuitive drill-down navigation system with interactive breadcrumb trails, making it much easier to move items deep into nested folders.
- Prevented text overflow on mobile by strictly truncating lengthy file paths and labels within the breadcrumb navigation.
- Improved breadcrumb navigation across the main explorer and dialogs for a clearer, more consistent experience when navigating through deep folder structures.
- Implemented barrel files (`index.ts`) for the `stores`, `hooks`, and `schemas` directories to centralize public APIs, clean up imports project-wide, and prevent circular dependencies.
- Refactored multiple actions (deleting, restoring, moving) to use a unified and more reliable background process, ensuring items and folders are handled seamlessly together.
- When you are in the Recycle Bin, tapping or clicking any item now safely selects it instead of accidentally opening the link or navigating into the folder.
- Checkboxes on your links and folders are now permanently visible on mobile devices, making them much easier to tap.
- Redesigned the Workspace Theme selection UI in the Appearance settings to be more compact and user-friendly across all devices.
- Improved accessibility for the Accent Color picker by providing explicit labels for screen readers.
- Refactored all internal UI components to strictly use named React imports, ensuring cleaner code and full compatibility with modern TypeScript build tools.
- Redesigned the Explorer Toolbar for a cleaner aesthetic, separating the breadcrumb header from the search/sort utility pill.
- Enhanced breadcrumb context to treat Favorites and Recycle Bin as independent top-level views rather than sub-folders of the Library, complete with explicit labels and corresponding icons.
- Redesigned the hover action menus on desktop to group all item and folder controls inside a sleek, frosted pill container for a premium feel.
- Cleaned up the mobile dropdown menus by removing unnecessary horizontal separators, reducing visual noise.
- Replaced generic action icons (Trash, Edit, Copy, External Link, Favorites) across the application with bespoke SVG designs to provide a more unified, branded visual language.
- Streamlined the application by removing unused interface components and unused animation libraries, reducing the bundle size and improving overall app performance.

### Fixed

- Fixed an issue that caused the entire page to scroll awkwardly on smaller screens, keeping your main navigation comfortably in view while you scroll through your items.
- Fixed a visual glitch where the highlighted selection border around items and folders would appear cut off at the edges.

- Fixed an issue where clicking into a favorited folder from the Favorites view incorrectly hid its contents unless they were also individually favorited.
- Fixed a visual glitch in the "Move to..." dialog where it would briefly display "No folders here" before finishing loading the folders.
- Fixed keyboard accessibility styling on the breadcrumb dropdown menus to properly show a focus ring.
- Fixed a visual glitch where the Quick Link action bar would rapidly stretch across the entire screen when repeatedly opened and closed.
- Fixed a "Flash of Unstyled Content" (FOUC) issue where the screen would briefly flash white before applying custom dark themes like Mocha or Midnight on initial load.
- Fixed a visual bug where the outer selection ring of the Accent Color picker was being clipped at the edges of the settings accordion.
- Fixed an issue where the `Shift + C` Quick Customize shortcut would accidentally trigger while typing in rich text editors or content-editable areas.
- Fixed an issue where moving or managing subfolders from the Favorites view could behave inconsistently.
- Fixed keyboard accessibility bugs that prevented users from navigating the folder list using the keyboard inside the Move to... dialog.
- Fixed a visual glitch where dialog titles wouldn't update smoothly when switching between creating new folders and renaming existing ones.

### Removed

- Removed the legacy light/dark mode toggle from the navigation bar to prevent conflicts with the new custom Workspace Themes.

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

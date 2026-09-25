# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Changed

- Polished Settings UI: Upgraded Theme and Interface layout controls with beautifully animated segmented buttons, replacing standard dropdowns for a more premium feel.
- Quick Customize UI: Upgraded the Quick Customize side panel to use the responsive Drawer component with space-efficient accordion sections, perfectly aligning its aesthetic and animations with the rest of the application. Reordered sections logically (Appearance > Sound FX > Sulo Customization) and improved Sound FX responsiveness.
- Sulo Customization: Redesigned the Expressions and Whispers settings to match the premium, cohesive card layout used in the rest of the app. Simplified the Quick Customize Drawer by replacing the complex Whispers form with a smooth deep-link that automatically scrolls to the Whispers section in the main Settings page.
- Data & Storage UI: Redesigned the Data & Storage settings layout to match the premium, cohesive card layout used across other settings tabs, and improved responsive text scaling.
- Settings Architecture: Code-split and modularized the Appearance, Sound FX, Sulo Customization, and Data & Storage settings sections into dedicated, isolated component folders (using an `index.tsx` convention and `controls.ts` for reusing base inputs) for better maintainability. Furthermore, heavy components like the Import Preview Dialog are now lazily loaded to reduce the initial bundle size.
- Accessibility: Updated settings toggles to use native Label components, properly generated unique IDs via `useId()`, and added accessible names to reset buttons and dropdown triggers for improved screen reader support.
- Folder Customization: Added new preset, complementary, and custom folder color options to further personalize your workspace.
- Development: Deep relative imports (`../../`) are now strictly banned in the codebase by a custom `oxlint` rule to enforce clean absolute `@/` import boundaries.

### Fixed

- Settings Layout Shifts: Fixed a layout shift issue where the initial loading skeleton for the Settings page did not correctly mirror the new modular tab architecture and card layout.
- Sulo Customization: Fixed a bug where resetting Sulo Whispers or global settings wouldn't immediately clear unsaved edits from the form.
- Folder Customization: Fixed a bug where edits made in the Quick Customize Drawer's color picker would sometimes inherit or overwrite the hidden color picker's value in the main Settings page due to colliding DOM element IDs.
- Accessibility: Fixed missing ARIA labels on Sulo Expressions dropdown controls, compact accent preset buttons, and workspace theme buttons. Ensured Reset buttons properly announce their specific target settings.

### Removed

- Cleaned up unused UI components (`sheet.tsx` and `item-empty-state.tsx`) to reduce bundle size and keep the UI registry clean.

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

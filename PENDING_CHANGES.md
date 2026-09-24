# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Changed

- Polished Settings UI: Upgraded Theme and Interface layout controls with beautifully animated segmented buttons, replacing standard dropdowns for a more premium feel.
- Sulo Customization: Redesigned the Expressions and Whispers settings to match the premium, cohesive card layout used in the rest of the app.
- Settings Architecture: Code-split and modularized the Appearance, Sound FX, and Sulo Customization settings sections into dedicated, isolated component folders (using an `index.tsx` convention) for better maintainability.
- Accessibility: Updated settings toggles to use native Label components, properly generated unique IDs via `useId()`, and added accessible names to reset buttons and dropdown triggers for improved screen reader support.
- Folder Customization: Added new preset, complementary, and custom folder color options to further personalize your workspace.
- Development: Deep relative imports (`../../`) are now strictly banned in the codebase by a custom `oxlint` rule to enforce clean absolute `@/` import boundaries.

### Fixed

- Sulo Customization: Fixed a bug where resetting Sulo Whispers or global settings wouldn't immediately clear unsaved edits from the form.
- Accessibility: Fixed missing ARIA labels on Sulo Expressions dropdown controls.

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

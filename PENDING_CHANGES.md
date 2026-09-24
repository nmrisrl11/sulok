# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Changed

- Polished Settings UI: Upgraded Theme and Interface layout controls with beautifully animated segmented buttons, replacing standard dropdowns for a more premium feel.
- Settings Architecture: Code-split and modularized the Sound FX settings section into dedicated, isolated components for better maintainability.
- Accessibility: Updated settings toggles to use native Label components, properly generated unique IDs via `useId()`, and added accessible names to reset buttons and dropdown triggers for improved screen reader support.
- Folder Customization: Added new preset, complementary, and custom folder color options to further personalize your workspace.
- Development: Deep relative imports (`../../`) are now strictly banned in the codebase by a custom `oxlint` rule to enforce clean absolute `@/` import boundaries.

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

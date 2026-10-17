# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Interactive Import Selection**: Choose exactly which folders and individual links to import into your library. Features hierarchical folder checkboxes (with tri-state indeterminate selection), individual link selection, a global select/deselect-all toolbar, live selection counters, and buttery-smooth list virtualization.
- **Status Filter Cards in Import Preview**: Interactive header statistics (`To Import`, `Duplicates`, `In Trash`, and `Invalid`) allow one-click filtering to inspect specific subsets of data with instant resets.
- **Robust Invalid Entry Diagnostics**: Invalid bookmarks and folders (such as missing URLs, javascript/data protocols, or empty titles) are now captured during import parsing, preserved in the tree, and presented with clear failure badges and error reasons.
- **Dedicated In-Trash Category**: Separated entries already sitting in the Recycle Bin into a distinct category with its own stat card and banner to distinguish them from active library duplicates.

### Changed

- **Import Preview Duplicate Rows**: Collapsed and removed inactive checkboxes on existing and trashed entries for a cleaner, decluttered list presentation.
- **Import Preview Filter Bar**: Contextual toolbar showing the active filter status with direct one-click "Show all" action and empty-state guidance.
- **Consistent Invalid Entry Presentation**: Standardized invalid row layout across links and folders into a structured 3-level stacked layout (site name / folder on top, URL or folder indicator on line 2, and diagnostic error message always anchored at the bottom).

### Fixed

- **Import Preview Folder Hierarchy Selection**: Fixed an issue where parent folders remained indeterminate with lingering entry counts after deselecting all nested subfolders or links.

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

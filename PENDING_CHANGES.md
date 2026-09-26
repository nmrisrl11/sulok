# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Changed

- Install Page UI: Redesigned the Install page to be visually cohesive, compact, and responsive. Introduced dynamic, platform-specific guided installation cards (iOS, Desktop, Supported) for improved UX.
- PWA Installation: Migrated the PWA `beforeinstallprompt` listener to a global inline script in `index.html` to reliably capture the install event before React mounts, ensuring the install prompt is never missed.

### Fixed

- Install Page Skeleton: Rebuilt the global page-level `InstallSkeleton` to pixel-perfectly match the structure of the redesigned Install page, eliminating a massive layout shift during lazy-loading.

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

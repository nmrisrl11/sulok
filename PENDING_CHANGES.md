# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Interactive Brand Mascot: Introduced the "NomiBot" animated component to the global footer. It features smooth, physics-based body collision, eye blinking, and expressive states (winking, looking) triggered by user interactions.

### Changed

- Install Page UI: Redesigned the Install page to be visually cohesive, compact, and responsive. Introduced dynamic, platform-specific guided installation cards (iOS, Desktop, Supported) for improved UX.
- App Layout & Footer: Unified the global Footer placement inside the main application layout to ensure it appears consistently across all views. Cleaned up the main Header by moving the "App Tour" and "Install" links down to the new Footer.
- UI Consistency: Standardized the top padding and layout margins across the Settings, About, and Updates pages to ensure a unified responsive structure.
- Copywriting: Updated footer labels to better reflect Sulok's local-first identity (e.g., "Manage Data" instead of "Sync Data").
- PWA Stability: Enhanced the service worker manager to actively poll for application updates every hour. Migrated the `beforeinstallprompt` listener to a global inline script in `index.html` to reliably capture the install event before React mounts.

### Fixed

- Install Page Skeleton: Rebuilt the global page-level `InstallSkeleton` to pixel-perfectly match the structure of the redesigned Install page, eliminating a massive layout shift during lazy-loading.
- Install Prompt State: Fixed an edge case where dismissing the PWA install prompt could prevent it from cleanly resetting its internal state for future attempts.

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

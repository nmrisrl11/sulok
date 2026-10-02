# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- Added the ability to backup and restore all application settings and personalization choices (theme, sound preferences, UI density) via a unified JSON file
- Added a detailed preview screen before restoring settings, highlighting exactly which preferences will change compared to your current setup
- Redesigned the Data & Storage settings page to use a clean, unified card-based layout for both library and settings backups
- Added a smart, dismissible "Get Sulok" banner to recommend installing the web app (PWA) and browser extension
- The banner automatically hides during the initial user onboarding flow to prevent visual noise
- The banner intelligently hides itself when the app runs in standalone mode (PWA installed) or if the browser extension is installed
- The banner features a fully responsive design, moving the dismiss button to the top-right corner on mobile devices
- Integrated Vercel Analytics and Speed Insights to monitor app traffic and performance
- Added dynamic page titles that automatically update based on the specific folder or screen you are currently viewing
- Added graceful offline fallbacks for external images (favicons and open graph previews) to display default placeholder icons when the network fails or images aren't cached

### Fixed

- Resolved an issue that caused link previews to look cluttered or duplicated when sharing Sulok on social platforms like Twitter or Discord
- Ensured absolute link URLs are strictly accurate regardless of the environment the app is accessed from

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

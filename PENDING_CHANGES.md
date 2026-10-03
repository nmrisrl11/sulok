# PENDING_CHANGES.md — Sulok Changelog

> User-facing changelog tracking. Entries here describe what changed from the user's perspective.
> Format: Newest entries at the top.

---

## Unreleased

### Added

- **Device Sync (P2P)**: Seamlessly transfer and merge your library (links, folders, and workspace theme) across devices on your local network using WebRTC. Note: PeerJS uses cloud-hosted signaling and public STUN/TURN servers by default to establish the connection, which may relay data if direct P2P fails.

### Fixed

- **Device Sync**: Fixed an issue where the "Favorite" status of links and folders was stripped during device synchronization and not properly transferred to the receiving device.

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

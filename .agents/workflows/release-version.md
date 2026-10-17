---
description: Step-by-step workflow for releasing a new version of Sulok, authoring user-facing changelog entries, updating version metadata, and validating builds.
---

# Release Version & Changelog Workflow

Use this workflow when releasing a new version of the Sulok web application (desktop, PWA, mobile web) based on unreleased features, improvements, and fixes staged in `PENDING_CHANGES.md`.

---

## Source of Truth & Rules Reference

Before making any changes, remember the project's source of truth hierarchy:

- **`PENDING_CHANGES.md`**: Staging area for unreleased user-facing updates.
- **`src/data/changelog.ts`**: Source of truth for released user-facing changes **and** the active UI version (`CHANGELOG_DATA[0].version`).
- **`package.json`**: Source of truth for the npm and build version.
- **`CURRENT_STATE.md`**: Source of truth for current product and roadmap state.
- **`docs/rules.md` (Changelog Workflow)**:
  - Do NOT blindly copy raw bullet points from `PENDING_CHANGES.md` into `src/data/changelog.ts`.
  - Intelligently group related raw bullets into cohesive, user-facing feature paragraphs.
  - Write entries with a friendly, marketing-style tone focusing on user impact and value (e.g., `"Drag-and-Drop Organization: You can now..."`).
  - Empty the `Unreleased` section in `PENDING_CHANGES.md` once published to `changelog.ts`.

---

## Step 1: Review Pending Changes & Determine Version Bump

1. Read `PENDING_CHANGES.md` under `## Unreleased` to review all queued additions, changes, and fixes.
2. Read the current version from `package.json` (or `CHANGELOG_DATA[0].version` in `src/data/changelog.ts`).
3. Determine the appropriate Semantic Versioning (`MAJOR.MINOR.PATCH`) bump:
   - **Patch (`1.2.0` → `1.2.1`)**: Strictly bug fixes, small visual polish, minor non-breaking refinements.
   - **Minor (`1.2.0` → `1.3.0`)**: New user-facing features, significant architectural enhancements, new views/dialogs, or notable feature expansions.
   - **Major (`1.x.x` → `2.0.0`)**: Groundbreaking redesign, breaking changes, or major architectural paradigm shifts.
4. If ambiguous or if multiple release strategies exist, confirm the target version with the user before proceeding.

---

## Step 2: Bump the Package Version

Update `package.json` and `package-lock.json` to the target version.

Run the version bump command in the workspace root:

```powershell
npm.cmd version <NEW_VERSION> --no-git-tag-version
```

*(On non-Windows shells, use `npm version <NEW_VERSION> --no-git-tag-version`)*

Verify that both `package.json` and `package-lock.json` reflect the new version string.

---

## Step 3: Author the Changelog Entry (`src/data/changelog.ts`)

1. Craft the new release object adhering to the `ChangelogRelease` interface:
   - `version`: The new version string (e.g. `"1.3.0"`).
   - `date`: Current date formatted as `"MMM DD, YYYY"` (e.g. `"Oct 17, 2026"`).
   - `title`: An engaging, descriptive title capturing the primary themes of the release (e.g. `"External Link & File Drag-and-Drop, Import Previews, & Trash-Aware Protection"`).
   - `changes`: Array of category objects (`Added`, `Changed`, `Fixed`, `Removed`). Include only categories that contain items.
2. Group technical or related bullet points into polished, benefit-focused paragraphs with a bold title prefix:
   - Format: `"Feature Name: Friendly explanation of what this enables for the user and how it works."`
3. Prepend the new release object to the beginning of the `CHANGELOG_DATA` array in `src/data/changelog.ts` (index `0`).
4. Note: The app dynamically derives its active version across the About page, Updates page, and Install hub from `CHANGELOG_DATA[0].version`.

---

## Step 4: Reset `PENDING_CHANGES.md`

Clear all entries under `## Unreleased` in `PENDING_CHANGES.md` to reset the staging area for subsequent development, preserving the category structure:

```markdown
## Unreleased

### Added

### Changed

### Fixed

### Removed
```

---

## Step 5: Synchronize Documentation (`CURRENT_STATE.md`)

1. Check `CURRENT_STATE.md`:
   - Update `> Last updated: YYYY-MM-DD` to the current date.
   - Ensure newly released features in the roadmap are marked as completed (`[x]`).
2. Verify cross-document consistency (e.g. check `README.md` if major new features were introduced).

---

## Step 6: Code Quality & Build Validation

Run code formatting and production verification to ensure the codebase remains in pristine release condition:

1. Format the codebase:
   ```powershell
   npm.cmd run format
   ```
2. Run full production build and lint checks:
   ```powershell
   npm.cmd run build
   ```
   *This command executes `oxlint --deny-warnings && tsc -b && vite build`.*
3. Verify that:
   - `oxlint` reports 0 errors and 0 warnings.
   - TypeScript compilation succeeds without errors.
   - Vite builds all production chunks and precaches the PWA service worker with the new version.

---

## Step 7: Present Summary & Commit Suggestion (DO NOT COMMIT)

> [!IMPORTANT]
> **DO NOT RUN `git commit`!**
> Do not stage or commit the changes automatically. The user will review and commit the changes themselves.

1. Run `git status` to display the list of modified files (typically `package.json`, `package-lock.json`, `src/data/changelog.ts`, `PENDING_CHANGES.md`, and optionally `CURRENT_STATE.md`).
2. Present a clear, conventional commit title and message recommendation for the user to review and run:
   ```text
   feat: release version <NEW_VERSION> with <concise summary of major highlights>
   ```
3. Highlight key changes released so the user can easily verify and push to git.

---
description: Analyze the current Git changes and generate a specific, grouped, commit-ready summary using conventional commit categories such as Chores, Feats, Refactors, Fixes, Docs, and Performance.
---

Review the current Git working tree and prepare a detailed, commit-ready summary of all current changes.

## Objective

Analyze the current uncommitted Git changes and produce a clear, specific commit summary that accurately represents what was changed.

The summary should be based on the actual Git changes, not assumptions.

Inspect where necessary:

- `git status`
- staged changes
- unstaged changes
- untracked files
- relevant `git diff`
- relevant file contents when the diff alone is insufficient

Do not modify, stage, unstage, commit, or reset any files.

---

## Commit Summary Requirements

### 1. Be specific

Describe what actually changed.

Avoid vague statements such as:

- "Updated components"
- "Improved the app"
- "Made some changes"
- "Updated UI"
- "Fixed some issues"

Prefer specific descriptions such as:

- "Add celebrant photocard customization dialog with configurable greeting, avatar, name, and background"
- "Migrate birthday persistence from localStorage to Dexie-backed IndexedDB"
- "Add bulk relationship updates to the Manage Birthdays toolbar"
- "Update PWA documentation to reflect IndexedDB-based birthday storage"

Mention important implementation details when they are clearly evident from the changes.

---

### 2. Identify the appropriate change type

Use common Conventional Commit categories.

Possible categories include:

- Chores
- Feats
- Fixes
- Refactors
- Docs
- Performance
- Tests
- Styles
- Build
- CI
- Reverts

Use only categories that are actually represented by the current changes.

Do not force a category when there are no changes belonging to it.

---

### 3. Group related changes

Group related changes together under their appropriate category.

Use this structure:

Chores

- ...

Feats

- ...

Refactors

- ...

Fixes

- ...

Docs

- ...

Performance

- ...

Tests

- ...

Styles

- ...

Build

- ...

CI

- ...

Only include sections that contain actual changes.

---

### 4. Generalized Titles

For each group, provide a concise generalized title that could be used as a commit title.

For example:

Feats
**Add celebrant photocard customization**

- Add photocard customization dialog
- Support configurable greeting content
- Reuse celebrant avatar and identity data
- Add customizable visual background configuration

If multiple unrelated feature areas exist, provide multiple generalized titles where appropriate.

---

## Important: Keep the Summary Grouped

The final result should be ONE combined commit summary.

Do NOT produce separate summaries for each file.

Do NOT create a separate response for staged and unstaged changes.

Do NOT split the response into "staged changes", "unstaged changes", and "untracked files".

Instead, consolidate all current changes into one grouped summary.

---

## Commit Scope

Determine the logical scope of the changes from the actual diff.

If the current changes contain multiple independent areas, represent them under the appropriate categories rather than pretending everything is one feature.

If the changes are closely related and clearly part of one larger feature, summarize them together.

---

## Accuracy Rules

- Base the summary on the actual Git changes.
- Do not invent functionality.
- Do not claim a feature was added if the diff only contains preparation for it.
- Do not claim a bug was fixed unless the changes clearly indicate a fix.
- Distinguish between implementation changes and documentation-only changes.
- Mention meaningful dependency or configuration changes.
- Mention important architectural changes.
- Mention migrations when applicable.
- Mention removed functionality when relevant.
- Do not list every trivial file modification individually.
- Consolidate repetitive changes into meaningful bullets.
- Preserve technical accuracy while keeping the summary readable.

---

## Final Output Format

Return ONLY the grouped commit summary.

Example:

Chores
**Update project tooling and configuration**

- Update build configuration for the current application architecture
- Adjust project dependencies and development tooling

Feats
**Add celebrant photocard customization**

- Add a dedicated photocard customization workflow
- Support configurable greeting, celebrant identity, avatar, and visual presentation
- Integrate the photocard workflow with existing celebrant data

Refactors
**Modernize shared React component patterns**

- Remove legacy component patterns
- Align components with current React conventions
- Simplify component implementation and improve maintainability

Docs
**Synchronize project documentation with the current implementation**

- Update current-state documentation with recently completed features
- Remove completed items from pending changes
- Update README and supporting technical documentation

---

## Final Rules

- Do not execute `git commit`.
- Do not stage or unstage files.
- Do not modify the working tree.
- Do not suggest changes that are not present in the current Git changes.
- Do not include an unnecessary category.
- Be as specific as the diff allows.
- Keep the final output ready to copy directly into a commit message.

---
description: Audit and sync project docs with the current codebase, features, architecture, design, and guidelines. Update AGENTS.md/DESIGN.md with new rules for future development. Skip accurate files.
---

# Sync Project Documentation & Guidelines

Before making changes, audit the project's Markdown documentation against the current codebase, recent changes, features, architecture, design, and development conventions.

## Documentation

Review:

- AGENTS.md
- DESIGN.md
- CURRENT_STATE.md
- PENDING_CHANGES.md
- README.md
- docs/rules.md
- docs/markdowns/**

Also inspect relevant source code, configuration, dependencies, project structure, and Git changes when needed.

The codebase is the source of truth for the current implementation.

---

## Audit & Synchronize

Compare the documentation with the current implementation and identify:

- New or changed features
- Removed or renamed features
- Architecture or structure changes
- New pages/routes/components
- Storage/database/schema changes
- New or removed dependencies
- Configuration/build/PWA changes
- UI/UX and design changes
- Completed or changed pending work
- Outdated commands, paths, terminology, or technical details
- New development conventions or technical decisions

Update only what is actually outdated or missing.

Do not rewrite accurate documentation unnecessarily.

---

## AGENTS.md

Ensure `AGENTS.md` accurately describes rules that AI agents should follow.

Update it when new or changed conventions have been established, including:

- Architecture
- Project/file organization
- React/TypeScript patterns
- Component conventions
- State/data/storage rules
- Styling/Tailwind/shadcn conventions
- Accessibility
- Performance
- PWA requirements
- Testing
- Naming conventions
- Dependency guidelines
- Refactoring/code-quality rules
- Development workflow

Capture important rules established during recent development so future agents can follow them.

Before adding a rule:

1. Check for an existing equivalent.
2. Update the existing rule if necessary.
3. Avoid duplicate or contradictory rules.
4. Do not invent rules without evidence.

Keep `AGENTS.md` actionable and focused on development/agent guidance.

---

## DESIGN.md

Ensure `DESIGN.md` reflects the current visual and UX system.

Update established principles such as:

- Visual direction
- Layout and spacing
- Typography
- Colors
- Components
- Forms/dialogs
- Navigation
- Empty/loading/error states
- Responsive behavior
- Accessibility
- Animation/motion
- Icons/avatars
- Theme behavior
- UI density/compactness
- Other established UX patterns

Document real design decisions, not theoretical preferences.

---

## CURRENT_STATE.md

Keep this file representative of what currently exists.

Update:

- Features
- Architecture
- Project structure
- Routes/pages
- Integrations
- Storage/data strategy
- Major systems
- Technical decisions
- Important limitations

Remove stale descriptions of completed work or outdated behavior.

Do not add speculative features.

---

## PENDING_CHANGES.md

Verify every pending item against the current implementation.

- Keep genuinely pending work.
- Update partially completed work.
- Remove completed or obsolete items.
- Do not invent TODOs or speculative plans.

---

## README.md

Ensure the README accurately describes the project for users and contributors.

Check:

- Product description
- Features
- Installation/setup
- Development commands
- Build/preview commands
- Tech stack
- PWA behavior
- Storage/data behavior
- Import/export
- Project links
- Other user-facing information

Avoid unnecessary internal implementation details and unsupported claims.

---

## docs/markdowns/**

Audit relevant Markdown files for:

- Outdated features
- Architecture
- File paths
- Dependencies
- Commands
- Terminology
- Implementation details
- Completed work
- Contradictory information
- Stale technical decisions

Preserve intentionally historical documentation.

---

## Cross-Document Consistency

Ensure all documentation tells a consistent story.

Check for contradictions between:

- AGENTS.md
- DESIGN.md
- CURRENT_STATE.md
- PENDING_CHANGES.md
- README.md
- docs/rules.md
- docs/markdowns/**

Use the appropriate document for each type of information:

- `AGENTS.md` → development and AI-agent rules
- `DESIGN.md` → design and UX rules
- `CURRENT_STATE.md` → current implementation
- `PENDING_CHANGES.md` → pending work
- `README.md` → user/contributor overview
- `docs/rules.md` → implementation rules and constraints
- `docs/markdowns/**` → detailed technical/feature documentation

---

## Important Rules

- Do not modify application code.
- Do not implement features.
- Do not install dependencies.
- Do not make unrelated changes.
- Do not rewrite documents that are already accurate.
- Do not invent features, rules, or technical decisions.
- Prefer minimal, targeted documentation changes.
- Verify important claims against the actual implementation.
- Follow existing project terminology and structure.
- Preserve useful existing documentation.
- Treat `AGENTS.md` rules as important guidance for future development.

If documentation conflicts with the code, investigate the implementation and update stale documentation when appropriate.

---

## Validation

After editing:

- Re-read modified files.
- Verify paths and commands.
- Verify features against the code.
- Verify architecture against the project structure.
- Verify design guidance against the UI.
- Verify pending items.
- Check for contradictions and duplicate rules.
- Ensure new guidelines are placed in the correct document.

---

## Skip When No Update Is Needed

Do not modify every file simply because it was reviewed.

If a file is already accurate, skip it.

If no documentation or guideline changes are necessary, make no changes.

The goal is:

**Keep project documentation and development guidelines synchronized with the actual codebase.**

---

## Final Response

Provide:

### Audited

Files/directories reviewed.

### Updated

Only modified files, with a brief explanation.

### Guidelines Added/Updated

New or changed rules added for future development.

### Skipped

Reviewed files that required no changes.

### Verification

Briefly summarize what was verified, including features, architecture, design, storage, PWA, routes, dependencies, commands, and pending work.

If nothing required updating, state:

"No documentation updates were necessary. The documentation and development guidelines are already synchronized with the current implementation."

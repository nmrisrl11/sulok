---
description: Read .agents skills and project Markdown documentation before development so you understand the app's architecture, structure, rules, guidelines, skills, and current implementation before building anything.
---

# Load Project Context

Before implementing, modifying, refactoring, or debugging any feature, first review the project's available skills and Markdown documentation.

The goal is to understand the application's architecture, structure, conventions, guidelines, rules, current state, and established development patterns so that implementation is never done blindly.

---

## 1. Read Agent Skills First

Inspect the `.agents/` directory, especially:

- `.agents/skills/**`

Read the relevant skill Markdown files before development.

Determine which skills apply to the requested task and follow their instructions, patterns, and constraints.

Do not ignore project-specific skills in favor of generic implementation approaches.

If a skill is directly relevant to the requested feature, use it as part of the implementation process.

---

## 2. Read Project Documentation

Look for and review:

- `AGENTS.md`
- `DESIGN.md`
- `CURRENT_STATE.md`
- `PENDING_CHANGES.md`
- `README.md`
- `docs/markdowns/**`

For `docs/markdowns`, inspect relevant files recursively based on the requested task.

Do not assume a single document contains the complete project context.

---

## 3. Understand the Codebase

Before writing code, understand the relevant:

- Application architecture
- Project structure
- Feature organization
- Components
- Pages/routes
- Hooks
- State management
- Services
- Utilities
- Data/storage layer
- Database/schema
- Types
- PWA setup
- Styling system
- TailwindCSS/shadcn conventions
- Build configuration
- Development commands
- Testing approach
- Existing integrations

Inspect the actual source code relevant to the requested feature after reviewing the documentation.

Documentation provides context and project decisions; the implementation provides the current technical reality.

---

## 4. Understand Existing Rules

Pay close attention to:

- `AGENTS.md` development rules
- `DESIGN.md` design and UX rules
- Relevant `.agents/skills/**` instructions
- Existing architectural patterns
- Naming conventions
- File organization
- Component patterns
- State/data conventions
- Styling conventions
- Accessibility requirements
- Performance requirements
- PWA requirements
- Testing requirements
- Existing project-specific constraints

Follow established project conventions instead of introducing unrelated patterns.

---

## 5. Understand the Current State

Use `CURRENT_STATE.md` and the relevant source code to determine:

- What is already implemented
- What has recently changed
- Existing features
- Existing architecture
- Existing integrations
- Current storage/data behavior
- Current routes/pages
- Known limitations

Do not reimplement functionality that already exists.

Reuse existing components, hooks, utilities, services, and abstractions whenever appropriate.

---

## 6. Check Pending Work

Review `PENDING_CHANGES.md` to understand:

- Incomplete work
- Planned changes
- Existing technical debt
- Features currently being developed
- Known follow-up work

If the requested task overlaps with pending work, consider that context before deciding how to implement it.

---

## 7. Use Relevant Documentation

Search `docs/markdowns/**` for documentation related to the requested feature or affected system.

Look for:

- Feature specifications
- Architecture decisions
- Implementation notes
- Data models
- UI/UX decisions
- Previous migration notes
- Integration details
- Known constraints

Do not duplicate existing systems or contradict documented decisions without a clear reason.

---

## 8. Before Implementation

Before writing code, determine:

### What already exists?

Identify reusable functionality related to the requested feature.

### Where does it belong?

Determine the correct feature, module, layer, directory, and component location.

### What patterns should be followed?

Find similar implementations already present in the project.

### What could be affected?

Consider related features, shared components, state, storage, routing, PWA behavior, and user workflows.

### What constraints apply?

Check `AGENTS.md`, `DESIGN.md`, relevant skills, and feature documentation.

### What is the simplest correct integration?

Prefer extending existing architecture over creating parallel systems.

---

## 9. Resolve Documentation vs Code Conflicts

If documentation and implementation disagree:

1. Investigate the current source code.
2. Determine the actual current behavior.
3. Follow explicit rules from `AGENTS.md` where applicable.
4. Follow relevant `.agents/skills/**` instructions.
5. Do not blindly trust stale documentation.
6. Do not ignore documented architectural decisions without justification.

Do not make assumptions when the repository provides enough information to determine the correct approach.

---

## 10. Important Rules

- Do not implement anything before reviewing the relevant context.
- Do not blindly introduce a new architecture or pattern.
- Do not duplicate existing functionality.
- Reuse established abstractions whenever possible.
- Do not introduce unnecessary dependencies.
- Preserve existing behavior unless the requested change requires otherwise.
- Follow the project's design system.
- Follow relevant agent skills.
- Follow `AGENTS.md` rules.
- Consider accessibility, responsiveness, performance, and PWA behavior.
- Do not refactor unrelated code.
- Do not change existing architecture unnecessarily.

This workflow is a context-loading step, not an instruction to modify documentation or implement a feature by itself.

---

## 11. After Context Review

Once the relevant skills, documentation, and source code have been reviewed:

1. Understand the requested feature.
2. Identify the affected areas.
3. Identify reusable existing implementations.
4. Determine the correct architectural approach.
5. Follow applicable skills and project rules.
6. Then proceed with the requested development task.

The goal is:

**Read the context first. Understand the project. Then implement.**

Never implement a feature blindly when the repository already contains skills, documentation, architectural decisions, and established patterns that should guide the implementation.

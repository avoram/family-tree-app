# Context Management Rules

## Purpose

Ensure implementation context is preserved across AI sessions and long-running development efforts.

## Rule 1: Starting New Work

Before implementation begins, read in this order:

**AI rules (this folder):**

- `.ai/rules/context-management.md`
- `.ai/rules/development-workflow.md`

**Program context:**

- `plan.md`
- `progress.md`

**Feature context (only when working on a feature):**

- `features/<feature>/plan.md`
- `features/<feature>/developmentplan.md`
- `features/<feature>/progress.md`
- `features/<feature>/memory.md`

**Knowledge layer (on demand only — skip empty or unrelated files):**

- `knowledge/application-landscape.md` — **mandatory for migration projects; read first (before `migration-strategy.md`)**
- `knowledge/migration-strategy.md` — **mandatory for migration projects; read second (before `plan.md`)**
- `knowledge/coding-standards.md`
- `knowledge/architecture-decisions.md`
- `knowledge/api-standards.md`
- `knowledge/design-system-rules.md`
- `knowledge/domain-rules.md`
- `knowledge/security-standards.md`

**Migration and modernization projects** follow the extended startup sequence in `AI_bootstarp.md` (Application Landscape → Migration Strategy → program context → feature context).

Explain understanding before implementation starts.

---

## Rule 2: Context Compression

When:

- A milestone is completed
- A major task is completed
- A design discussion is completed
- Work is handed over
- A new AI session is expected

Update:

- `progress.md` (move milestone between Completed / In Progress / Pending)
- `features/<feature>/progress.md`
- `features/<feature>/memory.md`

Capture:

- Current implementation status
- Decisions made
- Open issues
- Remaining work
- Next steps

---

## Rule 3: Feature Completion

When a feature is completed:

Update:

- `features/<feature>/progress.md`
- `features/<feature>/memory.md`
- `progress.md` (program-level milestone status)

Recommend updates to relevant `knowledge/*` files when applicable:

- `application-landscape.md` (migration dashboards and inventory, when applicable)
- `architecture-decisions.md`
- `domain-rules.md`
- `api-standards.md`
- `design-system-rules.md`
- `coding-standards.md`
- `security-standards.md`

# AI-Assisted Development Framework

## Purpose

This repository follows a Context-Driven Engineering Lifecycle for AI-assisted development.

AI assistants should not rely on conversational memory.

Instead, project knowledge, architecture decisions, implementation plans, and development progress must be stored in project artifacts so that any developer or AI session can resume work consistently.

Every AI session should be treated as a new onboarding process.

Before implementation begins, AI should rebuild its understanding from project documentation.

---

# Session Trigger

Cursor auto-loads `.cursor/rules/session-bootstrap.mdc` (`alwaysApply: true`) on every new thread.

That rule directs the agent to read `.ai/rules/` first, then program context, then feature context, then knowledge on demand.

`AGENTS.md` in the project root provides a plain-markdown backup of the same onboarding flow.

---

# Repository Structure

```
project/
├── frontend/              # Angular application (frontend-only V1)
│
├── AGENTS.md
├── AI_bootstarp.md
├── plan.md
├── progress.md
│
├── knowledge/
│   ├── application-landscape.md  # Mandatory for migration/modernization projects (read first)
│   ├── migration-strategy.md     # Mandatory for migration/modernization projects (read second)
│   ├── coding-standards.md
│   ├── architecture-decisions.md
│   ├── api-standards.md
│   ├── design-system-rules.md
│   ├── security-standards.md
│   ├── accessibility-standards.md
│   ├── domain-rules.md
│   └── architecture/
│       ├── system-diagrams.md
│       ├── sequence-diagrams.md
│       ├── integration-diagrams.md
│       └── api-contracts.md
│
├── features/
│   └── <feature>/
│       ├── plan.md
│       ├── developmentplan.md
│       ├── progress.md
│       └── memory.md
│
├── .ai/
│   └── rules/
│       ├── context-management.md
│       └── development-workflow.md
│
└── .cursor/
    └── rules/
        └── session-bootstrap.mdc
```

---

# AI Workflow

Whenever a new task or feature begins:

1. **Read AI rules** (required)
   - `.ai/rules/context-management.md`
   - `.ai/rules/development-workflow.md`

2. **Review program context** (required)
   - `plan.md`
   - `progress.md`

3. **Review feature context** (when applicable)
   - `features/<feature>/plan.md`
   - `features/<feature>/developmentplan.md`
   - `features/<feature>/progress.md`
   - `features/<feature>/memory.md`

4. **Review knowledge layer** (on demand only — skip empty or unrelated files)
   - `knowledge/coding-standards.md`
   - `knowledge/architecture-decisions.md`
   - `knowledge/api-standards.md`
   - `knowledge/design-system-rules.md`
   - `knowledge/domain-rules.md`
   - `knowledge/security-standards.md`

5. Explain understanding before implementation.

---

# Migration and Modernization Projects

For projects migrating from a legacy frontend (AngularJS, ExtJS, jQuery, etc.) to Angular 18, follow this **extended startup sequence** instead of the default workflow above.

| Document | Source of truth for |
|----------|---------------------|
| `knowledge/application-landscape.md` | **Current state** — inventory, technology distribution, migration progress |
| `knowledge/migration-strategy.md` | **Migration approach** — Strangler Fig pattern, constraints, module mapping |

Both documents are part of the Knowledge Layer and are **mandatory reading** before program or feature documentation.

## Startup sequence

1. **Read application landscape** (required — first)
   - `knowledge/application-landscape.md`
   - Understand module inventory, technology distribution, migration dashboards, and technical debt hotspots

2. **Read migration strategy** (required — second)
   - `knowledge/migration-strategy.md`
   - Understand target architecture, Strangler Fig approach, constraints, and module mapping

3. **Review program context** (required)
   - `plan.md`
   - `progress.md`

4. **Review feature context** (when applicable)
   - `features/<feature>/plan.md`
   - `features/<feature>/developmentplan.md`
   - `features/<feature>/progress.md`
   - `features/<feature>/memory.md`

5. **Review additional knowledge layer** (on demand — skip empty or unrelated files)
   - `knowledge/coding-standards.md`
   - `knowledge/architecture-decisions.md`
   - `knowledge/architecture/api-contracts.md`
   - Other `knowledge/*` files as relevant to the task

6. Begin implementation planning — explain understanding and assumptions before writing code.

Greenfield projects (no legacy frontend) may skip steps 1–2 and follow the default AI Workflow above.

---

# Implementation Workflow

After onboarding (default or migration startup sequence):

1. Update `developmentplan.md` if implementation details change.

2. Implement incrementally — one milestone from `progress.md` at a time.

3. Generate:
   - Unit tests
   - Integration tests
   - Implementation code
   - End-to-end tests

4. Validate:
   - Test execution
   - Architecture compliance
   - Coding standards compliance

5. Update documentation before ending the session.

---

# Context Management

Context should be treated as a project asset.

When:

- A milestone is completed
- A major task is completed
- A feature checkpoint is reached
- A session becomes lengthy
- Work is handed over

Update:

- `progress.md` (program-level milestone tracking)
- `features/<feature>/progress.md`
- `features/<feature>/memory.md`

Capture:

- Current implementation status
- Decisions made
- Open issues
- Risks
- Remaining work
- Next steps

The objective is to compress implementation context into reusable project artifacts.

Use at most ~70% of context for onboarding. Defer deep knowledge reads until the task requires them.

---

# Definition Of Done

A feature is considered complete only when:

- Implementation is complete
- Unit tests are complete
- Integration tests are complete
- End-to-End tests are complete
- `progress.md` is updated
- Feature `memory.md` is updated
- Program progress is updated where applicable
- Knowledge documents are updated where applicable (including `application-landscape.md` migration dashboards when applicable)

---

# Future MCP and AI Agent Integration

As the project matures, AI should not rely solely on documentation. Instead, it should integrate with external engineering tools through MCP servers and AI agents to automatically gather context and keep project documentation synchronized.

The typical flow is:

**Jira → Design → Planning → Development → Review → Delivery**

## 1. Requirement Understanding

- AI reads Jira Epics, Stories, Tasks, and Bugs.
- AI creates or updates feature-level documentation such as:
  - `features/<feature>/plan.md`
  - `features/<feature>/developmentplan.md`
  - `features/<feature>/progress.md`

## 2. Design Understanding

- AI reads Figma designs and design-system assets.
- AI documents implementation understanding, component requirements, and UI considerations.

## 3. Development

- AI assists with implementation using project knowledge, architecture standards, and feature documentation.
- Progress and context are continuously updated at the feature level.

## 4. Code Review & Bug Review

- AI agents review pull requests for coding standards, architecture compliance, quality issues, and potential defects.
- AI assists in identifying bugs, regressions, and improvement opportunities.

## 5. CI/CD & Delivery

- AI integrates with GitHub/GitLab and CI/CD pipelines.
- AI assists with pull requests, pipeline analysis, release notes, deployment readiness checks, and delivery tracking.

Throughout the lifecycle, AI should continuously synchronize feature documentation so that project context remains accurate, reusable, and available across future sessions.

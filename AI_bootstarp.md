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
├── frontend/              # Angular application
├── backend/               # Node.js + Express application
│
├── AGENTS.md
├── AI_bootstarp.md
├── plan.md
├── progress.md
│
├── knowledge/
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

6. Update `developmentplan.md` if implementation details change.

7. Implement incrementally — one milestone from `progress.md` at a time.

8. Generate:
   - Unit tests
   - Integration tests
   - Implementation code
   - End-to-end tests

9. Validate:
   - Test execution
   - Architecture compliance
   - Coding standards compliance

10. Update documentation before ending the session.

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
- Knowledge documents are updated where applicable

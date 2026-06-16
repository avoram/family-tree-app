# Development Workflow Rules

## Purpose

Define the expected development workflow for AI-assisted development.

## Rule 1: Understand Before Implementing

Before writing code:

- Read `.ai/rules/context-management.md` and `.ai/rules/development-workflow.md`
- Read `plan.md` and `progress.md`
- Read feature context if working on a feature
- Read `knowledge/*` only when relevant to the current task
- Explain understanding and identify assumptions
- Update `features/<feature>/developmentplan.md` when required

Implementation should not begin until the approach is understood.

---

## Rule 2: Work Incrementally

- Pick the current milestone from `progress.md`
- Only one milestone should be **In Progress** at a time
- Prefer small implementation tasks within that milestone
- Avoid implementing multiple major features in a single session

---

## Rule 3: Testing Requirements

Every feature and milestone must include:

- Unit tests
- Integration tests where applicable
- End-to-end tests

Testing is part of feature completion, not optional follow-up work.

---

## Rule 4: Validate Before Completion

Before marking a milestone or task complete, validate:

- Requirements are implemented
- Tests pass
- Coding standards are followed (see `knowledge/coding-standards.md` when populated)
- Architecture rules are followed (see `knowledge/architecture-decisions.md` when populated)
- `progress.md` is updated
- Feature `progress.md` and `memory.md` are updated when applicable

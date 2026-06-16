# Agent Instructions

This project uses a Context-Driven Engineering Lifecycle. Every session starts fresh.

## Onboarding (required before implementation)

Read in this order:

1. `.ai/rules/context-management.md`
2. `.ai/rules/development-workflow.md`
3. `plan.md`
4. `progress.md`
5. `features/<feature>/` docs — only when working on that feature
6. `knowledge/*` — only when relevant to the current task (skip empty files)

## Key rules

- Explain understanding before writing code
- Work one milestone from `progress.md` at a time
- Unit tests and E2E tests are required for every feature
- Update `progress.md` and feature docs before ending the session
- Use at most ~70% of context for onboarding

## V1 scope (summary)

- **Frontend-only** — Angular 18 app deployed to Vercel; no backend or database
- **Public read-only** — no login screen; all bundled trees viewable via dropdown from local JSON files

Full product details are in `plan.md`. Full framework is in `AI_bootstarp.md`.

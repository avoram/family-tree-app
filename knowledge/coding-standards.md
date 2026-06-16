
# Coding Standards

## Purpose

This document defines the technology stack, development standards, testing standards, and UI standards used throughout the project.

All development activities should follow these standards.

---

## Technology Stack

### Frontend

- Angular 18
- TypeScript
- Angular Material

### Data (V1)

- Family tree definitions stored as JSON files in `family-trees/`
- Service abstraction layer for data access (JSON-backed; API-ready for future backend)

### Testing

- **Frontend unit tests:** Angular Unit Testing Framework
- **Frontend E2E tests:** Playwright

### Deployment

- Vercel (frontend only)

> **V1 note:** Frontend-only application. No backend or database. Data is loaded from `family-trees/*.tree.json` via a service abstraction layer.

---

## Architecture Standards

### Frontend

- Use Angular Standalone Components.
- Use Angular Signals for local state management.
- Avoid external state management libraries unless complexity justifies their use.
- Follow feature-based organization within the Angular application.
- Keep components focused on a single responsibility.
- Prefer reusable components over duplicated implementations.

### Service Abstraction Layer

- Components and feature modules must **not** read JSON files directly.
- All family tree data access goes through injectable services with **API-shaped interfaces** (see `knowledge/architecture/api-contracts.md`).
- V1 services load data from bundled `family-trees/*.tree.json` files.
- A future `HttpFamilyTreeService` (or similar) should implement the same interfaces against a REST API with minimal UI changes.
- Return types should use RxJS `Observable` or Angular signals/async patterns consistent with how HTTP calls will behave later.

### Data Files

- Store tree definitions under `family-trees/` at the repository root.
- Use the `*.tree.json` naming convention (e.g., `family1.tree.json`).
- Each file contains one complete family tree (metadata + members).
- JSON schema and DTO shapes are defined in `knowledge/architecture/api-contracts.md`.

---

## Development Standards

### Frontend

- Use strongly typed interfaces and models.
- Avoid use of `any`.
- Prefer composition over duplication.
- Keep business logic outside UI components whenever possible.
- Use services for reusable business logic.
- Keep components small and maintainable.
- Follow Angular recommended practices.

---

## Testing Standards

Every feature must include:

- Unit Tests
- End-to-End Tests

Testing is considered part of feature completion.

A feature is not complete until required tests are implemented and passing.

---

## UI Standards

- Use Angular Material components whenever possible.
- Follow Material Design guidelines.
- Prefer standard Material controls over custom implementations.
- Build responsive layouts.
- Maintain consistent spacing, typography, and component usage.

---

## Repository and Folder Structure Standards

Version 1 is a **frontend-only** single repository:

```
project/
├── frontend/              # Angular 18 application
├── family-trees/          # Family tree JSON definitions (*.tree.json)
├── AGENTS.md
├── plan.md
├── progress.md
├── knowledge/
├── features/
├── .ai/
└── .cursor/
```

### Application layout

- **`frontend/`** — Angular app (components, services, routes, assets, and frontend tests).
- **`family-trees/`** — Read-only family tree JSON files consumed by the service layer.

Example tree files:

```
family-trees/
├── family1.tree.json
├── family2.tree.json
└── family3.tree.json
```

### Documentation and features

- Follow feature-based organization for product documentation under `features/`.
- Each feature should maintain:
  - `plan.md`
  - `developmentplan.md`
  - `progress.md`
  - `memory.md`
- Shared frontend functionality belongs in reusable modules, services, or components within `frontend/`.
- Data access belongs in the service abstraction layer under `frontend/` (e.g., `frontend/src/app/core/services/` or feature-scoped services).

---

## Simplicity Principle

This project favors simple solutions.

Before introducing new libraries, frameworks, or architectural patterns, verify that the problem cannot be solved using existing Angular capabilities.

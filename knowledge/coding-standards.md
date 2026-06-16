
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

### Backend

- Node.js
- Express.js
- TypeScript

### Authentication

- Username and password login
- JWT (24-hour expiration; no refresh tokens in V1)

### Testing

- **Frontend unit tests:** Angular Unit Testing Framework
- **Frontend E2E tests:** Playwright

### Deployment

- Vercel (frontend)

---

## Architecture Standards

### Frontend

- Use Angular Standalone Components.
- Use Angular Signals for local state management.
- Avoid external state management libraries unless complexity justifies their use.
- Follow feature-based organization within `frontend/`.
- Keep components focused on a single responsibility.
- Prefer reusable components over duplicated implementations.
- Store the JWT after login and include `Authorization: Bearer <token>` on protected API requests.
- Handle expired or invalid tokens (401) by redirecting the user to login.

### Backend

- Expose a REST API via Express.js.
- Organize code by concern (routes, controllers/handlers, services, models) within `backend/`.
- Keep route handlers thin; place business logic in services.
- Keep API contracts aligned with `knowledge/api-standards.md` and `knowledge/architecture/api-contracts.md`.
- Issue JWTs on successful login with a 24-hour expiration and role claim (`SuperAdmin` or `User`).
- Use middleware to verify JWTs and enforce role-based authorization on protected routes.

---

## Development Standards

### Shared

- Use strongly typed interfaces and models.
- Avoid use of `any`.
- Prefer composition over duplication.

### Frontend

- Keep business logic outside UI components whenever possible.
- Use services for reusable business logic.
- Keep components small and maintainable.
- Follow Angular recommended practices.

### Backend

- Use strongly typed request/response models and DTOs.
- Validate input at API boundaries.
- Use services for reusable business logic shared across routes.
- Follow Node.js and Express.js recommended practices.

---

## Testing Standards

Every feature must include:

- Unit Tests
- Integration Tests where applicable
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

The project uses a **single repository** containing both the frontend and backend applications:

```
project/
├── frontend/              # Angular application
├── backend/               # Node.js + Express application
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
- **`backend/`** — Express app (routes, handlers, services, models, and backend tests).

### Documentation and features

- Follow feature-based organization for product documentation under `features/`.
- Each feature should maintain:
  - `plan.md`
  - `developmentplan.md`
  - `progress.md`
  - `memory.md`
- Shared frontend functionality belongs in reusable modules, services, or components within `frontend/`.
- Shared backend functionality belongs in reusable services or modules within `backend/`.

---

## Simplicity Principle

This project favors simple solutions.

Before introducing new libraries, frameworks, or architectural patterns, verify that the problem cannot be solved using existing Angular or Express capabilities.
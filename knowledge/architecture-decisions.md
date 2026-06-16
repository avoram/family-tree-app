# Architecture Decisions

Records significant technical decisions that affect implementation across the project.

---

## ADR-001: Monorepo with separate frontend and backend applications

**Status:** Approved

**Context:** The Family Tree application needs a web UI and a server-side API for authentication, data persistence, and business rules.

**Decision:** Use a single repository with two top-level application directories:

- `frontend/` — Angular application
- `backend/` — Node.js + Express application

Project documentation, knowledge, and feature planning artifacts remain at the repository root alongside both applications.

**Consequences:**

- Frontend and backend can be developed, tested, and versioned together.
- Shared contracts (API shapes, domain models) should be documented in `knowledge/` and kept in sync across both apps.
- Deployment may target frontend and backend independently (e.g., frontend on Vercel).

---

## ADR-002: Node.js and Express.js for the backend

**Status:** Approved

**Context:** The application requires a backend for authentication, family tree data, and relationship management.

**Decision:** Implement the backend with **Node.js** and **Express.js**, using **TypeScript** for consistency with the frontend.

**Consequences:**

- REST API endpoints are served by Express.
- Backend code lives under `backend/` and follows the standards in `knowledge/coding-standards.md`.
- API design should follow `knowledge/api-standards.md` once populated.

---

## ADR-003: JWT-based authentication

**Status:** Approved

**Context:** The Angular frontend and Express backend need a stateless authentication mechanism for protected API access. Username/password login is required without third-party auth providers.

**Decision:** Use **JWT** for authentication with the following rules:

- Tokens expire after **24 hours**
- **No refresh tokens** in Version 1; users re-authenticate after expiration
- Role-based authorization via JWT claims: `SuperAdmin`, `User`
- Backend issues and validates JWTs; frontend attaches JWT to protected API calls

**Consequences:**

- Express middleware is required for JWT verification and role enforcement.
- The frontend must store the token and handle expiration (redirect to login).
- Refresh token support is deferred to a future version.

# API Standards

## Purpose

Define conventions for REST API design and authentication across the Family Tree application.

---

## Authentication

- Users authenticate with username and password via a login endpoint.
- On success, the backend returns a **JWT** with a **24-hour expiration**.
- Protected endpoints require the header: `Authorization: Bearer <JWT>`.
- Missing, invalid, or expired tokens must return **401 Unauthorized**.
- Insufficient role for the requested operation must return **403 Forbidden**.
- **No refresh tokens** in Version 1; clients must re-authenticate after token expiration.

### Roles

JWT claims must include the user's role. Supported values:

| Role | Access |
|------|--------|
| `SuperAdmin` | Full create/update access to all family trees |
| `User` | Read-only access to all family trees |

Authorization is enforced on the backend for every protected endpoint. See [security-standards.md](security-standards.md).

---

## General Conventions

- Use RESTful resource-oriented endpoints.
- Validate input at API boundaries.
- Return only required data in responses.
- Full endpoint contracts will be documented in [architecture/api-contracts.md](architecture/api-contracts.md).

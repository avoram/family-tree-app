# API Standards

## Purpose

Define conventions for data access in the Family Tree application (V1).

---

## Version 1 (Current)

V1 has **no backend API**. Data is served from local JSON files via a frontend **service abstraction layer**.

- The application opens directly to the main view — there is no login screen.
- All bundled family trees are publicly viewable.
- Components call injectable services, not HTTP endpoints or JSON paths directly.
- Service interfaces and DTO shapes are defined in [architecture/api-contracts.md](architecture/api-contracts.md).
- The V1 implementation loads bundled `family-trees/*.tree.json` files.
- All access is read-only.

See [architecture-decisions.md](architecture-decisions.md) (ADR-001, ADR-002, ADR-003).

---

## General Conventions

- Service methods return strongly typed DTOs defined in [architecture/api-contracts.md](architecture/api-contracts.md).
- Invalid or missing JSON is handled gracefully at the service layer.
- UI components must not parse JSON or access file paths directly.

A future backend, if introduced, should implement the same read-only service interface with matching DTO shapes. Details will be documented when that work begins.

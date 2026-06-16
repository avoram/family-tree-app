# Architecture Decisions

Records significant technical decisions that affect implementation across the project.

---

## ADR-001: Frontend-only architecture for V1

**Status:** Approved

**Context:** Version 1 should deliver a public, read-only family tree viewer with minimal infrastructure cost and complexity. A backend and database are not required for the initial release.

**Decision:** V1 is a **frontend-only Angular 18 application** deployed to **Vercel**. There is no backend server and no database in V1. The application opens directly to tree selection with no login screen.

**Consequences:**

- Repository contains `frontend/` (Angular app) and `family-trees/` (JSON data).
- All visitor flows are read-only.
- A future backend, if added, will be a separate milestone/version — not part of V1 scope.

---

## ADR-002: JSON file storage for family trees (V1)

**Status:** Approved

**Context:** V1 needs a simple, zero-cost data source for family tree definitions without a database or API server.

**Decision:** Store family tree data as **JSON files** in a dedicated `family-trees/` folder at the repository root. Files use the `*.tree.json` naming convention. Each file contains one complete family tree (metadata and members).

Example:

```
family-trees/
├── family1.tree.json
├── family2.tree.json
└── family3.tree.json
```

**Consequences:**

- Tree data is bundled with the frontend build (or loaded as static assets).
- Adding a new tree means adding a JSON file and redeploying.
- JSON files must conform to domain rules and the schema in `knowledge/architecture/api-contracts.md`.
- Data validation happens at load time in the service layer.

---

## ADR-003: Service abstraction layer (API-ready UI)

**Status:** Approved

**Context:** V1 loads data from JSON files, but a backend API may be introduced later. The UI should not be tightly coupled to JSON file paths or parsing logic.

**Decision:** Introduce a **service abstraction layer** in the Angular application:

- Define injectable service **interfaces** with method signatures shaped like a future REST API (e.g., `listFamilyTrees()`, `getFamilyTree(id)`, `getMembers(treeId)`).
- V1 provides a **JSON-backed implementation** that discovers and loads `family-trees/*.tree.json`.
- Components depend on the interface, not the implementation.
- A future `HttpFamilyTreeService` can swap in without major UI changes.

**Consequences:**

- DTO/type shapes in `knowledge/architecture/api-contracts.md` serve both JSON files and future API responses.
- Components must not import or parse JSON directly.
- Service methods should return async-friendly types (Observable or signals) consistent with HTTP usage.

---

## ADR-004: Vercel frontend deployment (V1)

**Status:** Approved

**Context:** V1 requires zero-cost hosting with no backend infrastructure.

**Decision:** Deploy the Angular frontend to **Vercel**. No backend deployment is required for V1.

**Consequences:**

- Build output is a static/hosted Angular application.
- `family-trees/` JSON files are included in the frontend build as assets.
- No API base URL or secrets configuration is needed for V1.

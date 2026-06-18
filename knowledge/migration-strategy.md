# Migration Strategy

## Purpose

This document defines the **presentation-layer migration strategy** for frontend modernization projects. It is part of the Knowledge Layer and is **mandatory reading for AI assistants** after `knowledge/application-landscape.md` and before `plan.md`, `progress.md`, or any feature-level documentation when the project involves migrating from a legacy frontend to Angular 18.

| Document | Source of truth for |
|----------|---------------------|
| `knowledge/application-landscape.md` | **Current state** — read **first** |
| `knowledge/migration-strategy.md` | **Migration approach** — read **second** (this document) |

For greenfield projects (no legacy frontend), skip the Current State and Module Mapping sections and treat the Target State as the established architecture.

---

## When to Read This Document

Read this document **second**, after `knowledge/application-landscape.md`, when:

- A legacy frontend (AngularJS, ExtJS) is being modernized to Angular 18
- Legacy and new UI must coexist during an incremental migration
- Feature work must respect an existing backend, API contracts, and business rules

---

# Current State (Legacy Frontend)

> **Project note:** This repository is a **greenfield Angular 18 application** — there is no legacy frontend to migrate. The sections below are the required inventory template for migration projects. Populate them before planning feature work.

Document the existing presentation layer before any migration planning begins.

## Current Frontend Architecture

| Aspect | Document here |
|--------|---------------|
| Application type | SPA, MPA, hybrid, embedded widgets |
| Hosting | On-prem, CDN, app server, iframe embedding |
| Build tooling | Grunt, Gulp, Webpack (legacy), RequireJS, none |
| Module system | AMD, CommonJS, global scripts, ES modules |
| State management | Scope variables, Redux, custom event bus, none |
| Data access | Direct `$http`, Ext.Ajax, jQuery.ajax, form posts |

## Current Frontend Technology Stack

| Layer | Technology | Version (if known) |
|-------|------------|-------------------|
| Framework | e.g. AngularJS, ExtJS, Backbone, jQuery UI | |
| Language | e.g. JavaScript ES5, CoffeeScript | |
| CSS | e.g. Bootstrap 3, custom CSS, SASS | |
| UI components | e.g. ExtJS grids, AngularJS directives | |
| Testing | e.g. Karma + Jasmine, QUnit, manual only | |
| Package manager | e.g. Bower, npm (legacy), none | |

## Current Module and Folder Structure

Document the legacy folder layout. Example template:

```
legacy-frontend/
├── app/
│   ├── modules/           # Feature modules (AngularJS) or packages (ExtJS)
│   ├── shared/            # Shared directives, services, utilities
│   ├── assets/
│   └── index.html
├── lib/                   # Third-party libraries (Bower/vendor)
└── build/                 # Compiled output
```

Record which folders own which business capabilities.

## Existing Routing Approach

| Pattern | Details |
|---------|---------|
| Router | e.g. `$routeProvider`, `$stateProvider` (ui-router), ExtJS card layout, hash-based navigation |
| URL strategy | Hash (`#/`), HTML5 mode, server-side routing |
| Deep linking | Supported routes, query param conventions |
| Guards / auth | Route resolves, `$routeProvider.when` guards, login redirects |

## Existing UI Framework Patterns

Document framework-specific patterns in use:

| Pattern | Legacy implementation | Notes |
|---------|----------------------|-------|
| Components | e.g. AngularJS directives, ExtJS `xtype` widgets | |
| Templates | e.g. `templateUrl`, inline HTML strings, XTemplates | |
| Forms | e.g. `ng-model`, ExtJS `Ext.form.Panel` | |
| Lists / grids | e.g. `ng-repeat`, ExtJS `Ext.grid.Panel` | |
| Modals / dialogs | e.g. `$uibModal`, ExtJS `Ext.window.Window` | |
| Services / stores | e.g. AngularJS factories, ExtJS `Ext.data.Store` | |

## Existing Reusable Components and Shared Utilities

Inventory shared assets that must be preserved or reimplemented:

| Asset | Location | Used by | Migration notes |
|-------|----------|---------|-----------------|
| e.g. Date formatter | `shared/utils/date.js` | 12 modules | Replace with Angular pipe |
| e.g. Confirmation dialog | `shared/directives/confirm.js` | 8 modules | Replace with Material dialog |
| e.g. Auth header interceptor | `shared/services/http-interceptor.js` | Global | Port to `HttpInterceptor` |

## Current Frontend Constraints and Technical Debt

| Category | Constraint / debt | Impact on migration |
|----------|-------------------|---------------------|
| Browser support | e.g. IE11 required | Limits Angular Material usage |
| Global dependencies | e.g. `$`, `Ext`, `angular` on `window` | Blocks tree-shaking |
| Tight coupling | e.g. components call `$http` directly | Requires service abstraction |
| Missing tests | e.g. no unit tests on legacy modules | Requires E2E safety net first |
| Undocumented APIs | e.g. implicit response shapes | Requires API contract documentation |
| Build fragility | e.g. manual script tag ordering | Blocks incremental builds |

---

# Target State (Angular 18)

This section describes the target architecture. In this repository, the target state is **already implemented** and serves as the reference for migration projects.

## Angular 18 Architecture

| Aspect | Target |
|--------|--------|
| Bootstrap | `bootstrapApplication()` — no `NgModule` root |
| Components | Standalone components only |
| Dependency injection | `InjectionToken` for service interfaces |
| State | Angular Signals for local/component state; RxJS `Observable` for async data |
| Change detection | Zone.js with event coalescing (`provideZoneChangeDetection`) |
| Data access | Service abstraction layer — components never read files or call HTTP directly |

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 18 |
| Language | TypeScript (~5.5) |
| UI library | Angular Material 18 + Angular CDK |
| Async | RxJS 7 |
| Unit tests | Jasmine + Karma (`ng test`) |
| E2E tests | Playwright |
| Deployment | GitHub Pages (static build) |

## Target Module Structure

```
frontend/src/app/
├── app.component.ts          # Root shell — router outlet only
├── app.config.ts             # Application providers and DI registration
├── app.routes.ts             # Route definitions
├── core/                     # Cross-cutting concerns (not feature-specific)
│   ├── models/               # Domain DTOs and interfaces
│   └── services/             # Service interfaces, implementations, business logic
└── features/                 # Feature-scoped standalone components
    ├── main/                 # Shell / layout feature
    ├── tree-selection/       # Family tree dropdown and selection
    └── tree-visualization/   # Read-only tree rendering
```

### Layer responsibilities

| Folder | Responsibility |
|--------|----------------|
| `core/models/` | Typed DTOs shared across features (`FamilyTree`, `FamilyMemberSummary`, etc.) |
| `core/services/` | Injectable services, validation, layout algorithms; interface + implementation pairs |
| `features/<feature>/` | Standalone components with co-located `.html`, `.scss`, `.spec.ts` |
| Repository root `features/<feature>/` | Product documentation (plan, progress, memory) — not Angular code |

Static data lives outside the Angular app:

```
family-trees/                 # JSON data files (*.tree.json) + index manifest
```

## Routing Strategy

| Route | Component | Purpose |
|-------|-----------|---------|
| `''` | `MainViewComponent` | Default landing — tree selection + visualization |
| `'**'` | redirect to `''` | Catch-all fallback |

Routes are defined in `app.routes.ts` and registered via `provideRouter(routes)` in `app.config.ts`. Add new feature routes as standalone components are migrated; prefer lazy loading (`loadComponent`) when the app grows.

## Shared Component Strategy

| Concern | Approach |
|---------|----------|
| UI primitives | Angular Material components — do not rebuild standard controls |
| Cross-feature components | Place in `core/` only if truly shared; otherwise keep in the owning feature |
| Business logic | Services in `core/services/`, not in components |
| Service contracts | Define interfaces + `InjectionToken`; swap implementations (JSON → HTTP) without UI changes |
| Styling | Global tokens in `src/styles.scss`; component-scoped styles in `.scss` files |

Example service abstraction (already implemented):

```typescript
export interface IFamilyTreeService {
  listFamilyTrees(): Observable<FamilyTreeSummary[]>;
  getFamilyTree(treeId: string): Observable<FamilyTree>;
  getMembers(treeId: string): Observable<FamilyMemberSummary[]>;
  getMember(treeId: string, memberId: string): Observable<FamilyMemberDetail>;
}

export const FAMILY_TREE_SERVICE = new InjectionToken<IFamilyTreeService>('FAMILY_TREE_SERVICE');
```

V1 registers `JsonFamilyTreeService`; a future `HttpFamilyTreeService` implements the same interface.

## Testing Strategy

| Level | Tool | Scope |
|-------|------|-------|
| Unit | Jasmine + Karma | Services, validators, layout algorithms, component logic |
| E2E | Playwright | Primary user flows per feature/milestone |
| Integration | Component tests with mocked services | Feature components wired to `FAMILY_TREE_SERVICE` test doubles |

Every migrated feature must ship with unit tests and E2E coverage before the milestone is marked complete. During migration, maintain E2E tests for both legacy and new UI paths until the legacy path is removed.

---

# Migration Approach

## Core Principles

| Principle | Rule |
|-----------|------|
| **Strangler Fig Pattern** | Wrap legacy UI incrementally; new Angular features replace legacy modules one at a time |
| **Incremental migration** | One feature (vertical slice) per milestone — not a big-bang rewrite |
| **Coexistence** | Legacy and Angular 18 UI run side by side during migration (iframe, route-based, or hybrid shell) |
| **No big-bang rewrite** | Never delete the legacy frontend until all features are migrated and tested |
| **APIs unchanged** | Existing REST/SOAP endpoints, request/response shapes, and error codes remain as-is |
| **Backend unchanged** | No backend refactoring during frontend migration unless explicitly scoped |
| **Business rules unchanged** | Validation, authorization, and domain logic stay in the backend; frontend reimplements presentation only |

## Migration Workflow

1. **Inventory** — Complete the Current State sections above
2. **Map** — Fill in the Module Mapping table (legacy module → Angular feature)
3. **Abstract** — Define service interfaces matching existing API contracts
4. **Scaffold** — Angular 18 shell with routing that can host legacy and new UI
5. **Migrate** — One feature per milestone; ship tests with each slice
6. **Verify** — E2E parity checks between legacy and new UI for each migrated feature
7. **Retire** — Remove legacy module only after the replacement is deployed and verified

## Coexistence Patterns

| Pattern | When to use |
|---------|-------------|
| **Route-based** | Legacy app at `/legacy/*`, Angular at `/app/*` — simplest for SPAs |
| **Iframe embedding** | Legacy modules cannot be routed independently |
| **Hybrid shell** | New Angular shell with lazy-loaded legacy bundles for unmigrated features |
| **Component-level** | Single page with mixed legacy widgets and Angular components (highest complexity — avoid unless necessary) |

## What Does Not Change During Migration

- Backend services, databases, and deployment
- API URLs, authentication tokens, and session handling
- Business validation rules enforced server-side
- Existing user permissions and role models
- Data contracts documented in `knowledge/architecture/api-contracts.md`

---

# Module Mapping

Map every legacy module to its target Angular feature before implementation begins. Update this table as migration progresses.

## Mapping Template

| Legacy module / screen | Legacy path | Target Angular feature | Target component(s) | API dependencies | Migration status |
|----------------------|-------------|------------------------|---------------------|------------------|------------------|
| e.g. Tree list page | `app/modules/tree/tree-list.js` | `features/tree-selection/` | `TreeSelectionComponent` | `GET /api/trees` | Pending |
| e.g. Tree viewer | `app/modules/tree/tree-view.js` | `features/tree-visualization/` | `TreeVisualizationComponent` | `GET /api/trees/:id/members` | Pending |
| e.g. Member detail | `app/modules/member/detail.js` | `features/member-detail/` | `MemberDetailComponent` | `GET /api/trees/:id/members/:memberId` | Pending |

**Status values:** `Pending` → `In Progress` → `Complete` → `Legacy Retired`

## This Repository (Greenfield Reference)

This project has no legacy modules. The table below maps **product features** to **Angular implementation** as the target-state reference:

| Product feature | Documentation | Angular location | Key component(s) | Data source | Status |
|-----------------|---------------|------------------|------------------|-------------|--------|
| Project scaffold | `features/project-scaffold/` | `frontend/` root, `app.config.ts`, deployment | `AppComponent`, `MainViewComponent` | — | Complete |
| Family tree selection | `features/family-tree-selection/` | `features/tree-selection/` | `TreeSelectionComponent` | `IFamilyTreeService.listFamilyTrees()`, `.getFamilyTree()` | Complete |
| Tree visualization | `features/tree-visualization/` | `features/tree-visualization/` | `TreeVisualizationComponent` | `IFamilyTreeService.getMembers()` | Complete |
| Member detail | `features/member-detail/` (pending) | `features/member-detail/` (planned) | `MemberDetailComponent` (planned) | `IFamilyTreeService.getMember()` | Pending |
| Service abstraction | (embedded in family-tree-selection) | `core/services/` | `JsonFamilyTreeService` | `family-trees/*.tree.json` | Complete |

When adding a new feature to this app, add a row to this table and create the corresponding folder under both `features/` (docs) and `frontend/src/app/features/` (code).

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `knowledge/application-landscape.md` | Current state inventory and migration dashboards (read **before** this document) |
| `knowledge/coding-standards.md` | Target coding and testing standards |
| `knowledge/architecture-decisions.md` | Approved architecture decisions (ADRs) |
| `knowledge/architecture/api-contracts.md` | Data and service contract shapes |
| `knowledge/design-system-rules.md` | UI and Material Design conventions |
| `plan.md` | Product scope and milestones (read **after** this document) |
| `progress.md` | Current milestone status (read **after** this document) |

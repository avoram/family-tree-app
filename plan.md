# Family Tree Application

## Vision

Build a simple Family Tree application that allows anyone to **view** genealogical relationships through an interactive tree structure.

Version 1 is a **read-only, frontend-only** experience. Family tree data is bundled as JSON files within the application. The app opens directly to tree selection — there is no login screen, no backend, and no data modification in the UI.

---

## Goals

### Family Tree Viewing

- Automatically discover and load available family tree JSON files
- Select a family tree from a dropdown
- View the selected tree hierarchy
- View member details from the tree

### Tree Visualization

- Display family members in a tree structure
- Navigate between generations
- Expand and collapse branches
- View member details

### Data Architecture (V1)

- Store family tree definitions as JSON files in a dedicated `family-trees/` folder
- Expose data to the UI through a **service abstraction layer** shaped like a future API
- Keep all access read-only in V1

---

## User Experience (V1)

The application is open and public. Any visitor can:

- Open the application and land directly on the main view (no login screen)
- See a dropdown of all available family trees (auto-discovered from JSON files)
- Select any family tree from the dropdown
- Explore the tree visualization (read-only)
- View member details (read-only)

All family trees bundled in the application are publicly viewable. All data is read-only. Write operations (create, update, delete) are out of scope for V1.

---

## Domain Model

### Key Entities

| Entity | Description |
|--------|-------------|
| `FamilyTree` | Named container for a family's members and relationships |
| `FamilyMember` | A person node within a family tree |

### Family Tree Structure

- One `FamilyTree` contains many `FamilyMember` records.
- Each member may reference one father, one mother, and optionally one spouse.
- Parent-child links define generations.
- Spouse links are peer-level relationships between members.
- The UI renders this as an expandable, generation-based tree.

### Family Member Fields

Each family member supports:

- First Name
- Last Name
- Gender
- Date of Birth (optional)
- Father (optional reference)
- Mother (optional reference)
- Spouse (optional reference)
- Notes (optional)

### JSON Storage

Family trees are stored as individual JSON files:

```
family-trees/
├── family1.tree.json
├── family2.tree.json
└── family3.tree.json
```

File naming convention: `*.tree.json`. Each file contains one complete family tree definition (metadata and members). See [knowledge/architecture/api-contracts.md](knowledge/architecture/api-contracts.md) for the JSON schema and service contract shapes.

---

## Initial Features (V1)

1. Family tree discovery and dropdown selection
2. Family tree visualization (read-only)
3. Family member detail view (read-only)
4. Service abstraction layer for data access (JSON-backed, API-ready)

## Feature index

Product features are documented under `features/`. Service abstraction (item 4 above) is implemented inside the first feature, not as a separate folder.

| Feature | Folder | Milestones | Status |
|---------|--------|------------|--------|
| Project scaffold | [features/project-scaffold/](features/project-scaffold/) | 1 | Planned |
| Family tree selection | [features/family-tree-selection/](features/family-tree-selection/) | 2, 3 | Planned |
| Tree visualization | [features/tree-visualization/](features/tree-visualization/) | 4 | Complete |
| Member detail | `features/member-detail/` | 5 | Pending |

Milestone 6 (release hardening) is tracked in [progress.md](progress.md) only.

---

## Development and Deployment Strategy

**Deploy early.** The first milestone includes a live deployment to GitHub Pages so the app runs on a free public URL from the start. Each subsequent milestone redeploys to the same GitHub Pages site as features land.

- Milestone 1: scaffold the app **and** deploy to GitHub Pages (first public URL)
- Milestones 2–5: develop features locally; redeploy to GitHub Pages when each milestone completes
- Milestone 6: final hardening and production-ready deployment

No backend or paid hosting is required — GitHub Pages hosts the static Angular build.

---

## Implementation Milestones

Development proceeds one milestone at a time. Each milestone is a small vertical slice sized for a single AI session. Milestone status is tracked in [progress.md](progress.md).

| # | Milestone | Outcome |
|---|-----------|---------|
| 1 | Project scaffold + first deploy | Angular 18 app; `family-trees/` sample JSON; GitHub Pages config; **live deployment on free GitHub Pages URL** |
| 2 | Family tree service abstraction | Service interfaces shaped like a future REST API; JSON file loader and tree discovery |
| 3 | Family tree dropdown + selection | Auto-discover trees; dropdown lists available trees; load and hold selected tree |
| 4 | Read-only tree visualization | Expandable generation-based tree view |
| 5 | Member detail panel (read-only) | Click node to view member profile and relationships |
| 6 | V1 release hardening | Mobile checks, full test suite, docs sync |

---

## Success Criteria (V1)

- Application is hosted on GitHub Pages with a public URL (deployed from Milestone 1 onward)
- Application opens directly to the main view with a tree dropdown (no login screen)
- All bundled family trees appear in the dropdown (discovered from JSON files)
- Visitor can select any family tree and see it rendered in the visualization
- Visitor can navigate generations and expand/collapse branches
- Visitor can view member details from a tree node
- All interactions are read-only
- Data access goes through the service abstraction layer (not direct JSON reads from components)

---

## Technical Constraints

- Zero-cost solution
- **Frontend-only:** Angular 18 (see `knowledge/coding-standards.md`)
- **No backend** in V1
- **No database** in V1
- **Data:** JSON files in `family-trees/`
- **Deployment:** GitHub Pages (frontend only)
- Mobile-friendly interface

---

## Architecture Goal

Design the UI as if data comes from an API:

- Components depend on **service interfaces**, not JSON file paths
- V1 implements those services by loading bundled JSON
- A future backend can replace the JSON implementation without major UI changes

See [knowledge/architecture-decisions.md](knowledge/architecture-decisions.md) and [knowledge/architecture/api-contracts.md](knowledge/architecture/api-contracts.md).

---

## Quality Standards

Every feature and milestone must include:

- **Unit tests** covering core logic and components
- **End-to-end tests** covering the primary user flow for that feature

A milestone is not complete until its tests pass and documentation is updated per the AI bootstrap Definition of Done.

---

## Out Of Scope (Version 1)

- Backend API and server deployment
- Database and persistent storage
- Login screen and identity management
- Create, update, or delete family trees, members, or relationships
- Email verification
- Family invitations
- Notifications
- DNA integrations
- Genealogy research
- Bulk import/export

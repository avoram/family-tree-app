# Project Progress

Tracks implementation milestones defined in [plan.md](plan.md).

Move items between sections as work completes. Only one milestone should be **In Progress** at a time.

---

## Completed

### Milestone 1: Project scaffold + first deploy

Tracked in [features/project-scaffold/progress.md](features/project-scaffold/progress.md).

- Angular 18 application scaffold (standalone components, Angular Material)
- `family-trees/` folder with sample `*.tree.json` files
- Main view shell with tree dropdown (no login screen)
- Unit tests and E2E test harness (Playwright)
- GitHub Pages deployment configured and live at https://avoram.github.io/family-tree-app/

### Milestone 2: Family tree service abstraction

Tracked in [features/family-tree-selection/progress.md](features/family-tree-selection/progress.md) (Phase A).

- DTO models and `IFamilyTreeService` interface with injection token
- `JsonFamilyTreeService` loads trees via `family-trees/index.json` manifest
- Domain validation at load time; invalid files skipped
- Provider registered in `app.config.ts`
- Unit tests for validation and service layer

---

## In Progress

- None

---

## Pending

### Milestone 3: Family tree dropdown + selection

Tracked in [features/family-tree-selection/progress.md](features/family-tree-selection/progress.md) (Phase B).

- Dropdown populated with all discovered family trees (publicly viewable)
- Visitor selects a tree; application loads that tree's data via the service layer
- Selected tree held in application state (signals)
- Unit tests and E2E tests for tree selection flow
- **Pending:** GitHub Pages redeploy (Phase C)

### Milestone 4: Read-only tree visualization

- Display family members in a generation-based tree
- Expand and collapse branches
- Navigate between generations
- Unit tests and E2E tests for tree visualization

### Milestone 5: Member detail panel (read-only)

- Click a tree node to view member details
- Show name, gender, date of birth, notes, and relationship summary
- Unit tests and E2E tests for detail panel

### Milestone 6: V1 release hardening

- Mobile-friendly layout verification
- Full test suite passing
- Knowledge docs and feature documentation synced

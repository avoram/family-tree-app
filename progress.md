# Project Progress

Tracks implementation milestones defined in [plan.md](plan.md).

Move items between sections as work completes. Only one milestone should be **In Progress** at a time.

**Live URL:** https://avoram.github.io/family-tree-app/

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

### Milestone 3: Family tree dropdown + selection

Tracked in [features/family-tree-selection/progress.md](features/family-tree-selection/progress.md) (Phases B–C).

- `TreeSelectionComponent` with Angular Material dropdown wired to `listFamilyTrees()`
- Visitor selects a tree; app loads tree data via `getFamilyTree()` and holds `selectedTree` in signals
- Main view placeholder dropdown replaced; selected tree shown in UI
- Unit tests and E2E tests for tree selection flow
- Redeployed to GitHub Pages

### Milestone 4: Read-only tree visualization

Tracked in [features/tree-visualization/progress.md](features/tree-visualization/progress.md).

- `buildFamilyTreeLayout()` — generation-based hierarchy from flat member list
- `TreeVisualizationComponent` with expand/collapse and spouse grouping
- Wired into main view; loads members via `getMembers()`
- Unit tests and E2E tests for tree visualization
- Redeployed to GitHub Pages

### Milestone 5: Member detail panel (read-only)

Tracked in [features/member-detail/progress.md](features/member-detail/progress.md).

- Click a tree node to open member details (side panel on desktop, stacked on mobile)
- Show name, gender, date of birth, notes, and relationship summary
- Photos linked via JSON `photoUrl` (e.g. `"photos/vora/mayank.jpg"`)
- Empty placeholder when `photoUrl` is missing or the image file is not found
- Redeployed to GitHub Pages

### Member search (within selected tree)

Tracked in [features/member-search/progress.md](features/member-search/progress.md).

- Search box on the tree view filters by first name, last name, or full name
- Matching members are listed as chips and highlighted in the tree
- Branches auto-expand so matches are visible
- Click a match to open the member detail panel
- Redeployed to GitHub Pages

### Sample family data (current)

- **Ojha Family** — `family-trees/ojha.tree.json` / `frontend/public/photos/ojha/`
- **Jani Family** — `family-trees/jani.tree.json` / `frontend/public/photos/jani/`
- **Vora Family** — `family-trees/vora.tree.json` / `frontend/public/photos/vora/`
- Old sample trees (Family One / Patel / typo `vorafamiliy`) removed
- Asset serving fixed so `*.tree.json` files are included in the build

---

## In Progress

- None

---

## Pending

### Milestone 6: V1 release hardening

- Full test suite passing (unit + E2E coverage for search / detail gaps)
- Final knowledge / feature documentation sync pass
- Optional: further mobile polish verification

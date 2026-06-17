# Tree Visualization — Development Plan

Implementation plan for Milestone 4. See [plan.md](plan.md) for product requirements.

**Prerequisite:** Milestones 2–3 complete (`IFamilyTreeService`, `TreeSelectionComponent`, `selectedTree` signal on main view).

---

## Phase A: Layout model

**Location:** `frontend/src/app/core/services/family-tree-layout.ts`

Pure functions — no Angular dependencies.

| Function | Purpose |
|----------|---------|
| `buildFamilyTreeLayout(members)` | Flat `FamilyMemberSummary[]` → hierarchical `FamilyTreeLayout` |
| `getMemberDisplayName(member)` | Format `firstName lastName` for labels |

**Layout types:**

- `FamilyTreeCouple` — primary member + optional spouse
- `FamilyTreeLayoutNode` — couple, children, generation index
- `FamilyTreeLayout` — roots, generation count, members grouped by generation

**Algorithm:**

1. Map members by id
2. Find roots (members not referenced as father/mother of any other member)
3. Recursively build nodes: group spouses, find shared children, deduplicate via visited set
4. Assign generation numbers (roots = 0, children = parent + 1)

**Tests:** `family-tree-layout.spec.ts` using `family1` (single generation couple) and `family2` (three generations) member shapes.

---

## Phase B: Visualization component

**Location:** `frontend/src/app/features/tree-visualization/`

| File | Purpose |
|------|---------|
| `tree-visualization.component.ts` | Loads members via `getMembers()`, builds layout, manages expand/collapse |
| `tree-visualization.component.html` | Nested tree UI with generation sections |
| `tree-visualization.component.scss` | Spacing, spouse grouping, generation labels |
| `tree-visualization.component.spec.ts` | Unit tests |

**Behaviour:**

1. `@Input({ required: true }) tree: FamilyTree` — when tree changes, call `getMembers(tree.id)`
2. Build layout from loaded members
3. `expandedNodeIds` signal — default all nodes expanded
4. Toggle expand/collapse per node (keyboard accessible button)
5. Generation navigator — `mat-select` to jump to generation section (`scrollIntoView`)
6. `memberSelected = output<FamilyMemberSummary>()` — for Milestone 5; nodes are clickable buttons
7. Loading and empty states

**Main view wiring:**

Replace placeholder `<p>` in `main-view.component.html` with:

```html
<app-tree-visualization [tree]="tree" />
```

---

## Phase C: Tests + deploy

### Unit tests

- `family-tree-layout.spec.ts` — roots, generations, spouse grouping, children dedup
- `tree-visualization.component.spec.ts` — renders members, expand/collapse, generation nav
- Update `main-view.component.spec.ts` — tree viz component present when tree selected

### E2E (`frontend/e2e/app.spec.ts`)

| Test | Steps |
|------|-------|
| Visualization renders members | Select **Patel Family** → expect **Ramesh Patel**, **Anika Patel** visible in tree area |

### Deploy

```bash
cd frontend
npm test
npm run e2e
npm run build:gh-pages && npm run deploy
```

Update [progress.md](progress.md), [memory.md](memory.md), and program [progress.md](../../progress.md).

---

## File layout (after Phase B)

```
frontend/src/app/
├── core/
│   └── services/
│       ├── family-tree-layout.ts
│       └── family-tree-layout.spec.ts
└── features/
    ├── main/
    │   └── main-view.component.*
    └── tree-visualization/
        ├── tree-visualization.component.ts
        ├── tree-visualization.component.html
        ├── tree-visualization.component.scss
        └── tree-visualization.component.spec.ts
```

---

## Definition of done

- All acceptance criteria in [plan.md](plan.md) met
- Unit and E2E tests passing
- [progress.md](progress.md) and [memory.md](memory.md) updated
- Program [progress.md](../../progress.md) Milestone 4 moved to Completed

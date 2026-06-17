# Family Tree Selection — Development Plan

Implementation plan for Milestones 2 and 3. See [plan.md](plan.md) for product requirements.

**Prerequisite:** Milestone 1 complete (`frontend/` scaffold, sample JSON, main view shell, GitHub Pages URL).

---

## Phase A: Service abstraction (Milestone 2) — Complete

Phase A is implemented. Use these artifacts in Phase B:

| Artifact | Location |
|----------|----------|
| DTO models | `frontend/src/app/core/models/` |
| `IFamilyTreeService` + token | `frontend/src/app/core/services/family-tree.service.ts` |
| JSON implementation | `frontend/src/app/core/services/json-family-tree.service.ts` |
| Domain validation | `frontend/src/app/core/services/family-tree-validation.ts` |
| Provider | `app.config.ts` — `{ provide: FAMILY_TREE_SERVICE, useClass: JsonFamilyTreeService }` |
| Manifest | `family-trees/index.json` → `family1.tree.json`, `family2.tree.json` |
| Sample tree names | **Family One** (`family1`), **Patel Family** (`family2`) |

Do not re-implement service-layer work in Phase B. Components inject `FAMILY_TREE_SERVICE` only.

---

## Phase B: Dropdown + selection (Milestone 3)

Wire the Milestone 1 dropdown placeholder to the service layer. Visitors pick a tree from a live list; the app loads tree metadata and holds selection in signals for the tree-visualization feature (Milestone 4).

### Implementation order

Work top to bottom. Each step should compile and have tests before moving on.

---

### Step 1 — `TreeSelectionComponent` (dropdown UI)

**Location:** `frontend/src/app/features/tree-selection/`

| File | Purpose |
|------|---------|
| `tree-selection.component.ts` | Standalone component; injects `FAMILY_TREE_SERVICE` |
| `tree-selection.component.html` | `mat-form-field` + `mat-select` + `mat-option` |
| `tree-selection.component.scss` | Dropdown width (reuse `.tree-select` rules from main view) |
| `tree-selection.component.spec.ts` | Unit tests (Step 4) |

**Behaviour:**

1. On init, call `listFamilyTrees()` and expose results as a signal (e.g. `toSignal(..., { initialValue: [] })`).
2. Bind `mat-option` values to `FamilyTreeSummary.id`; display `FamilyTreeSummary.name`.
3. Use `selectedTreeId = model<string | null>(null)` for two-way binding with the parent.
4. On `mat-select` selection change:
   - Update `selectedTreeId`.
   - Call `getFamilyTree(treeId)` and emit the result via `treeSelected = output<FamilyTree>()`.
5. Do **not** hardcode tree names or IDs — options come only from `listFamilyTrees()`.

**UI states:**

| State | UX |
|-------|-----|
| Loading | Disable `mat-select` until the first `listFamilyTrees()` emission completes |
| Empty list | Enable `mat-select`; show a single disabled option or inline message: no family trees available |
| Error loading list | Log via `console.warn`; treat as empty list (service already skips invalid files) |

**Accessibility** ([accessibility-standards.md](../../knowledge/accessibility-standards.md)):

- Keep `mat-label` text **Family tree** (matches existing E2E `getByRole('combobox', { name: 'Family tree' })`).
- Rely on Material's keyboard support for `mat-select`; do not add custom keyboard handlers unless a gap is found.

**Design** ([design-system-rules.md](../../knowledge/design-system-rules.md)):

- Angular Material `mat-form-field` with `appearance="outline"`.
- Users must always know which tree is selected — the `mat-select` trigger shows the chosen tree name.

---

### Step 2 — Application state in `MainViewComponent`

**Location:** `frontend/src/app/features/main/`

Own selection state in the main view so Milestone 4 (tree visualization) can read it from the same parent.

**Signals:**

```typescript
readonly selectedTree = signal<FamilyTree | null>(null);
```

**Template wiring:**

1. Replace the disabled placeholder `mat-select` block with `<app-tree-selection />`.
2. Bind two-way: `[(selectedTreeId)]` is optional; at minimum handle `(treeSelected)` to call `selectedTree.set(tree)`.
3. Remove `placeholderTrees` from `main-view.component.ts`.
4. Remove unused `MatFormFieldModule` / `MatSelectModule` imports from main view if moved into `TreeSelectionComponent`.

**Selected-tree indicator** (user story: "I can tell which tree is currently selected"):

- Primary indicator: `mat-select` trigger text shows the selected tree name.
- Secondary indicator: update the tree-area placeholder to show the selected tree name and description when set, e.g. `Selected: Family One — Example family tree`; revert to the generic placeholder when `selectedTree()` is `null`.

Do **not** auto-select the first tree on load — selection is explicit per [plan.md](plan.md) user stories.

---

### Step 3 — Wire main view

**Changes to `main-view.component.html`:**

```html
<app-tree-selection
  (treeSelected)="onTreeSelected($event)"
/>
```

(or equivalent two-way `selectedTreeId` binding if the parent needs the ID for routing later).

**Changes to `main-view.component.ts`:**

- Import `TreeSelectionComponent`.
- Add `onTreeSelected(tree: FamilyTree): void` → `this.selectedTree.set(tree)`.
- Inject `FAMILY_TREE_SERVICE` only if main view needs it directly; prefer keeping service calls inside `TreeSelectionComponent`.

**Constraint:** No component imports JSON paths or calls `HttpClient` for tree files — service layer only.

---

### Step 4 — Unit tests

#### `tree-selection.component.spec.ts`

Provide a mock `IFamilyTreeService`:

```typescript
const mockService = {
  listFamilyTrees: () => of([
    { id: 'family1', name: 'Family One', description: 'Example family tree' },
    { id: 'family2', name: 'Patel Family', description: 'Three-generation example family tree' },
  ]),
  getFamilyTree: (id: string) => of({ id, name: id === 'family1' ? 'Family One' : 'Patel Family', description: null }),
  getMembers: () => of([]),
  getMember: () => throwError(() => new Error('not used')),
};
```

| Test | Assertion |
|------|-----------|
| Creates | Component renders |
| Lists trees | Both tree names appear as `mat-option` text after `fixture.detectChanges()` + async tick |
| Selection loads tree | Selecting `family2` emits `treeSelected` with `id: 'family2'` |
| Empty list | `listFamilyTrees` returns `[]` → appropriate empty-state message or disabled option |
| Loading | `mat-select` disabled until list resolves (optional if trivial to test) |

Use `provideAnimationsAsync()` in `TestBed` (same as existing main-view spec).

#### `main-view.component.spec.ts` (update)

| Test | Assertion |
|------|-----------|
| Renders `app-tree-selection` | Query `TreeSelectionComponent` or host element |
| Selection updates display | Emit `treeSelected` from child stub → tree-area shows selected tree name |
| No placeholder data | `placeholderTrees` removed; no "Sample Family 1" text |

Mock `TreeSelectionComponent` as a stub with `output()` / `input()` if full integration is heavy.

---

### Step 5 — E2E tests (Playwright)

**File:** `frontend/e2e/app.spec.ts`

Extend the existing test (do not remove the main-view smoke assertions).

| Test | Steps |
|------|-------|
| Dropdown lists bundled trees | `page.goto('/')` → open combobox → expect **Family One** and **Patel Family** visible |
| Selection updates UI | Select **Patel Family** → combobox shows **Patel Family** → tree-area shows selected-tree text |

**Selectors:** Prefer `getByRole('combobox', { name: 'Family tree' })` and `getByRole('option', { name: '...' })` for accessibility-aligned locators.

**Note:** Dropdown must be **enabled** (remove Milestone 1 `disabled` attribute).

---

### Step 6 — Validate

Before marking Phase B complete:

```bash
cd frontend
npm test          # unit tests
npm run e2e       # Playwright
npm run build     # production build
```

Update [progress.md](progress.md) and [memory.md](memory.md). Move program [progress.md](../../progress.md) Milestone 3 to Completed after Phase B + Phase C deploy.

---

## Phase C: Deploy

- Verify `npm run build` succeeds
- Redeploy to GitHub Pages (`npm run build:gh-pages` && `npm run deploy` in `frontend/`)
- Record deployment URL in [memory.md](memory.md)

---

## File layout (after Phase B)

```
frontend/src/app/
├── core/
│   ├── models/
│   │   ├── family-tree-summary.model.ts
│   │   ├── family-tree.model.ts
│   │   ├── family-member-summary.model.ts
│   │   ├── family-member-detail.model.ts
│   │   └── family-tree-json.model.ts
│   └── services/
│       ├── family-tree.service.ts
│       ├── json-family-tree.service.ts
│       └── family-tree-validation.ts
├── features/
│   ├── main/
│   │   ├── main-view.component.ts
│   │   ├── main-view.component.html
│   │   ├── main-view.component.scss
│   │   └── main-view.component.spec.ts
│   └── tree-selection/
│       ├── tree-selection.component.ts
│       ├── tree-selection.component.html
│       ├── tree-selection.component.scss
│       └── tree-selection.component.spec.ts
└── app.config.ts
```

---

## Definition of done

- Phase B tasks in [progress.md](progress.md) checked off
- Dropdown populated from `listFamilyTrees()` — no hardcoded tree list
- Selecting a tree calls `getFamilyTree(treeId)` and updates `selectedTree` signal
- All unit and E2E tests passing
- [progress.md](progress.md) and [memory.md](memory.md) updated
- Program [progress.md](../../progress.md) Milestone 3 moved to Completed (after Phase C deploy)

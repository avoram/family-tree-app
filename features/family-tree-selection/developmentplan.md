# Family Tree Selection — Development Plan

Implementation plan for Milestones 2 and 3. See [plan.md](plan.md) for product requirements.

**Prerequisite:** Milestone 1 complete (`frontend/` scaffold, sample JSON, main view shell, Vercel URL).

---

## Phase A: Service abstraction (Milestone 2)

### Models

Create typed DTOs under `frontend/src/app/core/models/`:

- `family-tree-summary.model.ts`
- `family-tree.model.ts`
- `family-member-summary.model.ts`
- `family-member-detail.model.ts`

Shapes match [api-contracts.md](../../knowledge/architecture/api-contracts.md).

### Service interface

`frontend/src/app/core/services/family-tree.service.ts`:

- Export `IFamilyTreeService` interface
- Export injection token `FAMILY_TREE_SERVICE`
- Methods: `listFamilyTrees()`, `getFamilyTree()`, `getMembers()`, `getMember()`

### JSON implementation

`frontend/src/app/core/services/json-family-tree.service.ts`:

- Implement `IFamilyTreeService`
- Discover trees via a static manifest or asset listing (e.g. `family-trees/index.json` generated at build, or explicit asset paths in Angular config)
- Fetch and parse `family-trees/*.tree.json` as bundled assets
- Map JSON to DTOs; derive `treeId` on members when mapping to `FamilyMemberDetail`
- Validate against [domain-rules.md](../../knowledge/domain-rules.md) at load time
- Skip invalid files; log errors; return empty/error for missing tree

### Provider registration

In `frontend/src/app/app.config.ts`:

```typescript
{ provide: FAMILY_TREE_SERVICE, useClass: JsonFamilyTreeService }
```

### Unit tests

- JSON parsing and DTO mapping
- Domain validation (invalid references, circular parents skipped or errored)
- `listFamilyTrees()` returns summaries for all valid files
- `getFamilyTree()` / `getMembers()` / `getMember()` for known fixture trees

---

## Phase B: Dropdown + selection (Milestone 3)

### UI component

`frontend/src/app/features/tree-selection/` (or integrate into existing main view):

- `tree-selection.component.ts` — standalone, Angular Material `mat-select`
- Bind options to `listFamilyTrees()` result
- On selection change: call `getFamilyTree(treeId)`, update `selectedTreeId` signal
- Show selected tree name in UI per [design-system-rules.md](../../knowledge/design-system-rules.md)
- Accessible label for dropdown per [accessibility-standards.md](../../knowledge/accessibility-standards.md)

### Application state

- `selectedTreeId` signal (and optionally `selectedTree` signal with metadata)
- State owned by main view or a small selection service; tree-visualization feature will read this later

### Wire main view

- Replace Milestone 1 dropdown placeholder with `TreeSelectionComponent`
- Inject `FAMILY_TREE_SERVICE` only in components/services — never JSON paths

### Unit tests

- Component renders tree options from mocked service
- Selection updates `selectedTreeId` signal
- Empty list shows appropriate message

### E2E tests (Playwright)

- App loads on main view
- Dropdown contains expected tree names from sample JSON
- Selecting a tree updates visible selection state

---

## Phase C: Deploy

- Verify `npm run build` succeeds
- Redeploy to Vercel (same project as Milestone 1)
- Record deployment URL in [memory.md](memory.md)

---

## Suggested file layout

```
frontend/src/app/
├── core/
│   ├── models/
│   │   ├── family-tree-summary.model.ts
│   │   ├── family-tree.model.ts
│   │   ├── family-member-summary.model.ts
│   │   └── family-member-detail.model.ts
│   └── services/
│       ├── family-tree.service.ts
│       └── json-family-tree.service.ts
├── features/
│   ├── main/
│   │   └── main-view.component.ts
│   └── tree-selection/
│       ├── tree-selection.component.ts
│       └── tree-selection.component.spec.ts
└── app.config.ts
```

---

## Definition of done

- Phase A and B tasks complete per [progress.md](progress.md)
- All unit and E2E tests passing
- [progress.md](progress.md) and [memory.md](memory.md) updated
- Program [progress.md](../../progress.md) milestones 2 and 3 moved to Completed

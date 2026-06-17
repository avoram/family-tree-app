# Family Tree Selection — Progress

Tracks Phase A (Milestone 2) and Phase B (Milestone 3) from [developmentplan.md](developmentplan.md).

Only one phase should be **In Progress** at a time. Prerequisite: [Milestone 1](../../progress.md) complete.

---

## Completed

### Phase A: Service abstraction (Milestone 2)

- [x] DTO model interfaces in `frontend/src/app/core/models/`
- [x] `IFamilyTreeService` interface and `FAMILY_TREE_SERVICE` injection token
- [x] `JsonFamilyTreeService` — discover, load, parse `family-trees/*.tree.json`
- [x] Domain validation at load time
- [x] Provider registration in `app.config.ts`
- [x] Unit tests for service layer and JSON parsing

---

## In Progress

- None

---

## Pending

### Phase B: Dropdown + selection (Milestone 3)

- [ ] `TreeSelectionComponent` with Angular Material dropdown
- [ ] Wire dropdown to `listFamilyTrees()`
- [ ] Selection calls `getFamilyTree()`; state via signals
- [ ] Replace main view dropdown placeholder
- [ ] Unit tests for selection component
- [ ] E2E test: dropdown lists trees and selection works

### Phase C: Deploy

- [ ] Build passes; redeploy to GitHub Pages
- [ ] Update [memory.md](memory.md) with deployment URL

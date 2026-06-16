# Family Tree Selection — Progress

Tracks Phase A (Milestone 2) and Phase B (Milestone 3) from [developmentplan.md](developmentplan.md).

Only one phase should be **In Progress** at a time. Prerequisite: [Milestone 1](../../progress.md) complete.

---

## Completed

- None

---

## In Progress

- None

---

## Pending

### Phase A: Service abstraction (Milestone 2)

- [ ] DTO model interfaces in `frontend/src/app/core/models/`
- [ ] `IFamilyTreeService` interface and `FAMILY_TREE_SERVICE` injection token
- [ ] `JsonFamilyTreeService` — discover, load, parse `family-trees/*.tree.json`
- [ ] Domain validation at load time
- [ ] Provider registration in `app.config.ts`
- [ ] Unit tests for service layer and JSON parsing

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

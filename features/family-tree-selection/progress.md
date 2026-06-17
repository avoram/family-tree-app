# Family Tree Selection — Progress

Tracks Phases A–C (Milestones 2–3) from [developmentplan.md](developmentplan.md).

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

### Phase B: Dropdown + selection (Milestone 3)

- [x] `TreeSelectionComponent` with Angular Material dropdown
- [x] Wire dropdown to `listFamilyTrees()`
- [x] Selection calls `getFamilyTree()`; state via signals
- [x] Replace main view dropdown placeholder
- [x] Unit tests for selection component
- [x] E2E test: dropdown lists trees and selection works

### Phase C: Deploy

- [x] Build passes; redeploy to GitHub Pages
- [x] Update [memory.md](memory.md) with deployment URL

---

## In Progress

- None

---

## Pending

- None

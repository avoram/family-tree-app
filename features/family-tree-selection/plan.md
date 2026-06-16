# Family Tree Selection

## Summary

First user-facing V1 feature. Visitors discover all bundled family trees via a dropdown and select one to load. Includes the JSON-backed service abstraction layer (Milestone 2) and dropdown UI (Milestone 3).

**Program milestones:** 2, 3  
**Prerequisite:** [Milestone 1](../../progress.md) (project scaffold + first GitHub Pages deploy) must be complete.

---

## User Stories

1. As a visitor, I open the app and see a dropdown of all available family trees without logging in.
2. As a visitor, I can select any tree from the dropdown and the app loads that tree's data.
3. As a visitor, I can tell which tree is currently selected.

---

## Acceptance Criteria

- [ ] Dropdown is populated from `listFamilyTrees()` — no hardcoded tree list in components
- [ ] All valid `family-trees/*.tree.json` files appear in the dropdown
- [ ] Selecting a tree calls `getFamilyTree(treeId)` and holds selection in application state (signals)
- [ ] Invalid JSON files are skipped without breaking the app
- [ ] No login screen; all bundled trees are publicly viewable
- [ ] Components do not import or parse JSON files directly
- [ ] Unit tests cover service layer, JSON parsing/validation, and dropdown component
- [ ] E2E test covers: app loads → dropdown lists trees → selection loads tree metadata
- [ ] Feature redeployed to GitHub Pages when complete

---

## In Scope

- DTO types: `FamilyTreeSummary`, `FamilyTree`, `FamilyMemberSummary` (see [api-contracts.md](../../knowledge/architecture/api-contracts.md))
- `IFamilyTreeService` interface + `JsonFamilyTreeService` implementation
- Auto-discovery of `family-trees/*.tree.json`
- Domain validation at load time per [domain-rules.md](../../knowledge/domain-rules.md)
- Angular Material dropdown on main view
- Selected tree state via Angular signals
- `getMember()` on service interface (implementation only; no UI consumer until member-detail feature)

---

## Out of Scope

- Tree visualization rendering ([tree-visualization](../tree-visualization/) — Milestone 4)
- Member detail panel ([member-detail](../member-detail/) — Milestone 5)
- Create, update, or delete operations
- Backend API or authentication

---

## References

- [Program plan](../../plan.md)
- [Program progress](../../progress.md)
- [Development plan](developmentplan.md)
- [Feature progress](progress.md)
- [api-contracts.md](../../knowledge/architecture/api-contracts.md)
- [domain-rules.md](../../knowledge/domain-rules.md)
- [design-system-rules.md](../../knowledge/design-system-rules.md)

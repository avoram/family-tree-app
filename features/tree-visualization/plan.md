# Tree Visualization

## Summary

Read-only generation-based family tree visualization (Milestone 4). Visitors who have selected a family tree see members arranged by generation with expand/collapse and generation navigation.

**Program milestone:** 4  
**Prerequisite:** [Milestone 3](../../progress.md) (family tree selection) must be complete.

---

## User Stories

1. As a visitor, after selecting a family tree, I see its members displayed in a generation-based tree structure.
2. As a visitor, I can expand and collapse branches to focus on parts of the tree.
3. As a visitor, I can navigate between generations to explore the tree.
4. As a visitor, I can see spouse relationships visually grouped with their partner.

---

## Acceptance Criteria

- [ ] Visualization renders when a tree is selected in the main view
- [ ] Members are arranged by generation (roots at top, children below)
- [ ] Spouses appear grouped at the same generation level
- [ ] Branches can be expanded and collapsed
- [ ] Generation navigation allows jumping between generation levels
- [ ] Components load member data via `getMembers()` — no direct JSON reads
- [ ] Tree nodes are keyboard accessible with meaningful labels
- [ ] Unit tests cover layout model and visualization component
- [ ] E2E test covers: select tree → visualization renders members
- [ ] Feature redeployed to GitHub Pages when complete

---

## In Scope

- Pure layout function: `FamilyMemberSummary[]` → hierarchical generation model
- `TreeVisualizationComponent` under `frontend/src/app/features/tree-visualization/`
- Wire into `MainViewComponent` tree area (replaces placeholder text)
- `memberSelected` output on nodes (no detail panel yet — Milestone 5)
- Expand/collapse state via Angular signals
- Generation navigator (jump to generation N)

---

## Out of Scope

- Member detail panel ([member-detail](../member-detail/) — Milestone 5)
- Create, update, or delete operations
- Backend API or authentication
- Advanced graph layout (SVG/canvas libraries)

---

## References

- [Program plan](../../plan.md)
- [Program progress](../../progress.md)
- [Development plan](developmentplan.md)
- [api-contracts.md](../../knowledge/architecture/api-contracts.md)
- [domain-rules.md](../../knowledge/domain-rules.md)
- [design-system-rules.md](../../knowledge/design-system-rules.md)
- [accessibility-standards.md](../../knowledge/accessibility-standards.md)

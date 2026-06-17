# Tree Visualization — Memory

Session handoff log for implementation context.

---

## Status

**Feature complete (Milestone 4).** Generation-based tree visualization, expand/collapse, generation navigation, tests, and GitHub Pages redeploy done. Ready for Milestone 5 — member detail panel.

**Live URL:** https://avoram.github.io/family-tree-app/

---

## Decisions

- Layout logic lives in pure functions at `frontend/src/app/core/services/family-tree-layout.ts` (testable, no UI coupling).
- Roots are members with no parents **in the tree** (supports married-in spouses like Priya Patel).
- `TreeVisualizationComponent` loads members via `getMembers(treeId)` — `FamilyTree` DTO has metadata only.
- Spouses are grouped into `FamilyTreeCouple` nodes at the same generation level.
- `memberSelected` output is wired on nodes for Milestone 5; no detail panel in this feature.
- Expand/collapse state keyed by primary member id of each couple node.
- UI shows both generation summary sections (for navigation) and hierarchical branch tree (for expand/collapse).

---

## Implementation notes

- Component: `frontend/src/app/features/tree-visualization/`
- Layout: `frontend/src/app/core/services/family-tree-layout.ts`
- Main view passes `[tree]="selectedTree()"` to visualization component.
- **Deploy:** `npm run build:gh-pages` && `npm run deploy` in `frontend/` (June 2026).

---

## Open Issues

- None

---

## Next Steps

1. Start Milestone 5 — [member detail](../member-detail/) feature.
2. Wire `memberSelected` from `TreeVisualizationComponent` to a detail panel.

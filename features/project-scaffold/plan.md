# Project Scaffold

## Summary

Infrastructure milestone (Milestone 1). Establishes the Angular 18 application, sample family tree JSON data, test harness, GitHub Pages deployment configuration, and a main view shell with a dropdown placeholder. Delivers the first live public URL on GitHub Pages.

This is not a user-facing product feature — it enables all subsequent features.

**Program milestone:** 1  
**Blocks:** [family-tree-selection](../family-tree-selection/) (Milestones 2–3)

---

## Deliverables

- [ ] `frontend/` — Angular 18 app (standalone components, Angular Material, TypeScript strict)
- [ ] `family-trees/` — at least two valid `*.tree.json` sample files
- [ ] Main view shell — no login screen; tree dropdown placeholder
- [ ] Unit test harness with at least one passing component test
- [ ] Playwright E2E harness with smoke test (app loads)
- [ ] GitHub Pages deploy scripts (`build:gh-pages`, `deploy`)
- [ ] First deployment to GitHub Pages (free public URL)

---

## Acceptance Criteria

- [ ] `npm run build` succeeds in `frontend/`
- [ ] `npm test` passes (unit)
- [ ] Playwright smoke test passes
- [ ] App opens directly to main view (no login route)
- [ ] Dropdown placeholder visible on main view
- [ ] Sample JSON conforms to [api-contracts.md](../../knowledge/architecture/api-contracts.md)
- [ ] `family-trees/` bundled as static assets in build
- [ ] App deployed to GitHub Pages with recorded URL in [memory.md](memory.md)

---

## Out of Scope

- `IFamilyTreeService` / `JsonFamilyTreeService` (family-tree-selection, Phase A)
- Working tree discovery or selection logic (family-tree-selection)
- Tree visualization or member detail panels

---

## References

- [Program plan](../../plan.md)
- [Program progress](../../progress.md)
- [Development plan](developmentplan.md)
- [coding-standards.md](../../knowledge/coding-standards.md)
- [api-contracts.md](../../knowledge/architecture/api-contracts.md)

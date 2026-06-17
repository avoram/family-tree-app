# Family Tree Selection — Memory

Session handoff log for implementation context.

---

## Status

**Feature complete (Milestones 2–3).** Service abstraction, dropdown + selection, and GitHub Pages redeploy done. Ready for Milestone 4 — tree visualization.

**Live URL:** https://avoram.github.io/family-tree-app/

---

## Decisions

- Service abstraction is part of this feature (not a separate feature folder).
- `getMember()` implemented on service in Phase A; first UI consumer is the member-detail feature (Milestone 5).
- **Tree discovery:** static manifest at `family-trees/index.json` listing `*.tree.json` filenames. New trees require adding the file and updating the manifest entry.
- **Selection state:** `selectedTree` signal owned by `MainViewComponent` for Milestone 4 tree visualization to consume.

---

## Implementation notes

- Models: `frontend/src/app/core/models/` (DTOs + raw JSON shapes).
- Validation: `frontend/src/app/core/services/family-tree-validation.ts` — skips invalid files at load time with `console.warn`.
- Service: `JsonFamilyTreeService` caches loaded trees in memory; `provideHttpClient()` in `app.config.ts`.
- **Tree selection UI:** `frontend/src/app/features/tree-selection/` — `TreeSelectionComponent` loads trees via `toSignal(listFamilyTrees())`, emits `treeSelected` on `getFamilyTree()` success.
- **Main view:** `selectedTree` signal; tree-area shows `Selected: {name} — {description}` when a tree is chosen.
- **Deploy:** `npm run build:gh-pages` && `npm run deploy` in `frontend/` (June 2026).

---

## Open Issues

- None

---

## Next Steps

1. Start Milestone 4 — [tree visualization](../tree-visualization/) feature.
2. Tree visualization should read `selectedTree` from `MainViewComponent`.

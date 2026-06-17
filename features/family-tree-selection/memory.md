# Family Tree Selection — Memory

Session handoff log for implementation context.

---

## Status

**Phase B complete.** Dropdown + selection (Milestone 3) implemented and tested. Begin Phase C (redeploy to GitHub Pages).

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

---

## Open Issues

- None

---

## Next Steps

1. Phase C: `npm run build:gh-pages` && `npm run deploy` in `frontend/`.
2. Move program Milestone 3 to Completed in [progress.md](../../progress.md) after deploy.
3. Start Milestone 4 — tree visualization feature.

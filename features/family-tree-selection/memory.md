# Family Tree Selection — Memory

Session handoff log for implementation context.

---

## Status

**Phase A complete.** Service abstraction (Milestone 2) implemented and tested. Begin Phase B (dropdown + selection).

---

## Decisions

- Service abstraction is part of this feature (not a separate feature folder).
- `getMember()` implemented on service in Phase A; first UI consumer is the member-detail feature (Milestone 5).
- **Tree discovery:** static manifest at `family-trees/index.json` listing `*.tree.json` filenames. New trees require adding the file and updating the manifest entry.

---

## Implementation notes

- Models: `frontend/src/app/core/models/` (DTOs + raw JSON shapes).
- Validation: `frontend/src/app/core/services/family-tree-validation.ts` — skips invalid files at load time with `console.warn`.
- Service: `JsonFamilyTreeService` caches loaded trees in memory; `provideHttpClient()` added to `app.config.ts`.
- `angular.json` asset glob changed to `*.json` so `index.json` is bundled alongside tree files.

---

## Open Issues

- None

---

## Next Steps

1. Mark Phase B as In Progress in [progress.md](progress.md).
2. Implement `TreeSelectionComponent` and wire main view per [developmentplan.md](developmentplan.md).
3. Redeploy to GitHub Pages after Phase B (Phase C).

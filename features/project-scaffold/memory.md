# Project Scaffold — Memory

Session handoff log for Milestone 1.

---

## Status

**Phase 1 complete.** Angular 18 app scaffolded in `frontend/` with Material, main view shell, and default routing. Next: Phase 2 (sample JSON data).

---

## Decisions

- `family-trees/` lives at repository root (not inside `frontend/`), copied into build via `angular.json` assets.
- Main view dropdown is a placeholder in M1; wired to service layer in family-tree-selection (M2–M3).
- `MainViewComponent` uses a disabled `mat-select` with static placeholder options until M3.
- App root is a thin `router-outlet` shell; all UI lives under `features/main/`.

---

## Deployment

| Item | Value |
|------|-------|
| Vercel URL | _(not deployed yet)_ |
| Vercel project | _(not configured yet)_ |

---

## Open Issues

- None

---

## Next Steps

1. Phase 2: create `family-trees/` sample JSON files and configure `angular.json` asset copy.
2. Phase 3: expand `MainViewComponent` unit tests and add Playwright E2E harness.

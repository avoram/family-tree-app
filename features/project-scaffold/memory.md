# Project Scaffold — Memory

Session handoff log for Milestone 1.

---

## Status

**Milestone 1 complete.** Application deployed to GitHub Pages and verified live.

---

## Decisions

- `family-trees/` lives at repository root (not inside `frontend/`), copied into build via `angular.json` assets.
- Main view dropdown is a placeholder in M1; wired to service layer in family-tree-selection (M2–M3).
- `MainViewComponent` uses a disabled `mat-select` with static placeholder options until M3.
- App root is a thin `router-outlet` shell; all UI lives under `features/main/`.
- Playwright lives in `frontend/` with `npm run e2e`; `webServer` starts `ng serve` when port 4200 is free.
- `postinstall` downloads Playwright Chromium locally only (skipped when `CI` is set).
- GitHub Pages base href is `/family-tree-app/`; deploy publishes `dist/frontend/browser` via `angular-cli-ghpages`.
- Repository must be **public** for free-tier GitHub Pages (was private; changed during first deploy).

---

## Deployment

| Item | Value |
|------|-------|
| GitHub Pages URL | https://avoram.github.io/family-tree-app/ |
| Base href | `/family-tree-app/` |
| Source branch | `gh-pages` (root) |
| Repository | https://github.com/avoram/family-tree-app |

### Deploy commands

From `frontend/`:

```bash
npm run build:gh-pages
npm run deploy
```

GitHub Pages settings: **Settings → Pages → Deploy from branch `gh-pages` / root** (configured via API on first deploy).

See also [frontend/README.md](../../frontend/README.md#github-pages-deployment).

---

## Open Issues

- None

---

## Next Steps

1. Start Milestone 2 — family tree service abstraction ([family-tree-selection](../family-tree-selection/)).

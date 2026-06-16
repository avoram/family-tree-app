# Project Scaffold — Memory

Session handoff log for Milestone 1.

---

## Status

**Milestone 1 scaffold complete.** GitHub Pages deploy scripts configured; production build verified. Live deploy pending user `npm run deploy`.

---

## Decisions

- `family-trees/` lives at repository root (not inside `frontend/`), copied into build via `angular.json` assets.
- Main view dropdown is a placeholder in M1; wired to service layer in family-tree-selection (M2–M3).
- `MainViewComponent` uses a disabled `mat-select` with static placeholder options until M3.
- App root is a thin `router-outlet` shell; all UI lives under `features/main/`.
- Playwright lives in `frontend/` with `npm run e2e`; `webServer` starts `ng serve` when port 4200 is free.
- `postinstall` downloads Playwright Chromium locally only (skipped when `CI` is set).
- GitHub Pages base href is `/family-tree-app/`; deploy publishes `dist/frontend/browser` via `angular-cli-ghpages`.

---

## Deployment

| Item | Value |
|------|-------|
| GitHub Pages URL | _(not deployed yet — run steps below)_ |
| Base href | `/family-tree-app/` |

### Deploy steps

1. Push this repository to GitHub (if not already).
2. From `frontend/`:
   ```bash
   npm run build:gh-pages
   npm run deploy
   ```
3. Enable GitHub Pages in repository settings (source: `gh-pages` branch).
4. Record the production URL in the table above (`https://<username>.github.io/family-tree-app/`).

See also [frontend/README.md](../../frontend/README.md#github-pages-deployment).

---

## Open Issues

- Live GitHub Pages URL not recorded yet.

---

## Next Steps

1. User: run GitHub Pages deploy and record URL above.
2. Start Milestone 2 — family tree service abstraction ([family-tree-selection](../family-tree-selection/)).

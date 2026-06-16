# Project Scaffold — Development Plan

Implementation plan for Milestone 1. See [plan.md](plan.md) for deliverables.

---

## Phase 1: Angular application

### Create app

From repository root:

```bash
npx @angular/cli@18 new frontend \
  --directory=frontend \
  --routing=true \
  --style=scss \
  --standalone \
  --skip-git \
  --package-manager=npm
```

### Add Angular Material

```bash
cd frontend && npx ng add @angular/material --defaults
```

### Folder structure

```
frontend/src/app/
├── core/                    # empty placeholder for M2 services
├── features/
│   └── main/
│       ├── main-view.component.ts
│       ├── main-view.component.html
│       ├── main-view.component.scss
│       └── main-view.component.spec.ts
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

### Routing

- Default route `''` → `MainViewComponent`
- No login or auth routes

### Main view shell

- App title / header
- `mat-select` dropdown placeholder (static options or disabled until M3)
- Content area placeholder for future tree visualization
- Responsive layout with Angular Material toolbar or card

---

## Phase 2: Sample data

### `family-trees/` at repo root

Create at least two files per [api-contracts.md](../../knowledge/architecture/api-contracts.md):

- `family1.tree.json`
- `family2.tree.json`

### Asset bundling

In `frontend/angular.json`, add asset copy from repo root:

```json
{
  "glob": "**/*.tree.json",
  "input": "../family-trees",
  "output": "/family-trees"
}
```

---

## Phase 3: Testing

### Unit tests

- `MainViewComponent` spec: component creates, renders title, dropdown present

### Playwright E2E

- Install Playwright in `frontend/`
- `e2e/app.spec.ts`: navigate to `/`, expect main view and dropdown visible
- `npm run e2e` script in `package.json`

---

## Phase 4: Vercel deployment

### Root `vercel.json`

```json
{
  "buildCommand": "cd frontend && npm ci && npm run build",
  "outputDirectory": "frontend/dist/frontend/browser",
  "framework": null,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Adjust `outputDirectory` to match Angular 18 build output path.

### Deploy steps

1. Push repository to GitHub (if not already)
2. Import project in Vercel dashboard; root directory = repository root
3. Or: `npx vercel --prod` from repo root (requires Vercel CLI + login)
4. Record URL in [memory.md](memory.md)

---

## Definition of done

- All tasks in [progress.md](progress.md) complete
- Build and tests pass
- Vercel URL recorded (or deploy steps documented if CLI login unavailable)
- Program [progress.md](../../progress.md) Milestone 1 moved to Completed
- [family-tree-selection/memory.md](../family-tree-selection/memory.md) updated — unblocked

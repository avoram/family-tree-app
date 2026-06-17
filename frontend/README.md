# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Production browser output for this app is `dist/frontend/browser`.

## GitHub Pages Deployment

**Live URL:** https://avoram.github.io/family-tree-app/

Running `ng serve` only updates your local machine. To publish changes to GitHub Pages (new features, family tree JSON files, fixes), run these two commands from `frontend/`:

```bash
npm run build:gh-pages
npm run deploy
```

| Script | What it does |
|--------|----------------|
| `build:gh-pages` | Production build with base href `/family-tree-app/` |
| `deploy` | Pushes `dist/frontend/browser` to the `gh-pages` branch via `angular-cli-ghpages` |

**Before deploying (recommended):** commit and push source changes to `main`, then run `npm test` and `npm run e2e`.

**One-time repository setup** (already configured):

- Repository is **public** (required for free GitHub Pages)
- **Settings → Pages → Deploy from branch:** `gh-pages` / root

If deploy fails, ensure you are authenticated with GitHub (`git` / `gh` CLI) and have push access to the repository.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

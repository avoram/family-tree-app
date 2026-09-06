# Family Tree App

## Purpose

Every family has a story. Over time, it becomes difficult to remember how different generations are connected and how family relationships evolved.

The purpose of this application is to provide a simple way to visualize and explore a family hierarchy. It helps family members understand their roots, discover relationships across generations, and preserve family history in a structured and easy-to-understand format.

---

## How It Works

### Step 1: Open the Application - https://avoram.github.io/family-tree-app/

Launch the Family Tree App in your browser.

### Step 2: Select a Family

Choose a family from the available list.

### Step 3: View the Family Tree

The application displays the family hierarchy in a visual tree format.

### Step 4: Explore Generations

Navigate through different generations and understand how family members are connected.

### Step 5: View Family Member Details

Select a family member to see additional information and relationships.

### Step 6: Understand Family Connections

Explore parent-child relationships, family branches, and generational links through the visual tree.

---

## Goal

The goal of this project is to make family history easy to understand, preserve, and share through a simple visual experience.

This project is also being developed using an AI-assisted development approach to demonstrate how modern AI tools can help plan, build, test, document, and maintain software projects.

---

## Deploying to GitHub Pages

The live app is hosted at **https://avoram.github.io/family-tree-app/**.

Local development (`npm start`) does **not** update the public site. After you change the app, add family tree JSON files under `family-trees/`, or add member photos under `frontend/public/photos/<treeId>/`, redeploy from the `frontend/` folder:

```bash
cd frontend
npm run build:gh-pages
npm run deploy
```

- `build:gh-pages` — production build with the correct `/family-tree-app/` base path
- `deploy` — publishes `dist/frontend/browser` to the `gh-pages` branch

### Member photos

Add photos under `frontend/public/photos/<treeId>/<memberId>.jpg` (or `.png`, `.jpeg`, `.webp`). The file name must match the member's `id` in the tree JSON. See [frontend/public/photos/README.md](frontend/public/photos/README.md).

After adding or changing photos locally, **restart** `npm start` so the dev server picks up new files.

**One-time setup** (already done for this repo): GitHub Pages enabled, source branch `gh-pages`, public repository. See [frontend/README.md](frontend/README.md) for more detail.

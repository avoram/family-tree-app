# Family Tree App

## Purpose

Every family has a story. Over time, it becomes difficult to remember how different generations are connected and how family relationships evolved.

The purpose of this application is to provide a simple way to visualize and explore a family hierarchy. It helps family members understand their roots, discover relationships across generations, and preserve family history in a structured and easy-to-understand format.

**Live app:** https://avoram.github.io/family-tree-app/

---

## How It Works

### Step 1: Open the Application

Launch the Family Tree App: https://avoram.github.io/family-tree-app/

### Step 2: Select a Family

Choose a family from the dropdown (**Ojha Family**, **Jani Family**, or **Vora Family**).

### Step 3: View the Family Tree

The application displays the family hierarchy in a visual tree format (expand / collapse branches).

### Step 4: Explore Generations

Navigate through different generations and understand how family members are connected.

### Step 5: Search for a Member

Use the **Search members** box above the tree to find someone by first name, last name, or full name (case-insensitive). Matching people are listed as chips and highlighted in the tree; branches expand automatically so matches are visible. Click a match to open details.

### Step 6: View Family Member Details

Select a family member (from the tree or search results) to see name, gender, date of birth, notes, relationships, and photo (when `photoUrl` is set in JSON).

### Step 7: Understand Family Connections

Explore parent-child relationships, family branches, and generational links through the visual tree.

---

## Current features (V1)

| Feature | Status |
|---------|--------|
| Public read-only app (no login) | Done |
| Family tree dropdown (Ojha, Jani, Vora) | Done |
| Interactive tree (expand / collapse) | Done |
| Member search by name | Done |
| Member detail panel (responsive) | Done |
| Photos linked via JSON `photoUrl` | Done |
| GitHub Pages hosting | Done |

---

## Goal

The goal of this project is to make family history easy to understand, preserve, and share through a simple visual experience.

This project is also being developed using an AI-assisted development approach to demonstrate how modern AI tools can help plan, build, test, document, and maintain software projects.

---

## Where the data comes from

This app is **frontend-only**. There is no backend or database. All family information — including photo links — comes from **JSON files** in the repository.

| What | Location |
|------|----------|
| List of available trees | `family-trees/index.json` |
| Each family tree (members, relationships, photo links) | `family-trees/*.tree.json` |
| Photo image files | `frontend/public/photos/<treeId>/` |

Flow:

1. App reads `family-trees/index.json`
2. Loads each listed `*.tree.json` file
3. Shows families in the dropdown
4. Tree view and search use the loaded members
5. Detail panel reads member fields from that JSON
6. If the member has `"photoUrl"`, the app loads that image from the photos folder

### Current trees

| Dropdown name | Tree `id` | JSON file | Photo folder |
|---------------|-----------|-----------|--------------|
| Ojha Family | `ojha` | `family-trees/ojha.tree.json` | `frontend/public/photos/ojha/` |
| Jani Family | `jani` | `family-trees/jani.tree.json` | `frontend/public/photos/jani/` |
| Vora Family | `vora` | `family-trees/vora.tree.json` | `frontend/public/photos/vora/` |

---

## How to update family details (JSON)

JSON is the **single place** to configure member data and photo links.

**Date format:** all `dateOfBirth` values use Indian **DD-MM-YYYY** (day-month-year), for example `05-04-2019` for 5 April 2019 and `10-11-1990` for 10 November 1990.

### Member fields

| Field | Purpose |
|-------|---------|
| `id` | Unique id within the tree |
| `firstName`, `lastName` | Display name (also used by search) |
| `gender` | `"male"` / `"female"` or `null` |
| `dateOfBirth` | `"DD-MM-YYYY"` (Indian format, e.g. `05-04-2019`) or `null` |
| `fatherId`, `motherId` | Other member `id`s, or `null` |
| `spouseIds` | Array of spouse member `id`s (`[]` if none; usually one id, multiple allowed) |
| `notes` | Free text or `null` |
| `photoUrl` | Relative path to photo, or `null` / omit if none |

### Example with photo

```json
{
  "id": "mayank",
  "firstName": "Mayank",
  "lastName": "Vora",
  "gender": "male",
  "dateOfBirth": null,
  "fatherId": "p1",
  "motherId": "p2",
  "spouseIds": ["maitri"],
  "notes": null,
  "photoUrl": "photos/vora/mayank_vora.jpg"
}
```

### Example without photo

```json
{
  "id": "g1",
  "firstName": "Dwarka",
  "lastName": "Vora",
  "gender": "male",
  "dateOfBirth": "14-03-1920",
  "fatherId": null,
  "motherId": null,
  "spouseIds": ["g2"],
  "notes": "Patriarch",
  "photoUrl": null
}
```

### Example with two spouses

```json
{
  "id": "c5",
  "firstName": "Rohit",
  "lastName": "Vora",
  "gender": "male",
  "dateOfBirth": "19-08-1980",
  "fatherId": "p1",
  "motherId": "p2",
  "spouseIds": ["c5_w1", "c5_w2"],
  "notes": "Two wives; children linked via motherId",
  "photoUrl": "photos/vora/c5.jpg"
}
```

### Edit an existing member

1. Open the tree file under `family-trees/` (see table above).
2. Find the member by `"id"`.
3. Update fields / set `"photoUrl"`.
4. Save, then redeploy (or refresh locally).

### Add a new member

1. Open the tree’s `*.tree.json`.
2. Add a member object with a unique `"id"`.
3. Set relationship ids and optional `"photoUrl"`.
4. If using a photo, also add the image file (next section).
5. Redeploy.

### Add a new family tree

1. Create `family-trees/myfamily.tree.json` with `"id"`, `"name"`, and `"members"`.
2. Add the file name to `family-trees/index.json`.
3. Create `frontend/public/photos/<treeId>/`.
4. Redeploy.

---

## How to add member photos

Do **both** steps — file on disk **and** link in JSON.

### Step 1 — Add the image file

Put the file under:

```text
frontend/public/photos/<treeId>/<any-file-name>.jpg
```

Recommended naming (easy to match JSON):

```text
frontend/public/photos/vora/mayank.jpg
```

Allowed types: `.jpg`, `.jpeg`, `.png`, `.webp`

### Step 2 — Link it in JSON

In that member’s object, set:

```json
"photoUrl": "photos/vora/mayank.jpg"
```

Notes:

- Path is relative to the app root (same as how other static assets are served).
- If `photoUrl` is missing, `null`, or the file is missing → detail panel shows a placeholder.
- JSON is the mapping source of truth; the folder alone is not enough.

More folder notes: [frontend/public/photos/README.md](frontend/public/photos/README.md)

After adding photos locally, **restart** `npm start` so the dev server picks up new files.

---

## Deploying to GitHub Pages

The live app is hosted at **https://avoram.github.io/family-tree-app/**.

Local development (`npm start`) does **not** update the public site. After you change the app, JSON under `family-trees/`, or photos under `frontend/public/photos/`, redeploy from `frontend/`:

```bash
cd frontend
npm run build:gh-pages
npm run deploy
```

- `build:gh-pages` — production build with the correct `/family-tree-app/` base path
- `deploy` — publishes `dist/frontend/browser` to the `gh-pages` branch

**One-time setup** (already done for this repo): GitHub Pages enabled, source branch `gh-pages`, public repository. See [frontend/README.md](frontend/README.md) for more detail.

---

## Project status

Implementation progress is tracked in [progress.md](progress.md). Feature notes:

- [Member detail](features/member-detail/progress.md)
- [Member search](features/member-search/progress.md)

# Member photographs

Photos live here as image files. **Each photo must also be linked in the family
tree JSON** using the member's `photoUrl` field.

```
photos/<treeId>/<file-name>.<extension>
```

## How to add a photo

1. Drop the image into the family's folder (e.g. `photos/vora/mayank.jpg`).
2. In that tree's `*.tree.json`, set:

```json
"photoUrl": "photos/vora/mayank.jpg"
```

3. Restart `npm start` locally (or redeploy to GitHub Pages).

If `photoUrl` is missing/`null`, or the file cannot be loaded, the detail panel
shows a placeholder.

## Current folders

| Folder | Family tree | JSON file |
|--------|-------------|-----------|
| `photos/ojha/` | Ojha Family | `family-trees/ojha.tree.json` |
| `photos/jani/` | Jani Family | `family-trees/jani.tree.json` |
| `photos/vora/` | Vora Family | `family-trees/vora.tree.json` |

## Adding a new family tree

1. Add its `*.tree.json` to `family-trees/` and list it in `family-trees/index.json`.
2. Create a folder here named after the tree's `id`.
3. Add photos and set each member's `photoUrl` in JSON.

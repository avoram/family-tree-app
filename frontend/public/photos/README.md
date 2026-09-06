# Member photographs

Store member photos here using this naming convention:

```
photos/<treeId>/<memberId>.<extension>
```

- **`<treeId>`** — matches the `id` field in the family tree JSON (e.g. `family1`, `family2`).
- **`<memberId>`** — matches the member's `id` in that tree (e.g. `m1`, `g1`).
- **`<extension>`** — `jpg`, `jpeg`, `png`, or `webp`.

## Examples

| File | Member |
|------|--------|
| `photos/family3/mayank.jpg` | Mayank Vora in Vora Family |
| `photos/family2/g1.jpg` | Ramesh Patel in Patel Family |

No JSON changes are required. If no matching file exists, the detail panel shows an empty placeholder.

Add new photos under the appropriate `<treeId>` folder and redeploy to GitHub Pages.

# Data and Service Contracts

DTO shapes, JSON file schema, and service interface contracts for the Family Tree application (V1).

**Source of truth:** [plan.md](../../plan.md), [domain-rules.md](../domain-rules.md), [architecture-decisions.md](../architecture-decisions.md)

---

## Purpose

These contracts define the **data shapes** used by:

1. JSON files in `family-trees/` loaded by `JsonFamilyTreeService`
2. The service abstraction layer consumed by UI components

Components depend on service methods returning these types, not on file paths or parsing details.

A future backend can implement the same service interface with matching DTO shapes — no V1 contract includes identity, access control, or mutating operations.

---

## Conventions

| Item | Value |
|------|-------|
| Data source | `family-trees/*.tree.json` |
| Format | JSON |
| Access | Read-only; all bundled trees publicly viewable |

### Error handling (service layer)

| Condition | Behavior |
|-----------|----------|
| Tree not found | Service returns error / empty; UI shows message |
| Invalid JSON / domain violation | Skip file or surface load error |
| Unexpected failure | Log and show generic error |

---

## DTO Types

### `FamilyTreeSummary`

Used for dropdown listing.

```typescript
interface FamilyTreeSummary {
  id: string;
  name: string;
  description: string | null;
}
```

### `FamilyTree`

Full tree metadata.

```typescript
interface FamilyTree {
  id: string;
  name: string;
  description: string | null;
}
```

### `FamilyMemberSummary`

Used for tree visualization (includes relationship references).

```typescript
interface FamilyMemberSummary {
  id: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null; // DD-MM-YYYY (Indian format)
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
}
```

### `FamilyMemberDetail`

Used for the member detail panel.

```typescript
interface FamilyMemberDetail {
  id: string;
  treeId: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null; // DD-MM-YYYY (Indian format)
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
  notes: string | null;
  photoUrl: string | null; // e.g. "photos/vora/mayank.jpg"
}
```

---

## JSON File Schema (V1)

Each file in `family-trees/` uses the `*.tree.json` naming convention and contains one complete tree.

**Example:** `family-trees/ojha.tree.json`

```json
{
  "id": "ojha",
  "name": "Ojha Family",
  "description": "Three-generation Ojha family sample tree",
  "members": [
    {
      "id": "g1",
      "firstName": "Bhavesh",
      "lastName": "Ojha",
      "gender": "male",
      "dateOfBirth": "11-02-1942",
      "fatherId": null,
      "motherId": null,
      "spouseId": "g2",
      "notes": "Patriarch",
      "photoUrl": "photos/ojha/g1.jpg"
    },
    {
      "id": "g2",
      "firstName": "Hansaben",
      "lastName": "Ojha",
      "gender": "female",
      "dateOfBirth": "19-08-1946",
      "fatherId": null,
      "motherId": null,
      "spouseId": "g1",
      "notes": "Matriarch",
      "photoUrl": "photos/ojha/g2.jpg"
    }
  ]
}
```

### JSON file rules

- `id` must be unique within the file and stable across deployments.
- `members[].id` must be unique within the tree.
- Relationship references (`fatherId`, `motherId`, `spouseId`) must point to member ids in the same file.
- Must comply with [domain-rules.md](../domain-rules.md).
- `treeId` on members is derived from the file's root `id` (members in JSON omit `treeId`; the service adds it when mapping to DTOs).

---

## Service Interface Contract (V1)

The Angular service abstraction exposes read-only, API-shaped methods.

```typescript
interface IFamilyTreeService {
  /** List all available family trees (for dropdown). */
  listFamilyTrees(): Observable<FamilyTreeSummary[]>;

  /** Get one tree's metadata. */
  getFamilyTree(treeId: string): Observable<FamilyTree>;

  /** List members in a tree (for visualization). */
  getMembers(treeId: string): Observable<FamilyMemberSummary[]>;

  /** Get one member's full detail. */
  getMember(treeId: string, memberId: string): Observable<FamilyMemberDetail>;
}
```

### V1 implementation notes

- `listFamilyTrees()` — discover all `*.tree.json` files; return summary metadata for every valid tree.
- `getFamilyTree(treeId)` — load the matching JSON file; return tree metadata.
- `getMembers(treeId)` — return `members` array mapped to `FamilyMemberSummary`.
- `getMember(treeId, memberId)` — find member in loaded tree; map to `FamilyMemberDetail`.

Components inject `IFamilyTreeService` (via injection token or abstract class) and receive `JsonFamilyTreeService` in V1.

---

## Out of scope (V1)

- REST HTTP endpoints (no backend)
- Login screen and identity management
- Create, update, or delete operations
- Bulk import/export APIs


# Domain Rules

## Purpose

Define the business rules and constraints that govern family tree data and relationships.

All implementation should comply with these rules.

---

## Version 1 Scope

Version 1 is **read-only and public**. The application loads pre-defined family trees from local JSON files. Visitors can view any bundled tree and member details but cannot create, update, or delete data through the UI.

Rules about mutations (deletion, relationship changes) remain documented for data integrity in JSON files and for a potential future backend.

---

## Family Tree Rules

- A family tree contains multiple family members.
- A family member belongs to exactly one family tree.
- Family members cannot be shared across family trees.
- In V1, family trees are defined in static JSON files under `family-trees/`.
- Each JSON file (`*.tree.json`) represents one family tree.
- All bundled family trees are publicly viewable in the application.

---

## Family Member Rules

- Every family member must have a first name.
- Date of birth is optional.
- Notes are optional.
- Gender is optional.

---

## Parent-Child Relationship Rules

- A family member may have at most one father.
- A family member may have at most one mother.
- Father and mother must be different members.
- A family member cannot be their own parent.
- Circular parent-child relationships are not allowed.
- Parent-child relationships must belong to the same family tree.

Examples of invalid relationships:

- A is parent of A
- A → B → C → A

---

## Spouse Relationship Rules

- A family member may have at most one spouse.
- Spouse relationships are bidirectional.
- A family member cannot be their own spouse.
- Spouse relationships must belong to the same family tree.

Example:

If A is spouse of B, then B must also be spouse of A.

---

## Public Viewing (V1)

- All bundled family trees are listed in the dropdown and are viewable by any visitor.
- The application has no login screen and no access restrictions.
- All interactions are read-only.
- No create, update, or delete operations are available in the UI.

---

## Deletion Rules (Data Integrity)

These rules apply to JSON authoring and a potential future write API. They are not enforced interactively in V1.

- Deleting a family member must not leave invalid relationships.
- Related parent-child relationships must be updated when a member is deleted.
- Related spouse relationships must be updated when a member is deleted.
- Deletion operations should preserve tree integrity.

---

## Data Integrity Rules

- Relationship references must point to existing family members within the same tree.
- Orphaned relationship references are not allowed.
- JSON tree files should be validated at load time; invalid files should be skipped or reported without breaking the application.
- All relationship data must maintain a valid family tree structure.

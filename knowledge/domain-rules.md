
# Domain Rules

## Purpose

Define the business rules and constraints that govern family tree management.

All implementation should comply with these rules.

---

## Family Tree Rules

- A family tree contains multiple family members.
- A family member belongs to exactly one family tree.
- Family members cannot be shared across family trees.
- Family trees are managed by the Super Admin.

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

## User Access Rules

- Users have read-only access.
- Users cannot create family trees.
- Users cannot modify family members.
- Users cannot modify relationships.

---

## Super Admin Rules

- A single Super Admin manages all family trees.
- The Super Admin can create family trees.
- The Super Admin can update family trees.
- The Super Admin can add family members.
- The Super Admin can update family members.
- The Super Admin can manage relationships.

---

## Deletion Rules

- Deleting a family member must not leave invalid relationships.
- Related parent-child relationships must be updated when a member is deleted.
- Related spouse relationships must be updated when a member is deleted.
- Deletion operations should preserve tree integrity.

---

## Data Integrity Rules

- Relationship references must point to existing family members.
- Orphaned relationship references are not allowed.
- All relationship changes must maintain a valid family tree structure.
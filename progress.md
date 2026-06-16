# Project Progress

Tracks implementation milestones defined in [plan.md](plan.md).

Move items between sections as work completes. Only one milestone should be **In Progress** at a time.

---

## Completed

- None

---

## In Progress

- None

---

## Pending

### Milestone 1: Project scaffold + Auth (SuperAdmin/User)

- Monorepo scaffold with `frontend/` (Angular) and `backend/` (Node.js + Express)
- Vercel-ready frontend application shell
- Express API application shell
- Username/password login for Super Admin and User roles
- Role-based routing after login
- Seed accounts for development
- Unit tests and E2E tests for login flow

### Milestone 2: Super Admin family tree management + dropdown selection

- Super Admin can create family trees
- Super Admin can update family tree details
- Family dropdown to select the active tree
- Unit tests and E2E tests for tree management

### Milestone 3: User family selection + read-only access guard

- User can select any family tree from dropdown
- User can view selected tree in read-only mode
- All write operations blocked for Users across all trees
- Unit tests and E2E tests for access enforcement

### Milestone 4: Read-only tree visualization

- Display family members in a generation-based tree
- Expand and collapse branches
- Navigate between generations
- Unit tests and E2E tests for tree visualization

### Milestone 5: Member detail panel (read-only)

- Click a tree node to view member details
- Show name, gender, date of birth, notes, and relationship summary
- Available to both Super Admin and User (read-only)
- Unit tests and E2E tests for detail panel

### Milestone 6: Super Admin add member

- Add a new family member to the selected tree
- New member appears in tree visualization
- Unit tests and E2E tests for add member flow

### Milestone 7: Super Admin edit member

- Update existing member fields
- Changes reflected in tree visualization
- Unit tests and E2E tests for edit member flow

### Milestone 8: Parent-child relationship management

- Assign and change father, mother, and child links
- Basic validation (e.g., no self-parent loops)
- Unit tests and E2E tests for parent-child relationships

### Milestone 9: Spouse relationship management

- Assign and remove spouse relationships
- Bidirectional consistency between spouses
- Unit tests and E2E tests for spouse relationships

### Milestone 10: Admin management workspace

- Consolidated Super Admin screen for tree, member, and relationship operations
- Unit tests and E2E tests for admin workspace

### Milestone 11: V1 release hardening

- Mobile-friendly layout verification
- Security and access review
- Full test suite passing
- Knowledge docs and feature documentation synced

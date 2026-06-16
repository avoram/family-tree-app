# Family Tree Application

## Vision

Build a simple Family Tree application that allows families to **view** genealogical relationships through an interactive tree structure, while a **Super Admin** maintains all family data.

The application provides a visual representation of family members and their relationships. Authorized viewers can explore the tree; all modifications are performed exclusively by the Super Admin.

---

## Goals

### Family Tree Management

- Create and manage multiple family trees
- View family tree hierarchy
- Add family members
- Update family members
- Define parent-child relationships
- Define spouse relationships

### Tree Visualization

- Display family members in a tree structure
- Navigate between generations
- Expand and collapse branches
- View member details

### User Access

- Username and password authentication with JWT-based sessions
- Family selection access for view-only users
- Super Admin can modify any family tree
- Users can view any family tree via dropdown (read-only)

---

## User Roles

### Super Admin

There is a **single global Super Admin** responsible for all family tree data.

Can:

- Login
- Create family trees
- Update family trees
- Select the active family tree from a dropdown
- Add family members
- Update family members
- Manage parent-child relationships
- Manage spouse relationships

### User

A **view-only** account that can browse any family tree.

Can:

- Login
- Select and view any family tree from a dropdown
- Navigate family tree across generations
- View member details

Cannot:

- Create or modify family trees
- Add, edit, or delete family members
- Manage relationships

---

## Access Model

| Role | Family trees | Modifications |
|------|--------------|---------------|
| Super Admin | All trees; selects active tree via dropdown | Full create/update access |
| User | All trees; selects tree via dropdown | View-only |

- Users can access any family tree in read-only mode.
- All family tree modifications are performed by the Super Admin.

---

## Authentication Strategy

- Users authenticate with **username and password**.
- The backend issues a **JWT** on successful login.
- JWT tokens expire after **24 hours**.
- **No refresh tokens** in Version 1; users must log in again after token expiration.
- **Authorization is role-based** using JWT claims.
- Supported roles: `SuperAdmin`, `User`.
- Authentication and authorization are **enforced by the backend** on protected APIs.
- The frontend must include the JWT when calling protected APIs.

See also: [knowledge/security-standards.md](knowledge/security-standards.md), [knowledge/coding-standards.md](knowledge/coding-standards.md).

---

## Domain Model

### Key Entities

| Entity | Description |
|--------|-------------|
| `UserAccount` | Login identity with role (`SuperAdmin` or `User`) |
| `FamilyTree` | Named container for a family's members and relationships |
| `FamilyMember` | A person node within a family tree |
| `TreeAssignment` | Optional future entity for restricted access rules |

### Family Tree Structure

- One `FamilyTree` contains many `FamilyMember` records.
- Each member may reference one father, one mother, and optionally one spouse.
- Parent-child links define generations.
- Spouse links are peer-level relationships between members.
- The UI renders this as an expandable, generation-based tree.

### Family Member Fields

Each family member supports:

- First Name
- Last Name
- Gender
- Date of Birth (optional)
- Father (optional reference)
- Mother (optional reference)
- Spouse (optional reference)
- Notes (optional)

---

## Initial Features

1. Login (Super Admin and User)
2. Super Admin family tree management and dropdown selection
3. User family tree dropdown and read-only access enforcement
4. Family tree visualization
5. Family member detail view
6. Family member management (Super Admin)
7. Relationship management (Super Admin)
8. Admin management workspace (Super Admin)

---

## Implementation Milestones

Development proceeds one milestone at a time. Each milestone is a small vertical slice sized for a single AI session. Milestone status is tracked in [progress.md](progress.md).

| # | Milestone | Outcome |
|---|-----------|---------|
| 1 | Project scaffold + Auth | Monorepo scaffold (`frontend/` + `backend/`); Vercel-ready frontend; Express API shell; JWT login (24h expiry); JWT-protected APIs; role-based routing from JWT claims; seed accounts |
| 2 | Super Admin family tree management | Create/manage trees; select active tree via dropdown |
| 3 | User family selection + read-only access guard | User selects any tree from dropdown; all write actions blocked |
| 4 | Read-only tree visualization | Expandable generation-based tree view |
| 5 | Member detail panel (read-only) | Click node to view member profile and relationships |
| 6 | Super Admin add member | Add member to selected tree; appears in visualization |
| 7 | Super Admin edit member | Update member fields; changes reflected in tree |
| 8 | Parent-child relationship management | Assign/change father, mother, children with validation |
| 9 | Spouse relationship management | Assign/remove spouse with bidirectional consistency |
| 10 | Admin management workspace | Consolidated Super Admin screen for all operations |
| 11 | V1 release hardening | Mobile checks, security review, full test suite, docs sync |

---

## Success Criteria

### Super Admin

- Login successfully
- Select a family tree from the dropdown
- Add parents and children
- Update member details
- Update relationships
- Save all changes

### User

- Login successfully
- Select and view any family tree from dropdown
- Navigate across generations
- View member details (read-only)

---

## Technical Constraints

- Zero-cost solution
- No third-party authentication
- Username/password authentication with **JWT** (24-hour expiration, no refresh tokens in V1)
- **Frontend:** Angular (see `knowledge/coding-standards.md`)
- **Backend:** Node.js + Express.js (see `knowledge/coding-standards.md`)
- **Repository layout:** single repo with `frontend/` and `backend/` applications
- Deployment target: **Vercel** (frontend)
- Mobile-friendly interface
- Security standards: see `knowledge/security-standards.md`

---

## Quality Standards

Every feature and milestone must include:

- **Unit tests** covering core logic and components
- **End-to-end tests** covering the primary user flow for that feature
- **Integration tests** where API and data layers are involved

A milestone is not complete until its tests pass and documentation is updated per the AI bootstrap Definition of Done.

---


## Out Of Scope (Version 1)

- Social login
- Refresh tokens and silent token renewal
- Email verification
- Family invitations
- Notifications
- DNA integrations
- Genealogy research
- Public sharing
- Advanced permissions
- Per-tree administrator roles

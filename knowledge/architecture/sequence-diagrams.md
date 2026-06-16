# Sequence Diagrams

Key interaction flows for the Family Tree application (V1).

**Source of truth:** [plan.md](../../plan.md), [api-contracts.md](api-contracts.md), [domain-rules.md](../domain-rules.md)

---

## Application startup and tree discovery

On load, the application discovers available family trees and populates the dropdown. The visitor lands directly on the main view — there is no login screen.

```mermaid
sequenceDiagram
    participant Visitor as Visitor
    participant UI as AngularFrontend
    participant Svc as FamilyTreeService
    participant JSON as TreeJsonFiles

    Visitor->>UI: Open application
    UI->>Svc: listFamilyTrees()
    Svc->>JSON: Discover and load *.tree.json metadata
    JSON-->>Svc: Tree definitions
    Svc->>Svc: Validate JSON against domain rules
    Svc-->>UI: FamilyTreeSummary[]
    UI-->>Visitor: Show main view with tree dropdown
```

---

## Select and render family tree

The visitor selects any available tree from the dropdown. The service loads members and the UI renders the visualization.

```mermaid
sequenceDiagram
    participant Visitor as Visitor
    participant UI as AngularFrontend
    participant Svc as FamilyTreeService
    participant JSON as TreeJsonFiles

    Visitor->>UI: Select tree from dropdown
    UI->>Svc: getFamilyTree(treeId)
    Svc->>JSON: Load familyX.tree.json
    JSON-->>Svc: Tree data
    Svc-->>UI: FamilyTree
    UI->>Svc: getMembers(treeId)
    Svc-->>UI: FamilyMemberSummary[]
    UI->>UI: Build generation-based tree model
    UI-->>Visitor: Render tree visualization
```

---

## View member details (read-only)

```mermaid
sequenceDiagram
    participant Visitor as Visitor
    participant UI as AngularFrontend
    participant Svc as FamilyTreeService

    Visitor->>UI: Click member node
    UI->>Svc: getMember(treeId, memberId)
    Svc-->>UI: FamilyMemberDetail
    UI->>UI: Resolve relationship labels (father, mother, spouse)
    UI-->>Visitor: Show read-only detail panel
```

---

## Expand and collapse tree branches

```mermaid
sequenceDiagram
    participant Visitor as Visitor
    participant UI as AngularFrontend

    Visitor->>UI: Click expand/collapse on branch
    UI->>UI: Update local tree view state (signals)
    UI-->>Visitor: Show/hide descendant nodes
```

No service call is required — branch state is a UI concern.

---

## Invalid or missing tree data

```mermaid
sequenceDiagram
    participant UI as AngularFrontend
    participant Svc as FamilyTreeService
    participant JSON as TreeJsonFiles

    UI->>Svc: listFamilyTrees()
    Svc->>JSON: Load tree files
    JSON-->>Svc: Malformed or invalid JSON
    Svc->>Svc: Skip or flag invalid file
    Svc-->>UI: Valid trees only (or error state)
    UI-->>UI: Show available trees or friendly error
```

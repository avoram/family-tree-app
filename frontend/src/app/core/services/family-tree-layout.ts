import { FamilyMemberSummary } from '../models/family-member-summary.model';

export interface FamilyTreeCouple {
  primary: FamilyMemberSummary;
  spouses: FamilyMemberSummary[];
}

/** Children who share the same co-parent (typically one spouse). */
export interface FamilyTreeFamilyUnit {
  coParent: FamilyMemberSummary | null;
  children: FamilyTreeLayoutNode[];
}

export interface FamilyTreeLayoutNode {
  couple: FamilyTreeCouple;
  /** Child groups by co-parent; single-spouse trees usually have one unit. */
  familyUnits: FamilyTreeFamilyUnit[];
  /** Flattened children across all family units (stable order). */
  children: FamilyTreeLayoutNode[];
  generation: number;
}

export interface FamilyTreeLayout {
  roots: FamilyTreeLayoutNode[];
  generationCount: number;
  membersByGeneration: FamilyMemberSummary[][];
}

export function getMemberDisplayName(member: FamilyMemberSummary): string {
  return `${member.firstName} ${member.lastName}`.trim();
}

export function buildFamilyTreeLayout(members: FamilyMemberSummary[]): FamilyTreeLayout {
  if (members.length === 0) {
    return { roots: [], generationCount: 0, membersByGeneration: [] };
  }

  const memberById = new Map(members.map((member) => [member.id, member]));
  const visited = new Set<string>();
  const roots = findRoots(members, memberById);
  const rootNodes = buildNodesFromMembers(roots, members, memberById, visited, 0);
  const membersByGeneration = groupMembersByGeneration(rootNodes);

  return {
    roots: rootNodes,
    generationCount: membersByGeneration.length,
    membersByGeneration,
  };
}

function findRoots(
  members: FamilyMemberSummary[],
  memberById: Map<string, FamilyMemberSummary>,
): FamilyMemberSummary[] {
  return members.filter((member) => {
    const hasFatherInTree = member.fatherId !== null && memberById.has(member.fatherId);
    const hasMotherInTree = member.motherId !== null && memberById.has(member.motherId);

    return !hasFatherInTree && !hasMotherInTree;
  });
}

function buildNodesFromMembers(
  members: FamilyMemberSummary[],
  allMembers: FamilyMemberSummary[],
  memberById: Map<string, FamilyMemberSummary>,
  visited: Set<string>,
  generation: number,
): FamilyTreeLayoutNode[] {
  const nodes: FamilyTreeLayoutNode[] = [];

  for (const member of members) {
    if (visited.has(member.id)) {
      continue;
    }

    visited.add(member.id);

    const spouses: FamilyMemberSummary[] = [];

    for (const spouseId of member.spouseIds) {
      const spouseMember = memberById.get(spouseId);

      if (!spouseMember || visited.has(spouseMember.id)) {
        continue;
      }

      spouses.push(spouseMember);
      visited.add(spouseMember.id);
    }

    const parentIds = new Set<string>([member.id, ...spouses.map((spouse) => spouse.id)]);
    const childMembers = findChildren(parentIds, allMembers);
    const familyUnits = buildFamilyUnits(
      member,
      spouses,
      childMembers,
      allMembers,
      memberById,
      visited,
      generation,
    );
    const children = familyUnits.flatMap((unit) => unit.children);

    nodes.push({
      couple: { primary: member, spouses },
      familyUnits,
      children,
      generation,
    });
  }

  return nodes;
}

function buildFamilyUnits(
  primary: FamilyMemberSummary,
  spouses: FamilyMemberSummary[],
  childMembers: FamilyMemberSummary[],
  allMembers: FamilyMemberSummary[],
  memberById: Map<string, FamilyMemberSummary>,
  visited: Set<string>,
  generation: number,
): FamilyTreeFamilyUnit[] {
  const spouseById = new Map(spouses.map((spouse) => [spouse.id, spouse]));
  const groups = new Map<string | null, FamilyMemberSummary[]>();

  for (const spouse of spouses) {
    groups.set(spouse.id, []);
  }

  groups.set(null, []);

  for (const child of childMembers) {
    const coParentId = resolveCoParentId(child, primary.id, spouseById);
    const key = coParentId && spouseById.has(coParentId) ? coParentId : null;
    const bucket = groups.get(key) ?? [];
    bucket.push(child);
    groups.set(key, bucket);
  }

  const units: FamilyTreeFamilyUnit[] = [];

  for (const spouse of spouses) {
    const unitChildren = groups.get(spouse.id) ?? [];

    if (unitChildren.length === 0) {
      continue;
    }

    units.push({
      coParent: spouse,
      children: buildNodesFromMembers(unitChildren, allMembers, memberById, visited, generation + 1),
    });
  }

  const ungrouped = groups.get(null) ?? [];

  if (ungrouped.length > 0) {
    units.push({
      coParent: null,
      children: buildNodesFromMembers(ungrouped, allMembers, memberById, visited, generation + 1),
    });
  }

  return units;
}

function resolveCoParentId(
  child: FamilyMemberSummary,
  primaryId: string,
  spouseById: Map<string, FamilyMemberSummary>,
): string | null {
  const parents = [child.fatherId, child.motherId].filter((id): id is string => id !== null);

  if (parents.includes(primaryId)) {
    return parents.find((id) => id !== primaryId) ?? null;
  }

  return parents.find((id) => spouseById.has(id)) ?? null;
}

function findChildren(parentIds: Set<string>, members: FamilyMemberSummary[]): FamilyMemberSummary[] {
  const children = new Map<string, FamilyMemberSummary>();

  for (const member of members) {
    const hasFather = member.fatherId !== null && parentIds.has(member.fatherId);
    const hasMother = member.motherId !== null && parentIds.has(member.motherId);

    if (hasFather || hasMother) {
      children.set(member.id, member);
    }
  }

  return [...children.values()];
}

function groupMembersByGeneration(roots: FamilyTreeLayoutNode[]): FamilyMemberSummary[][] {
  const byGeneration = new Map<number, Map<string, FamilyMemberSummary>>();

  const visit = (node: FamilyTreeLayoutNode): void => {
    const generationMembers = byGeneration.get(node.generation) ?? new Map<string, FamilyMemberSummary>();

    generationMembers.set(node.couple.primary.id, node.couple.primary);

    for (const spouse of node.couple.spouses) {
      generationMembers.set(spouse.id, spouse);
    }

    byGeneration.set(node.generation, generationMembers);

    for (const child of node.children) {
      visit(child);
    }
  };

  for (const root of roots) {
    visit(root);
  }

  const maxGeneration = byGeneration.size > 0 ? Math.max(...byGeneration.keys()) : -1;
  const result: FamilyMemberSummary[][] = [];

  for (let generation = 0; generation <= maxGeneration; generation += 1) {
    const generationMembers = byGeneration.get(generation);

    if (generationMembers) {
      result.push([...generationMembers.values()]);
    }
  }

  return result;
}

export function collectNodeIds(nodes: FamilyTreeLayoutNode[]): string[] {
  const ids: string[] = [];

  const visit = (node: FamilyTreeLayoutNode): void => {
    ids.push(node.couple.primary.id);

    for (const child of node.children) {
      visit(child);
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  return ids;
}

/**
 * Returns primary-node ids that must be expanded so `memberId` becomes visible
 * under the tree (ancestors along the path from a root to that member).
 */
export function findExpandIdsForMember(
  roots: FamilyTreeLayoutNode[],
  memberId: string,
): string[] {
  const path: string[] = [];

  const visit = (node: FamilyTreeLayoutNode, ancestors: string[]): boolean => {
    const primaryId = node.couple.primary.id;
    const spouseMatch = node.couple.spouses.some((spouse) => spouse.id === memberId);
    const matches = primaryId === memberId || spouseMatch;

    if (matches) {
      path.push(...ancestors);
      return true;
    }

    const nextAncestors = [...ancestors, primaryId];

    for (const child of node.children) {
      if (visit(child, nextAncestors)) {
        return true;
      }
    }

    return false;
  };

  for (const root of roots) {
    if (visit(root, [])) {
      break;
    }
  }

  return path;
}

export function memberMatchesQuery(member: FamilyMemberSummary, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  const fullName = getMemberDisplayName(member).toLowerCase();
  const firstName = member.firstName.toLowerCase();
  const lastName = member.lastName.toLowerCase();

  return (
    fullName.includes(normalized) ||
    firstName.includes(normalized) ||
    lastName.includes(normalized)
  );
}

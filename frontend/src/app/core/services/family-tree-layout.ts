import { FamilyMemberSummary } from '../models/family-member-summary.model';

export interface FamilyTreeCouple {
  primary: FamilyMemberSummary;
  spouse: FamilyMemberSummary | null;
}

export interface FamilyTreeLayoutNode {
  couple: FamilyTreeCouple;
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

    let spouse: FamilyMemberSummary | null = null;

    if (member.spouseId) {
      const spouseMember = memberById.get(member.spouseId) ?? null;

      if (spouseMember) {
        spouse = spouseMember;
        visited.add(spouseMember.id);
      }
    }

    const parentIds = new Set([member.id]);

    if (spouse) {
      parentIds.add(spouse.id);
    }

    const childMembers = findChildren(parentIds, allMembers);
    const children = buildNodesFromMembers(childMembers, allMembers, memberById, visited, generation + 1);

    nodes.push({
      couple: { primary: member, spouse },
      children,
      generation,
    });
  }

  return nodes;
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

    if (node.couple.spouse) {
      generationMembers.set(node.couple.spouse.id, node.couple.spouse);
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

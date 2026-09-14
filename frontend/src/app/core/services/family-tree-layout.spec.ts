import { FamilyMemberSummary } from '../models/family-member-summary.model';
import {
  buildFamilyTreeLayout,
  collectNodeIds,
  findExpandIdsForMember,
  getMemberDisplayName,
  memberMatchesQuery,
} from './family-tree-layout';

const family1Members: FamilyMemberSummary[] = [
  {
    id: 'm1',
    firstName: 'John',
    lastName: 'Smith',
    gender: 'male',
    dateOfBirth: '15-03-1950',
    fatherId: null,
    motherId: null,
    spouseIds: ['m2'],
  },
  {
    id: 'm2',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'female',
    dateOfBirth: '20-07-1952',
    fatherId: null,
    motherId: null,
    spouseIds: ['m1'],
  },
];

const family2Members: FamilyMemberSummary[] = [
  {
    id: 'g1',
    firstName: 'Ramesh',
    lastName: 'Patel',
    gender: 'male',
    dateOfBirth: '10-01-1940',
    fatherId: null,
    motherId: null,
    spouseIds: ['g2'],
  },
  {
    id: 'g2',
    firstName: 'Lakshmi',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '22-06-1945',
    fatherId: null,
    motherId: null,
    spouseIds: ['g1'],
  },
  {
    id: 'p1',
    firstName: 'Arun',
    lastName: 'Patel',
    gender: 'male',
    dateOfBirth: '05-04-1970',
    fatherId: 'g1',
    motherId: 'g2',
    spouseIds: ['p2'],
  },
  {
    id: 'p2',
    firstName: 'Priya',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '18-09-1972',
    fatherId: null,
    motherId: null,
    spouseIds: ['p1'],
  },
  {
    id: 'c1',
    firstName: 'Anika',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '01-12-2000',
    fatherId: 'p1',
    motherId: 'p2',
    spouseIds: [],
  },
];

describe('family-tree-layout', () => {
  describe('getMemberDisplayName', () => {
    it('formats first and last name', () => {
      expect(getMemberDisplayName(family1Members[0])).toBe('John Smith');
    });
  });

  describe('memberMatchesQuery', () => {
    it('matches first name, last name, or full name (case-insensitive)', () => {
      expect(memberMatchesQuery(family1Members[0], 'john')).toBe(true);
      expect(memberMatchesQuery(family1Members[0], 'SMITH')).toBe(true);
      expect(memberMatchesQuery(family1Members[0], 'John Smith')).toBe(true);
      expect(memberMatchesQuery(family1Members[0], 'jane')).toBe(false);
      expect(memberMatchesQuery(family1Members[0], '   ')).toBe(false);
    });
  });

  describe('findExpandIdsForMember', () => {
    it('returns ancestor primary ids needed to reveal a nested member', () => {
      const layout = buildFamilyTreeLayout(family2Members);

      expect(findExpandIdsForMember(layout.roots, 'c1')).toEqual(['g1', 'p1']);
      expect(findExpandIdsForMember(layout.roots, 'g1')).toEqual([]);
      expect(findExpandIdsForMember(layout.roots, 'g2')).toEqual([]);
    });
  });

  describe('buildFamilyTreeLayout', () => {
    it('returns empty layout for no members', () => {
      const layout = buildFamilyTreeLayout([]);

      expect(layout.roots).toEqual([]);
      expect(layout.generationCount).toBe(0);
      expect(layout.membersByGeneration).toEqual([]);
    });

    it('builds a single-generation couple for family1', () => {
      const layout = buildFamilyTreeLayout(family1Members);

      expect(layout.generationCount).toBe(1);
      expect(layout.roots.length).toBe(1);
      expect(layout.roots[0].couple.primary.id).toBe('m1');
      expect(layout.roots[0].couple.spouses.map((s) => s.id)).toEqual(['m2']);
      expect(layout.roots[0].children.length).toBe(0);
      expect(layout.membersByGeneration[0].map((member) => member.id).sort()).toEqual(['m1', 'm2']);
    });

    it('builds three generations for family2', () => {
      const layout = buildFamilyTreeLayout(family2Members);

      expect(layout.generationCount).toBe(3);
      expect(layout.roots.length).toBe(1);
      expect(layout.roots[0].couple.primary.id).toBe('g1');
      expect(layout.roots[0].children.length).toBe(1);
      expect(layout.roots[0].children[0].couple.primary.id).toBe('p1');
      expect(layout.roots[0].children[0].couple.spouses.map((s) => s.id)).toEqual(['p2']);
      expect(layout.roots[0].children[0].children.length).toBe(1);
      expect(layout.roots[0].children[0].children[0].couple.primary.id).toBe('c1');
      expect(layout.membersByGeneration[0].map((member) => member.id).sort()).toEqual(['g1', 'g2']);
      expect(layout.membersByGeneration[1].map((member) => member.id).sort()).toEqual(['p1', 'p2']);
      expect(layout.membersByGeneration[2].map((member) => member.id)).toEqual(['c1']);
    });

    it('does not duplicate spouses when both are roots', () => {
      const layout = buildFamilyTreeLayout(family1Members);
      const nodeIds = collectNodeIds(layout.roots);

      expect(nodeIds.length).toBe(1);
    });

    it('deduplicates children linked to both parents', () => {
      const layout = buildFamilyTreeLayout(family2Members);
      const childNodes = layout.roots[0].children[0].children;

      expect(childNodes.length).toBe(1);
    });

    it('groups children by co-parent when a member has two spouses', () => {
      const multiSpouseMembers: FamilyMemberSummary[] = [
        {
          id: 'h1',
          firstName: 'Rohit',
          lastName: 'Vora',
          gender: 'male',
          dateOfBirth: '19-08-1980',
          fatherId: null,
          motherId: null,
          spouseIds: ['w1', 'w2'],
        },
        {
          id: 'w1',
          firstName: 'Nisha',
          lastName: 'Vora',
          gender: 'female',
          dateOfBirth: '12-03-1982',
          fatherId: null,
          motherId: null,
          spouseIds: ['h1'],
        },
        {
          id: 'w2',
          firstName: 'Kavita',
          lastName: 'Vora',
          gender: 'female',
          dateOfBirth: '08-09-1985',
          fatherId: null,
          motherId: null,
          spouseIds: ['h1'],
        },
        {
          id: 'c1',
          firstName: 'Aryan',
          lastName: 'Vora',
          gender: 'male',
          dateOfBirth: '21-06-2008',
          fatherId: 'h1',
          motherId: 'w1',
          spouseIds: [],
        },
        {
          id: 'c2',
          firstName: 'Diya',
          lastName: 'Vora',
          gender: 'female',
          dateOfBirth: '03-11-2014',
          fatherId: 'h1',
          motherId: 'w2',
          spouseIds: [],
        },
      ];

      const layout = buildFamilyTreeLayout(multiSpouseMembers);
      const root = layout.roots[0];

      expect(root.couple.primary.id).toBe('h1');
      expect(root.couple.spouses.map((s) => s.id)).toEqual(['w1', 'w2']);
      expect(root.familyUnits.length).toBe(2);
      expect(root.familyUnits[0].coParent?.id).toBe('w1');
      expect(root.familyUnits[0].children.map((c) => c.couple.primary.id)).toEqual(['c1']);
      expect(root.familyUnits[1].coParent?.id).toBe('w2');
      expect(root.familyUnits[1].children.map((c) => c.couple.primary.id)).toEqual(['c2']);
      expect(root.children.map((c) => c.couple.primary.id)).toEqual(['c1', 'c2']);
    });

    it('builds five generations for the bundled Vora family tree', async () => {
      const response = await fetch('family-trees/vora.tree.json');
      const tree = await response.json();
      const members = (tree.members as Array<FamilyMemberSummary & { spouseId?: string | null }>).map(
        (member) => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          gender: member.gender,
          dateOfBirth: member.dateOfBirth,
          fatherId: member.fatherId,
          motherId: member.motherId,
          spouseIds: Array.isArray(member.spouseIds)
            ? member.spouseIds
            : member.spouseId
              ? [member.spouseId]
              : [],
        }),
      );

      const layout = buildFamilyTreeLayout(members);

      expect(layout.generationCount).toBe(5);
      expect(layout.roots.length).toBe(1);
      expect(layout.roots[0].couple.primary.firstName).toBe('Dwarka');
      expect(layout.membersByGeneration[4].map((member) => member.firstName).sort()).toEqual([
        'Aarav',
        'Krish',
        'Myra',
        'Siya',
      ]);
    });
  });
});

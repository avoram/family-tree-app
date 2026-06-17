import { FamilyMemberSummary } from '../models/family-member-summary.model';
import {
  buildFamilyTreeLayout,
  collectNodeIds,
  getMemberDisplayName,
} from './family-tree-layout';

const family1Members: FamilyMemberSummary[] = [
  {
    id: 'm1',
    firstName: 'John',
    lastName: 'Smith',
    gender: 'male',
    dateOfBirth: '1950-03-15',
    fatherId: null,
    motherId: null,
    spouseId: 'm2',
  },
  {
    id: 'm2',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'female',
    dateOfBirth: '1952-07-20',
    fatherId: null,
    motherId: null,
    spouseId: 'm1',
  },
];

const family2Members: FamilyMemberSummary[] = [
  {
    id: 'g1',
    firstName: 'Ramesh',
    lastName: 'Patel',
    gender: 'male',
    dateOfBirth: '1940-01-10',
    fatherId: null,
    motherId: null,
    spouseId: 'g2',
  },
  {
    id: 'g2',
    firstName: 'Lakshmi',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '1945-06-22',
    fatherId: null,
    motherId: null,
    spouseId: 'g1',
  },
  {
    id: 'p1',
    firstName: 'Arun',
    lastName: 'Patel',
    gender: 'male',
    dateOfBirth: '1970-04-05',
    fatherId: 'g1',
    motherId: 'g2',
    spouseId: 'p2',
  },
  {
    id: 'p2',
    firstName: 'Priya',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '1972-09-18',
    fatherId: null,
    motherId: null,
    spouseId: 'p1',
  },
  {
    id: 'c1',
    firstName: 'Anika',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '2000-12-01',
    fatherId: 'p1',
    motherId: 'p2',
    spouseId: null,
  },
];

describe('family-tree-layout', () => {
  describe('getMemberDisplayName', () => {
    it('formats first and last name', () => {
      expect(getMemberDisplayName(family1Members[0])).toBe('John Smith');
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
      expect(layout.roots[0].couple.spouse?.id).toBe('m2');
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
      expect(layout.roots[0].children[0].couple.spouse?.id).toBe('p2');
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

    it('builds five generations for the bundled Vora family tree', async () => {
      const response = await fetch('family-trees/vorafamiliy.tree.json');
      const tree = await response.json();
      const members = (tree.members as FamilyMemberSummary[]).map((member) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        fatherId: member.fatherId,
        motherId: member.motherId,
        spouseId: member.spouseId,
      }));

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

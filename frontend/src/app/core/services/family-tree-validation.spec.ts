import { FamilyMemberJson, FamilyTreeJson } from '../models/family-tree-json.model';
import { validateFamilyTreeJson } from './family-tree-validation';

function createValidTree(overrides: Partial<FamilyTreeJson> = {}): FamilyTreeJson {
  return {
    id: 'family1',
    name: 'Family One',
    description: 'Example family tree',
    members: [
      {
        id: 'm1',
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male',
        dateOfBirth: '15-03-1950',
        fatherId: null,
        motherId: null,
        spouseIds: ['m2'],
        notes: null,
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
        notes: null,
      },
    ],
    ...overrides,
  };
}

describe('family-tree-validation', () => {
  it('accepts a valid family tree', () => {
    const result = validateFamilyTreeJson(createValidTree());

    expect(result.valid).toBeTrue();
    expect(result.errors).toEqual([]);
  });

  it('rejects trees without a first name', () => {
    const tree = createValidTree({
      members: [
        {
          id: 'm1',
          firstName: '',
          lastName: 'Smith',
          gender: null,
          dateOfBirth: null,
          fatherId: null,
          motherId: null,
          spouseIds: [],
          notes: null,
        },
      ],
    });

    const result = validateFamilyTreeJson(tree);

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('firstName'))).toBeTrue();
  });

  it('rejects duplicate member ids', () => {
    const member: FamilyMemberJson = {
      id: 'm1',
      firstName: 'John',
      lastName: 'Smith',
      gender: null,
      dateOfBirth: null,
      fatherId: null,
      motherId: null,
      spouseIds: [],
      notes: null,
    };

    const result = validateFamilyTreeJson(
      createValidTree({
        members: [member, { ...member }],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('duplicate member id'))).toBeTrue();
  });

  it('rejects missing relationship references', () => {
    const result = validateFamilyTreeJson(
      createValidTree({
        members: [
          {
            id: 'm1',
            firstName: 'John',
            lastName: 'Smith',
            gender: null,
            dateOfBirth: null,
            fatherId: 'missing',
            motherId: null,
            spouseIds: [],
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('references missing member'))).toBeTrue();
  });

  it('rejects members who are their own parent', () => {
    const result = validateFamilyTreeJson(
      createValidTree({
        members: [
          {
            id: 'm1',
            firstName: 'John',
            lastName: 'Smith',
            gender: null,
            dateOfBirth: null,
            fatherId: 'm1',
            motherId: null,
            spouseIds: [],
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('cannot be their own parent'))).toBeTrue();
  });

  it('rejects non-bidirectional spouse relationships', () => {
    const result = validateFamilyTreeJson(
      createValidTree({
        members: [
          {
            id: 'm1',
            firstName: 'John',
            lastName: 'Smith',
            gender: null,
            dateOfBirth: null,
            fatherId: null,
            motherId: null,
            spouseIds: ['m2'],
            notes: null,
          },
          {
            id: 'm2',
            firstName: 'Jane',
            lastName: 'Smith',
            gender: null,
            dateOfBirth: null,
            fatherId: null,
            motherId: null,
            spouseIds: [],
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('not bidirectional'))).toBeTrue();
  });

  it('accepts multiple bidirectional spouses', () => {
    const result = validateFamilyTreeJson(
      createValidTree({
        members: [
          {
            id: 'h1',
            firstName: 'Rohit',
            lastName: 'Vora',
            gender: 'male',
            dateOfBirth: null,
            fatherId: null,
            motherId: null,
            spouseIds: ['w1', 'w2'],
            notes: null,
          },
          {
            id: 'w1',
            firstName: 'Nisha',
            lastName: 'Vora',
            gender: 'female',
            dateOfBirth: null,
            fatherId: null,
            motherId: null,
            spouseIds: ['h1'],
            notes: null,
          },
          {
            id: 'w2',
            firstName: 'Kavita',
            lastName: 'Vora',
            gender: 'female',
            dateOfBirth: null,
            fatherId: null,
            motherId: null,
            spouseIds: ['h1'],
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).withContext(result.errors.join('; ')).toBeTrue();
  });

  it('still accepts legacy spouseId when bidirectional', () => {
    const result = validateFamilyTreeJson({
      id: 'legacy',
      name: 'Legacy Tree',
      description: null,
      members: [
        {
          id: 'm1',
          firstName: 'John',
          lastName: 'Smith',
          gender: 'male',
          dateOfBirth: null,
          fatherId: null,
          motherId: null,
          spouseId: 'm2',
          notes: null,
        },
        {
          id: 'm2',
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'female',
          dateOfBirth: null,
          fatherId: null,
          motherId: null,
          spouseId: 'm1',
          notes: null,
        },
      ],
    });

    expect(result.valid).withContext(result.errors.join('; ')).toBeTrue();
  });

  it('rejects circular parent-child relationships', () => {
    const result = validateFamilyTreeJson(
      createValidTree({
        members: [
          {
            id: 'a',
            firstName: 'A',
            lastName: 'One',
            gender: null,
            dateOfBirth: null,
            fatherId: 'b',
            motherId: null,
            spouseIds: [],
            notes: null,
          },
          {
            id: 'b',
            firstName: 'B',
            lastName: 'Two',
            gender: null,
            dateOfBirth: null,
            fatherId: 'a',
            motherId: null,
            spouseIds: [],
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('circular parent-child'))).toBeTrue();
  });

  it('accepts the bundled Vora family tree file', async () => {
    const response = await fetch('family-trees/vora.tree.json');
    const tree = await response.json();
    const result = validateFamilyTreeJson(tree, 'vora.tree.json');

    expect(result.valid).withContext(result.errors.join('; ')).toBeTrue();
    expect((tree as FamilyTreeJson).name).toBe('Vora Family');
  });
});

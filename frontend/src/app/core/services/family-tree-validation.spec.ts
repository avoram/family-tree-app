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
        dateOfBirth: '1950-03-15',
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
        dateOfBirth: '1952-07-20',
        fatherId: null,
        motherId: null,
        spouseId: 'm1',
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
          spouseId: null,
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
      spouseId: null,
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
            spouseId: null,
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
            spouseId: null,
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
            spouseId: 'm2',
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
            spouseId: null,
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('not bidirectional'))).toBeTrue();
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
            spouseId: null,
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
            spouseId: null,
            notes: null,
          },
        ],
      }),
    );

    expect(result.valid).toBeFalse();
    expect(result.errors.some((error) => error.includes('circular parent-child'))).toBeTrue();
  });

  it('accepts the bundled Vora family tree file', async () => {
    const response = await fetch('family-trees/vorafamiliy.tree.json');
    const tree = await response.json();
    const result = validateFamilyTreeJson(tree, 'vorafamiliy.tree.json');

    expect(result.valid).withContext(result.errors.join('; ')).toBeTrue();
    expect((tree as FamilyTreeJson).name).toBe('Vora Family');
  });
});

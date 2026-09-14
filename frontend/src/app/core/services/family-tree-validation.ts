import { FamilyMemberJson, FamilyTreeJson } from '../models/family-tree-json.model';
import { isIndianDate } from '../utils/indian-date.util';
import { normalizeSpouseIds } from '../utils/spouse-ids.util';

export interface FamilyTreeValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFamilyTreeJson(tree: unknown, sourceLabel = 'tree'): FamilyTreeValidationResult {
  const errors: string[] = [];

  if (!tree || typeof tree !== 'object') {
    return { valid: false, errors: [`${sourceLabel}: root value must be an object`] };
  }

  const record = tree as Record<string, unknown>;

  if (typeof record['id'] !== 'string' || record['id'].trim() === '') {
    errors.push(`${sourceLabel}: id must be a non-empty string`);
  }

  if (typeof record['name'] !== 'string' || record['name'].trim() === '') {
    errors.push(`${sourceLabel}: name must be a non-empty string`);
  }

  if (record['description'] !== null && record['description'] !== undefined && typeof record['description'] !== 'string') {
    errors.push(`${sourceLabel}: description must be a string or null`);
  }

  if (!Array.isArray(record['members'])) {
    errors.push(`${sourceLabel}: members must be an array`);
    return { valid: false, errors };
  }

  const members = record['members'] as unknown[];
  const memberErrors = validateMembers(members, sourceLabel);

  if (memberErrors.length > 0) {
    return { valid: false, errors: [...errors, ...memberErrors] };
  }

  const typedMembers = members as FamilyMemberJson[];
  const relationshipErrors = validateRelationships(typedMembers, sourceLabel);

  return {
    valid: errors.length === 0 && relationshipErrors.length === 0,
    errors: [...errors, ...relationshipErrors],
  };
}

function validateMembers(members: unknown[], sourceLabel: string): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  members.forEach((member, index) => {
    const memberLabel = `${sourceLabel}: members[${index}]`;

    if (!member || typeof member !== 'object') {
      errors.push(`${memberLabel}: must be an object`);
      return;
    }

    const record = member as Record<string, unknown>;

    if (typeof record['id'] !== 'string' || record['id'].trim() === '') {
      errors.push(`${memberLabel}: id must be a non-empty string`);
      return;
    }

    if (seenIds.has(record['id'])) {
      errors.push(`${memberLabel}: duplicate member id "${record['id']}"`);
    } else {
      seenIds.add(record['id']);
    }

    if (typeof record['firstName'] !== 'string' || record['firstName'].trim() === '') {
      errors.push(`${memberLabel}: firstName must be a non-empty string`);
    }

    if (typeof record['lastName'] !== 'string') {
      errors.push(`${memberLabel}: lastName must be a string`);
    }

    for (const field of [
      'gender',
      'dateOfBirth',
      'fatherId',
      'motherId',
      'spouseId',
      'notes',
      'photoUrl',
    ] as const) {
      const value = record[field];
      if (value !== null && value !== undefined && typeof value !== 'string') {
        errors.push(`${memberLabel}: ${field} must be a string or null`);
      }
    }

    if (record['spouseIds'] !== null && record['spouseIds'] !== undefined) {
      if (!Array.isArray(record['spouseIds'])) {
        errors.push(`${memberLabel}: spouseIds must be an array or null`);
      } else {
        record['spouseIds'].forEach((spouseId, spouseIndex) => {
          if (typeof spouseId !== 'string' || spouseId.trim() === '') {
            errors.push(`${memberLabel}: spouseIds[${spouseIndex}] must be a non-empty string`);
          }
        });
      }
    }

    const dateOfBirth = record['dateOfBirth'];
    if (typeof dateOfBirth === 'string' && dateOfBirth.trim() !== '' && !isIndianDate(dateOfBirth)) {
      errors.push(`${memberLabel}: dateOfBirth must use DD-MM-YYYY (Indian format)`);
    }
  });

  return errors;
}

function validateRelationships(members: FamilyMemberJson[], sourceLabel: string): string[] {
  const errors: string[] = [];
  const byId = new Map(members.map((member) => [member.id, member]));
  const spouseIdsByMember = new Map(members.map((member) => [member.id, normalizeSpouseIds(member)]));

  for (const member of members) {
    const memberLabel = `${sourceLabel}: member "${member.id}"`;
    const spouseIds = spouseIdsByMember.get(member.id) ?? [];

    for (const [field, refId] of [
      ['fatherId', member.fatherId],
      ['motherId', member.motherId],
    ] as const) {
      if (refId === null || refId === undefined) {
        continue;
      }

      if (!byId.has(refId)) {
        errors.push(`${memberLabel}: ${field} references missing member "${refId}"`);
      }
    }

    for (const spouseId of spouseIds) {
      if (!byId.has(spouseId)) {
        errors.push(`${memberLabel}: spouseIds references missing member "${spouseId}"`);
      }
    }

    if (member.fatherId !== null && member.motherId !== null && member.fatherId === member.motherId) {
      errors.push(`${memberLabel}: father and mother must be different members`);
    }

    if (member.fatherId === member.id || member.motherId === member.id) {
      errors.push(`${memberLabel}: a member cannot be their own parent`);
    }

    if (spouseIds.includes(member.id)) {
      errors.push(`${memberLabel}: a member cannot be their own spouse`);
    }
  }

  const checkedPairs = new Set<string>();

  for (const member of members) {
    const spouseIds = spouseIdsByMember.get(member.id) ?? [];

    for (const spouseId of spouseIds) {
      const pairKey = [member.id, spouseId].sort().join('|');

      if (checkedPairs.has(pairKey)) {
        continue;
      }

      checkedPairs.add(pairKey);

      const spouse = byId.get(spouseId);
      if (!spouse) {
        continue;
      }

      const reverseIds = spouseIdsByMember.get(spouseId) ?? [];

      if (!reverseIds.includes(member.id)) {
        errors.push(
          `${sourceLabel}: spouse relationship between "${member.id}" and "${spouseId}" is not bidirectional`,
        );
      }
    }
  }

  if (hasCircularParentage(members)) {
    errors.push(`${sourceLabel}: circular parent-child relationships are not allowed`);
  }

  return errors;
}

function hasCircularParentage(members: FamilyMemberJson[]): boolean {
  const byId = new Map(members.map((member) => [member.id, member]));

  for (const start of members) {
    const visited = new Set<string>();
    const stack = [start.id];

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      if (visited.has(currentId)) {
        return true;
      }

      visited.add(currentId);

      const current = byId.get(currentId);
      if (!current) {
        continue;
      }

      if (current.fatherId) {
        stack.push(current.fatherId);
      }

      if (current.motherId) {
        stack.push(current.motherId);
      }
    }
  }

  return false;
}

export function assertValidFamilyTreeJson(tree: unknown, sourceLabel = 'tree'): FamilyTreeJson {
  const result = validateFamilyTreeJson(tree, sourceLabel);

  if (!result.valid) {
    throw new Error(result.errors.join('; '));
  }

  return tree as FamilyTreeJson;
}

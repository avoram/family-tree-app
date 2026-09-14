/**
 * Resolve spouse ids from JSON that may use legacy `spouseId` or `spouseIds`.
 * Prefer `spouseIds` when present (even if empty); otherwise fall back to `spouseId`.
 */
export function normalizeSpouseIds(member: {
  spouseId?: string | null;
  spouseIds?: string[] | null;
}): string[] {
  if (Array.isArray(member.spouseIds)) {
    const seen = new Set<string>();
    const ids: string[] = [];

    for (const value of member.spouseIds) {
      if (typeof value !== 'string') {
        continue;
      }

      const id = value.trim();

      if (!id || seen.has(id)) {
        continue;
      }

      seen.add(id);
      ids.push(id);
    }

    return ids;
  }

  if (typeof member.spouseId === 'string' && member.spouseId.trim() !== '') {
    return [member.spouseId.trim()];
  }

  return [];
}

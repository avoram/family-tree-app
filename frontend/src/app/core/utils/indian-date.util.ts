/** Indian date format used in family-tree JSON: DD-MM-YYYY */
export const INDIAN_DATE_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

export function isIndianDate(value: string): boolean {
  const match = INDIAN_DATE_PATTERN.exec(value.trim());

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000) {
    return false;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/** Display helper — returns the stored DD-MM-YYYY string as-is. */
export function formatIndianDate(value: string | null | undefined): string | null {
  if (!value || !isIndianDate(value)) {
    return value?.trim() ? value.trim() : null;
  }

  return value.trim();
}

/** Year portion from DD-MM-YYYY (for compact tree labels). */
export function birthYearFromIndianDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const match = INDIAN_DATE_PATTERN.exec(value.trim());

  return match ? match[3] : null;
}

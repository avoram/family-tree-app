export interface FamilyTreeJson {
  id: string;
  name: string;
  description: string | null;
  members: FamilyMemberJson[];
}

export interface FamilyMemberJson {
  id: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null; // DD-MM-YYYY (Indian format)
  fatherId: string | null;
  motherId: string | null;
  /**
   * Preferred spouse field. Empty array / omitted / null = no spouses.
   * Most members have 0 or 1 entry; multiple ids are allowed.
   */
  spouseIds?: string[] | null;
  /** @deprecated Prefer `spouseIds`. Still accepted when loading older JSON. */
  spouseId?: string | null;
  notes: string | null;
  /** Relative path under the app, e.g. `photos/vora/mayank.jpg`. Optional. */
  photoUrl?: string | null;
}

export interface FamilyTreeManifest {
  trees: string[];
}

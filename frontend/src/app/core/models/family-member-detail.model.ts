export interface FamilyMemberDetail {
  id: string;
  treeId: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null; // DD-MM-YYYY (Indian format)
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
  notes: string | null;
  /** Relative path from JSON, e.g. `photos/vora/mayank.jpg`. Null when no photo. */
  photoUrl: string | null;
}

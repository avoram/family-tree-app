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
  spouseId: string | null;
  notes: string | null;
  /** Relative path under the app, e.g. `photos/vora/mayank.jpg`. Optional. */
  photoUrl?: string | null;
}

export interface FamilyTreeManifest {
  trees: string[];
}

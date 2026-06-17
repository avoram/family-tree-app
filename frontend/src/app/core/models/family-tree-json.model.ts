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
  dateOfBirth: string | null;
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
  notes: string | null;
}

export interface FamilyTreeManifest {
  trees: string[];
}

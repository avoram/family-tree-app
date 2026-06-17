export interface FamilyMemberDetail {
  id: string;
  treeId: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null;
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
  notes: string | null;
}

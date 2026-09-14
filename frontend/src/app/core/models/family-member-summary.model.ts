export interface FamilyMemberSummary {
  id: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null; // DD-MM-YYYY (Indian format)
  fatherId: string | null;
  motherId: string | null;
  spouseId: string | null;
}

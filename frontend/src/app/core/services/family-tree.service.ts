import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { FamilyMemberDetail } from '../models/family-member-detail.model';
import { FamilyMemberSummary } from '../models/family-member-summary.model';
import { FamilyTree } from '../models/family-tree.model';
import { FamilyTreeSummary } from '../models/family-tree-summary.model';

export interface IFamilyTreeService {
  listFamilyTrees(): Observable<FamilyTreeSummary[]>;
  getFamilyTree(treeId: string): Observable<FamilyTree>;
  getMembers(treeId: string): Observable<FamilyMemberSummary[]>;
  getMember(treeId: string, memberId: string): Observable<FamilyMemberDetail>;
}

export const FAMILY_TREE_SERVICE = new InjectionToken<IFamilyTreeService>('FAMILY_TREE_SERVICE');

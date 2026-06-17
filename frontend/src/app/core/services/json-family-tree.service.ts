import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, defer, firstValueFrom, from, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { FamilyMemberDetail } from '../models/family-member-detail.model';
import { FamilyMemberSummary } from '../models/family-member-summary.model';
import { FamilyTree } from '../models/family-tree.model';
import { FamilyTreeSummary } from '../models/family-tree-summary.model';
import { FamilyTreeJson, FamilyTreeManifest } from '../models/family-tree-json.model';
import { IFamilyTreeService } from './family-tree.service';
import { validateFamilyTreeJson } from './family-tree-validation';

@Injectable()
export class JsonFamilyTreeService implements IFamilyTreeService {
  private static readonly MANIFEST_URL = 'family-trees/index.json';
  private static readonly TREE_BASE_URL = 'family-trees';

  private readonly treeCache = new Map<string, FamilyTreeJson>();
  private summariesCache: FamilyTreeSummary[] | null = null;
  private manifestPromise: Promise<string[]> | null = null;

  constructor(private readonly http: HttpClient) {}

  listFamilyTrees(): Observable<FamilyTreeSummary[]> {
    return defer(() => from(this.loadSummaries()));
  }

  getFamilyTree(treeId: string): Observable<FamilyTree> {
    return defer(() =>
      from(this.loadTree(treeId)).pipe(
        map((tree) => ({
          id: tree.id,
          name: tree.name,
          description: tree.description,
        })),
      ),
    );
  }

  getMembers(treeId: string): Observable<FamilyMemberSummary[]> {
    return defer(() =>
      from(this.loadTree(treeId)).pipe(
        map((tree) => tree.members.map((member) => toMemberSummary(member))),
      ),
    );
  }

  getMember(treeId: string, memberId: string): Observable<FamilyMemberDetail> {
    return defer(() =>
      from(this.loadTree(treeId)).pipe(
        switchMap((tree) => {
          const member = tree.members.find((item) => item.id === memberId);

          if (!member) {
            return throwError(() => new Error(`Member "${memberId}" not found in tree "${treeId}"`));
          }

          return from([toMemberDetail(tree.id, member)]);
        }),
      ),
    );
  }

  private async loadSummaries(): Promise<FamilyTreeSummary[]> {
    if (this.summariesCache) {
      return this.summariesCache;
    }

    const fileNames = await this.loadManifest();
    const summaries: FamilyTreeSummary[] = [];

    for (const fileName of fileNames) {
      const tree = await this.fetchTree(fileName);

      if (!tree) {
        continue;
      }

      summaries.push({
        id: tree.id,
        name: tree.name,
        description: tree.description,
      });
      this.treeCache.set(tree.id, tree);
    }

    summaries.sort((left, right) => left.name.localeCompare(right.name));
    this.summariesCache = summaries;
    return summaries;
  }

  private async loadTree(treeId: string): Promise<FamilyTreeJson> {
    const cached = this.treeCache.get(treeId);

    if (cached) {
      return cached;
    }

    await this.loadSummaries();

    const tree = this.treeCache.get(treeId);

    if (!tree) {
      throw new Error(`Family tree "${treeId}" not found`);
    }

    return tree;
  }

  private async loadManifest(): Promise<string[]> {
    if (!this.manifestPromise) {
      this.manifestPromise = firstValueFrom(this.http.get<FamilyTreeManifest>(JsonFamilyTreeService.MANIFEST_URL))
        .then((manifest) => {
          if (!manifest || !Array.isArray(manifest.trees)) {
            throw new Error('Invalid family tree manifest');
          }

          return manifest.trees.filter((fileName) => typeof fileName === 'string' && fileName.trim() !== '');
        })
        .catch((error: unknown) => {
          this.manifestPromise = null;
          throw error;
        });
    }

    return this.manifestPromise;
  }

  private async fetchTree(fileName: string): Promise<FamilyTreeJson | null> {
    const url = `${JsonFamilyTreeService.TREE_BASE_URL}/${fileName}`;

    try {
      const rawTree = await firstValueFrom(this.http.get<unknown>(url));
      const validation = validateFamilyTreeJson(rawTree, fileName);

      if (!validation.valid) {
        console.warn(`Skipping invalid family tree file ${fileName}: ${validation.errors.join('; ')}`);
        return null;
      }

      return rawTree as FamilyTreeJson;
    } catch (error: unknown) {
      console.warn(`Failed to load family tree file ${fileName}`, error);
      return null;
    }
  }
}

function toMemberSummary(member: FamilyTreeJson['members'][number]): FamilyMemberSummary {
  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    fatherId: member.fatherId,
    motherId: member.motherId,
    spouseId: member.spouseId,
  };
}

function toMemberDetail(treeId: string, member: FamilyTreeJson['members'][number]): FamilyMemberDetail {
  return {
    id: member.id,
    treeId,
    firstName: member.firstName,
    lastName: member.lastName,
    gender: member.gender,
    dateOfBirth: member.dateOfBirth,
    fatherId: member.fatherId,
    motherId: member.motherId,
    spouseId: member.spouseId,
    notes: member.notes,
  };
}

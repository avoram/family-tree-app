import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FamilyTreeJson } from '../models/family-tree-json.model';
import { JsonFamilyTreeService } from './json-family-tree.service';

const family1Tree: FamilyTreeJson = {
  id: 'family1',
  name: 'Family One',
  description: 'Example family tree',
  members: [
    {
      id: 'm1',
      firstName: 'John',
      lastName: 'Smith',
      gender: 'male',
      dateOfBirth: '1950-03-15',
      fatherId: null,
      motherId: null,
      spouseId: 'm2',
      notes: null,
    },
    {
      id: 'm2',
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'female',
      dateOfBirth: '1952-07-20',
      fatherId: null,
      motherId: null,
      spouseId: 'm1',
      notes: 'Spouse of John',
    },
  ],
};

const family2Tree: FamilyTreeJson = {
  id: 'family2',
  name: 'Patel Family',
  description: 'Three-generation example family tree',
  members: [
    {
      id: 'g1',
      firstName: 'Ramesh',
      lastName: 'Patel',
      gender: 'male',
      dateOfBirth: '1940-01-10',
      fatherId: null,
      motherId: null,
      spouseId: 'g2',
      notes: null,
    },
    {
      id: 'g2',
      firstName: 'Lakshmi',
      lastName: 'Patel',
      gender: 'female',
      dateOfBirth: '1945-06-22',
      fatherId: null,
      motherId: null,
      spouseId: 'g1',
      notes: null,
    },
  ],
};

describe('JsonFamilyTreeService', () => {
  let service: JsonFamilyTreeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonFamilyTreeService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(JsonFamilyTreeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushManifestAndTrees(treeFiles: Record<string, FamilyTreeJson | object>): void {
    tick();

    const manifestReq = httpMock.expectOne('family-trees/index.json');
    manifestReq.flush({
      trees: Object.keys(treeFiles),
    });

    for (const [fileName, tree] of Object.entries(treeFiles)) {
      tick();

      const treeReq = httpMock.expectOne(`family-trees/${fileName}`);
      treeReq.flush(tree as FamilyTreeJson);
    }

    tick();
  }

  it('lists valid family trees from the manifest', fakeAsync(() => {
    let summaries: unknown;

    service.listFamilyTrees().subscribe((result) => {
      summaries = result;
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
      'family2.tree.json': family2Tree,
    });

    expect(summaries).toEqual([
      { id: 'family1', name: 'Family One', description: 'Example family tree' },
      { id: 'family2', name: 'Patel Family', description: 'Three-generation example family tree' },
    ]);
  }));

  it('skips invalid tree files without failing the request', fakeAsync(() => {
    let summaries: unknown;

    service.listFamilyTrees().subscribe((result) => {
      summaries = result;
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
      'invalid.tree.json': { id: 'invalid', name: 'Broken', members: [{ id: 'x', fatherId: 'missing' }] },
    });

    expect(summaries).toEqual([{ id: 'family1', name: 'Family One', description: 'Example family tree' }]);
  }));

  it('returns tree metadata for a known tree', fakeAsync(() => {
    let tree: unknown;

    service.getFamilyTree('family1').subscribe((result) => {
      tree = result;
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
    });

    expect(tree).toEqual({
      id: 'family1',
      name: 'Family One',
      description: 'Example family tree',
    });
  }));

  it('returns members mapped to summaries', fakeAsync(() => {
    let members: unknown;

    service.getMembers('family1').subscribe((result) => {
      members = result;
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
    });

    expect(members).toEqual([
      {
        id: 'm1',
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male',
        dateOfBirth: '1950-03-15',
        fatherId: null,
        motherId: null,
        spouseId: 'm2',
      },
      {
        id: 'm2',
        firstName: 'Jane',
        lastName: 'Smith',
        gender: 'female',
        dateOfBirth: '1952-07-20',
        fatherId: null,
        motherId: null,
        spouseId: 'm1',
      },
    ]);
  }));

  it('returns member detail with derived treeId', fakeAsync(() => {
    let member: unknown;

    service.getMember('family1', 'm2').subscribe((result) => {
      member = result;
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
    });

    expect(member).toEqual({
      id: 'm2',
      treeId: 'family1',
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'female',
      dateOfBirth: '1952-07-20',
      fatherId: null,
      motherId: null,
      spouseId: 'm1',
      notes: 'Spouse of John',
    });
  }));

  it('errors when a tree is not found', fakeAsync(() => {
    let error: unknown;

    service.getFamilyTree('missing').subscribe({
      error: (thrown) => {
        error = thrown;
      },
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
    });

    expect(error).toEqual(new Error('Family tree "missing" not found'));
  }));

  it('errors when a member is not found', fakeAsync(() => {
    let error: unknown;

    service.getMember('family1', 'missing').subscribe({
      error: (thrown) => {
        error = thrown;
      },
    });

    flushManifestAndTrees({
      'family1.tree.json': family1Tree,
    });

    expect(error).toEqual(new Error('Member "missing" not found in tree "family1"'));
  }));
});

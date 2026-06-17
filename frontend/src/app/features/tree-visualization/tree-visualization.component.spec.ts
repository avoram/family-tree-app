import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { FamilyMemberSummary } from '../../core/models/family-member-summary.model';
import { FamilyTree } from '../../core/models/family-tree.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { TreeVisualizationComponent } from './tree-visualization.component';

const patelTree: FamilyTree = {
  id: 'family2',
  name: 'Patel Family',
  description: 'Three-generation example family tree',
};

const patelMembers = [
  {
    id: 'g1',
    firstName: 'Ramesh',
    lastName: 'Patel',
    gender: 'male',
    dateOfBirth: '1940-01-10',
    fatherId: null,
    motherId: null,
    spouseId: 'g2',
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
  },
  {
    id: 'p1',
    firstName: 'Arun',
    lastName: 'Patel',
    gender: 'male',
    dateOfBirth: '1970-04-05',
    fatherId: 'g1',
    motherId: 'g2',
    spouseId: 'p2',
  },
  {
    id: 'p2',
    firstName: 'Priya',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '1972-09-18',
    fatherId: null,
    motherId: null,
    spouseId: 'p1',
  },
  {
    id: 'c1',
    firstName: 'Anika',
    lastName: 'Patel',
    gender: 'female',
    dateOfBirth: '2000-12-01',
    fatherId: 'p1',
    motherId: 'p2',
    spouseId: null,
  },
];

function createMockService(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    listFamilyTrees: () => of([]),
    getFamilyTree: () => of(patelTree),
    getMembers: () => of(patelMembers),
    getMember: () => throwError(() => new Error('not used')),
    ...overrides,
  };
}

describe('TreeVisualizationComponent', () => {
  let fixture: ComponentFixture<TreeVisualizationComponent>;
  let component: TreeVisualizationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeVisualizationComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: FAMILY_TREE_SERVICE, useValue: createMockService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeVisualizationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tree', patelTree);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render family members after loading', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ramesh Patel');
    expect(compiled.textContent).toContain('Anika Patel');
    expect(compiled.textContent).toContain('Generation 1');
    expect(compiled.textContent).toContain('Generation 3');
  });

  it('should collapse and expand branches', () => {
    const rootId = 'g1';

    expect(component.isExpanded(rootId)).toBeTrue();

    component.toggleExpanded(rootId);
    fixture.detectChanges();

    expect(component.isExpanded(rootId)).toBeFalse();

    component.toggleExpanded(rootId);
    fixture.detectChanges();

    expect(component.isExpanded(rootId)).toBeTrue();
  });

  it('should collapse all and expand all branches', () => {
    component.collapseAll();
    fixture.detectChanges();

    expect(component.expandedNodeIds().size).toBe(0);

    component.expandAll();
    fixture.detectChanges();

    expect(component.expandedNodeIds().size).toBeGreaterThan(0);
  });

  it('should emit memberSelected when a member is clicked', () => {
    const emitted: FamilyMemberSummary[] = [];
    component.memberSelected.subscribe((member) => emitted.push(member));

    component.onMemberClick(patelMembers[4]);
    fixture.detectChanges();

    expect(emitted).toEqual([patelMembers[4]]);
  });

  it('should show an error message when member loading fails', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [TreeVisualizationComponent],
        providers: [
          provideAnimationsAsync(),
          {
            provide: FAMILY_TREE_SERVICE,
            useValue: createMockService({
              getMembers: () => throwError(() => new Error('load failed')),
            }),
          },
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(TreeVisualizationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tree', patelTree);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Unable to load family members');
  });
});

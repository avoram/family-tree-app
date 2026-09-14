import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { FamilyMemberSummary } from '../../core/models/family-member-summary.model';
import { FamilyTree } from '../../core/models/family-tree.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { TreeVisualizationComponent } from './tree-visualization.component';

const janiTree: FamilyTree = {
  id: 'jani',
  name: 'Jani Family',
  description: 'Three-generation example family tree',
};

const janiMembers = [
  {
    id: 'g1',
    firstName: 'Ramesh',
    lastName: 'Jani',
    gender: 'male',
    dateOfBirth: '10-01-1940',
    fatherId: null,
    motherId: null,
    spouseIds: ['g2'],
  },
  {
    id: 'g2',
    firstName: 'Lakshmi',
    lastName: 'Jani',
    gender: 'female',
    dateOfBirth: '22-06-1945',
    fatherId: null,
    motherId: null,
    spouseIds: ['g1'],
  },
  {
    id: 'p1',
    firstName: 'Arun',
    lastName: 'Jani',
    gender: 'male',
    dateOfBirth: '05-04-1970',
    fatherId: 'g1',
    motherId: 'g2',
    spouseIds: ['p2'],
  },
  {
    id: 'p2',
    firstName: 'Priya',
    lastName: 'Jani',
    gender: 'female',
    dateOfBirth: '18-09-1972',
    fatherId: null,
    motherId: null,
    spouseIds: ['p1'],
  },
  {
    id: 'c1',
    firstName: 'Anika',
    lastName: 'Jani',
    gender: 'female',
    dateOfBirth: '01-12-2000',
    fatherId: 'p1',
    motherId: 'p2',
    spouseIds: [],
  },
];

function createMockService(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    listFamilyTrees: () => of([]),
    getFamilyTree: () => of(janiTree),
    getMembers: () => of(janiMembers),
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
    fixture.componentRef.setInput('tree', janiTree);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render family members after loading', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    component.expandAll();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Arun Jani');
    expect(compiled.textContent).toContain('Anika Jani');
    // Spouses render as their own cards, and birth years appear on each person.
    expect(compiled.textContent).toContain('Priya Jani');
    expect(compiled.textContent).toContain('b. 2000');
  });

  it('should collapse and expand branches', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const rootId = 'g1';

    expect(component.isExpanded(rootId)).toBeFalse();

    component.toggleExpanded(rootId);
    fixture.detectChanges();

    expect(component.isExpanded(rootId)).toBeTrue();

    component.toggleExpanded(rootId);
    fixture.detectChanges();

    expect(component.isExpanded(rootId)).toBeFalse();
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

    component.onMemberClick(janiMembers[4]);
    fixture.detectChanges();

    expect(emitted).toEqual([janiMembers[4]]);
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
    fixture.componentRef.setInput('tree', janiTree);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Unable to load family members');
  });
});

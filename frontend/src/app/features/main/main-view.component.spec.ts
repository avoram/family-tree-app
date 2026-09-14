import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { FamilyTree } from '../../core/models/family-tree.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { MainViewComponent } from './main-view.component';

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

describe('MainViewComponent', () => {
  let component: MainViewComponent;
  let fixture: ComponentFixture<MainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainViewComponent],
      providers: [
        provideAnimationsAsync(),
        {
          provide: FAMILY_TREE_SERVICE,
          useValue: {
            listFamilyTrees: () =>
              of([
                { id: 'ojha', name: 'Ojha Family', description: 'Example family tree' },
                { id: 'jani', name: 'Jani Family', description: 'Three-generation example family tree' },
              ]),
            getFamilyTree: () => of({ id: 'ojha', name: 'Ojha Family', description: null }),
            getMembers: (_id: string) => of(janiMembers),
            getMember: () => throwError(() => new Error('not used')),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('mat-toolbar span');

    expect(title?.textContent).toContain('Family Tree');
  });

  it('should render the tree selection component', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-tree-selection')).toBeTruthy();
    expect(compiled.querySelector('mat-select')).toBeTruthy();
    expect(compiled.querySelector('mat-label')?.textContent).toContain('Family tree');
  });

  it('should render tree visualization when a tree is selected', async () => {
    component.onTreeSelected({
      id: 'jani',
      name: 'Jani Family',
      description: 'Three-generation example family tree',
    } satisfies FamilyTree);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const expandAllButton = Array.from(compiled.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Expand all'),
    );
    expandAllButton?.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(compiled.querySelector('app-tree-visualization')).toBeTruthy();
    expect(compiled.textContent).toContain('Arun Jani');
    expect(compiled.textContent).toContain('Anika Jani');
    expect(compiled.textContent).not.toContain('Sample Family 1');
  });

  it('should show the generic placeholder when no tree is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Tree visualization will appear here.');
  });
});

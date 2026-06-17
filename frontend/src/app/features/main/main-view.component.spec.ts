import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { FamilyTree } from '../../core/models/family-tree.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { MainViewComponent } from './main-view.component';

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
                { id: 'family1', name: 'Family One', description: 'Example family tree' },
                { id: 'family2', name: 'Patel Family', description: 'Three-generation example family tree' },
              ]),
            getFamilyTree: () => of({ id: 'family1', name: 'Family One', description: null }),
            getMembers: (_id: string) => of(patelMembers),
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
      id: 'family2',
      name: 'Patel Family',
      description: 'Three-generation example family tree',
    } satisfies FamilyTree);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-tree-visualization')).toBeTruthy();
    expect(compiled.textContent).toContain('Ramesh Patel');
    expect(compiled.textContent).toContain('Anika Patel');
    expect(compiled.textContent).not.toContain('Sample Family 1');
  });

  it('should show the generic placeholder when no tree is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Tree visualization will appear here.');
  });
});

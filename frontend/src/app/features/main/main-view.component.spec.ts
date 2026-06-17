import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { MainViewComponent } from './main-view.component';

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
            getMembers: () => of([]),
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

  it('should update the tree area when a tree is selected', () => {
    component.onTreeSelected({
      id: 'family2',
      name: 'Patel Family',
      description: 'Three-generation example family tree',
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Selected: Patel Family');
    expect(compiled.textContent).toContain('Three-generation example family tree');
    expect(compiled.textContent).not.toContain('Sample Family 1');
  });

  it('should show the generic placeholder when no tree is selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Tree visualization will appear here.');
  });
});

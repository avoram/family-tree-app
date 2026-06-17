import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of, throwError } from 'rxjs';

import { FamilyTree } from '../../core/models/family-tree.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { TreeSelectionComponent } from './tree-selection.component';

const mockTrees = [
  { id: 'family1', name: 'Family One', description: 'Example family tree' },
  { id: 'family2', name: 'Patel Family', description: 'Three-generation example family tree' },
];

function createMockService(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    listFamilyTrees: () => of(mockTrees),
    getFamilyTree: (id: string) =>
      of({
        id,
        name: id === 'family1' ? 'Family One' : 'Patel Family',
        description: id === 'family1' ? 'Example family tree' : null,
      } satisfies FamilyTree),
    getMembers: () => of([]),
    getMember: () => throwError(() => new Error('not used')),
    ...overrides,
  };
}

describe('TreeSelectionComponent', () => {
  let fixture: ComponentFixture<TreeSelectionComponent>;
  let component: TreeSelectionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeSelectionComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: FAMILY_TREE_SERVICE, useValue: createMockService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list trees from the service', () => {
    expect(component.trees()).toEqual(mockTrees);
  });

  it('should emit treeSelected when a tree is selected', () => {
    const emitted: FamilyTree[] = [];
    component.treeSelected.subscribe((tree) => emitted.push(tree));

    component.onSelectionChange('family2');
    fixture.detectChanges();

    expect(emitted).toEqual([
      { id: 'family2', name: 'Patel Family', description: null },
    ]);
    expect(component.selectedTreeId()).toBe('family2');
  });

  it('should show an empty-state message when no trees are available', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [TreeSelectionComponent],
        providers: [
          provideAnimationsAsync(),
          {
            provide: FAMILY_TREE_SERVICE,
            useValue: createMockService({ listFamilyTrees: () => of([]) }),
          },
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(TreeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.trees()).toEqual([]);
    expect(component.isLoading()).toBeFalse();
  });

  it('should enable the dropdown after trees load', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('mat-select');

    expect(select?.classList.contains('mat-mdc-select-disabled')).toBeFalse();
  });
});

import { Component, inject, model, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of, tap } from 'rxjs';

import { FamilyTree } from '../../core/models/family-tree.model';
import { FamilyTreeSummary } from '../../core/models/family-tree-summary.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';

@Component({
  selector: 'app-tree-selection',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './tree-selection.component.html',
  styleUrl: './tree-selection.component.scss',
})
export class TreeSelectionComponent {
  private readonly familyTreeService = inject(FAMILY_TREE_SERVICE);

  readonly selectedTreeId = model<string | null>(null);
  readonly treeSelected = output<FamilyTree>();

  private readonly loading = signal(true);

  readonly trees = toSignal(
    this.familyTreeService.listFamilyTrees().pipe(
      tap(() => this.loading.set(false)),
      catchError((error) => {
        console.warn('Failed to load family trees', error);
        this.loading.set(false);
        return of([] as FamilyTreeSummary[]);
      }),
    ),
    { initialValue: [] as FamilyTreeSummary[] },
  );

  readonly isLoading = this.loading.asReadonly();

  onSelectionChange(treeId: string): void {
    this.selectedTreeId.set(treeId);
    this.familyTreeService.getFamilyTree(treeId).subscribe({
      next: (tree) => this.treeSelected.emit(tree),
      error: (error) => console.warn(`Failed to load tree "${treeId}"`, error),
    });
  }
}

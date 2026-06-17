import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FamilyTree } from '../../core/models/family-tree.model';
import { TreeSelectionComponent } from '../tree-selection/tree-selection.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [MatToolbarModule, MatCardModule, TreeSelectionComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent {
  readonly selectedTree = signal<FamilyTree | null>(null);

  onTreeSelected(tree: FamilyTree): void {
    this.selectedTree.set(tree);
  }
}

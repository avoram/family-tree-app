import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FamilyMemberSummary } from '../../core/models/family-member-summary.model';
import { FamilyTree } from '../../core/models/family-tree.model';
import { MemberDetailComponent } from '../member-detail/member-detail.component';
import { TreeSelectionComponent } from '../tree-selection/tree-selection.component';
import { TreeVisualizationComponent } from '../tree-visualization/tree-visualization.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    TreeSelectionComponent,
    TreeVisualizationComponent,
    MemberDetailComponent,
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent {
  readonly selectedTree = signal<FamilyTree | null>(null);
  readonly selectedMemberId = signal<string | null>(null);

  onTreeSelected(tree: FamilyTree): void {
    this.selectedTree.set(tree);
    this.selectedMemberId.set(null);
  }

  onMemberSelected(member: FamilyMemberSummary): void {
    this.selectedMemberId.set(member.id);
  }

  onMemberDetailClosed(): void {
    this.selectedMemberId.set(null);
  }
}

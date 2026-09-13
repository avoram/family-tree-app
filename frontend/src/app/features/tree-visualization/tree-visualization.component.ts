import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';

import { FamilyMemberSummary } from '../../core/models/family-member-summary.model';
import { FamilyTree } from '../../core/models/family-tree.model';
import {
  buildFamilyTreeLayout,
  collectNodeIds,
  FamilyTreeLayout,
  FamilyTreeLayoutNode,
  getMemberDisplayName,
} from '../../core/services/family-tree-layout';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';

@Component({
  selector: 'app-tree-visualization',
  standalone: true,
  imports: [NgTemplateOutlet, MatButtonModule, MatIconModule],
  templateUrl: './tree-visualization.component.html',
  styleUrl: './tree-visualization.component.scss',
})
export class TreeVisualizationComponent {
  private readonly familyTreeService = inject(FAMILY_TREE_SERVICE);

  readonly tree = input.required<FamilyTree>();
  readonly memberSelected = output<FamilyMemberSummary>();

  readonly layout = signal<FamilyTreeLayout | null>(null);
  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly expandedNodeIds = signal<Set<string>>(new Set());

  protected readonly getMemberDisplayName = getMemberDisplayName;

  constructor() {
    effect(
      (onCleanup) => {
        const tree = this.tree();
        this.loading.set(true);
        this.loadError.set(false);
        this.layout.set(null);

        const subscription = this.familyTreeService
          .getMembers(tree.id)
          .pipe(
            catchError((error) => {
              console.warn(`Failed to load members for tree "${tree.id}"`, error);
              this.loadError.set(true);
              return of([] as FamilyMemberSummary[]);
            }),
          )
          .subscribe((members) => {
            const builtLayout = buildFamilyTreeLayout(members);
            this.layout.set(builtLayout);
            // Start collapsed: only the founding couples are visible until expanded.
            this.expandedNodeIds.set(new Set());
            this.loading.set(false);
          });

        onCleanup(() => subscription.unsubscribe());
      },
      { allowSignalWrites: true },
    );
  }

  isExpanded(nodeId: string): boolean {
    return this.expandedNodeIds().has(nodeId);
  }

  toggleExpanded(nodeId: string): void {
    const next = new Set(this.expandedNodeIds());

    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }

    this.expandedNodeIds.set(next);
  }

  expandAll(): void {
    const currentLayout = this.layout();

    if (!currentLayout) {
      return;
    }

    this.expandedNodeIds.set(new Set(collectNodeIds(currentLayout.roots)));
  }

  collapseAll(): void {
    this.expandedNodeIds.set(new Set());
  }

  onMemberClick(member: FamilyMemberSummary): void {
    this.memberSelected.emit(member);
  }

  hasChildren(node: FamilyTreeLayoutNode): boolean {
    return node.children.length > 0;
  }

  /** Count of direct child couples, shown on the expand toggle. */
  childCount(node: FamilyTreeLayoutNode): number {
    return node.children.length;
  }

  birthYear(member: FamilyMemberSummary): string | null {
    return member.dateOfBirth ? member.dateOfBirth.slice(0, 4) : null;
  }

  initial(member: FamilyMemberSummary): string {
    return (member.firstName?.trim()?.[0] ?? '?').toUpperCase();
  }

  genderClass(member: FamilyMemberSummary): 'male' | 'female' | 'unknown' {
    const gender = member.gender?.toLowerCase();

    if (gender === 'male') {
      return 'male';
    }

    if (gender === 'female') {
      return 'female';
    }

    return 'unknown';
  }

  trackNode(_index: number, node: FamilyTreeLayoutNode): string {
    return node.couple.primary.id;
  }
}

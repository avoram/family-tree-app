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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
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
  imports: [NgTemplateOutlet, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule],
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
  readonly focusedGeneration = signal<number | null>(null);

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
            this.expandedNodeIds.set(new Set(collectNodeIds(builtLayout.roots)));
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

  onGenerationChange(generation: number | null): void {
    this.focusedGeneration.set(generation);

    if (generation === null) {
      return;
    }

    const section = document.getElementById(this.generationSectionId(generation));

    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  generationSectionId(generation: number): string {
    return `generation-section-${this.tree().id}-${generation}`;
  }

  generationLabel(generation: number): string {
    return `Generation ${generation + 1}`;
  }

  hasChildren(node: FamilyTreeLayoutNode): boolean {
    return node.children.length > 0;
  }

  trackNode(_index: number, node: FamilyTreeLayoutNode): string {
    return node.couple.primary.id;
  }

  trackMember(_index: number, member: FamilyMemberSummary): string {
    return member.id;
  }
}

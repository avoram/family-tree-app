import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, of } from 'rxjs';

import { FamilyMemberSummary } from '../../core/models/family-member-summary.model';
import { FamilyTree } from '../../core/models/family-tree.model';
import {
  buildFamilyTreeLayout,
  collectNodeIds,
  FamilyTreeLayout,
  FamilyTreeLayoutNode,
  findExpandIdsForMember,
  getMemberDisplayName,
  memberMatchesQuery,
} from '../../core/services/family-tree-layout';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';

@Component({
  selector: 'app-tree-visualization',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './tree-visualization.component.html',
  styleUrl: './tree-visualization.component.scss',
})
export class TreeVisualizationComponent {
  private readonly familyTreeService = inject(FAMILY_TREE_SERVICE);

  readonly tree = input.required<FamilyTree>();
  readonly memberSelected = output<FamilyMemberSummary>();

  readonly layout = signal<FamilyTreeLayout | null>(null);
  readonly members = signal<FamilyMemberSummary[]>([]);
  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly expandedNodeIds = signal<Set<string>>(new Set());
  readonly searchQuery = signal('');

  readonly matchedMembers = computed(() => {
    const query = this.searchQuery();
    const allMembers = this.members();

    if (!query.trim()) {
      return [] as FamilyMemberSummary[];
    }

    return allMembers.filter((member) => memberMatchesQuery(member, query));
  });

  readonly matchedMemberIds = computed(() => new Set(this.matchedMembers().map((member) => member.id)));

  readonly hasActiveSearch = computed(() => this.searchQuery().trim().length > 0);

  protected readonly getMemberDisplayName = getMemberDisplayName;

  constructor() {
    effect(
      (onCleanup) => {
        const tree = this.tree();
        this.loading.set(true);
        this.loadError.set(false);
        this.layout.set(null);
        this.members.set([]);
        this.searchQuery.set('');

        const subscription = this.familyTreeService
          .getMembers(tree.id)
          .pipe(
            catchError((error) => {
              console.warn(`Failed to load members for tree "${tree.id}"`, error);
              this.loadError.set(true);
              return of([] as FamilyMemberSummary[]);
            }),
          )
          .subscribe((loadedMembers) => {
            const builtLayout = buildFamilyTreeLayout(loadedMembers);
            this.layout.set(builtLayout);
            this.members.set(loadedMembers);
            // Start collapsed: only the founding couples are visible until expanded.
            this.expandedNodeIds.set(new Set());
            this.loading.set(false);
          });

        onCleanup(() => subscription.unsubscribe());
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      const layout = this.layout();
      const matches = this.matchedMembers();

      if (!layout || matches.length === 0) {
        return;
      }

      const expandIds = new Set<string>();

      for (const member of matches) {
        for (const id of findExpandIdsForMember(layout.roots, member.id)) {
          expandIds.add(id);
        }
      }

      if (expandIds.size > 0) {
        this.expandedNodeIds.update((current) => new Set([...current, ...expandIds]));
      }
    }, { allowSignalWrites: true });
  }

  isExpanded(nodeId: string): boolean {
    return this.expandedNodeIds().has(nodeId);
  }

  isSearchMatch(memberId: string): boolean {
    return this.matchedMemberIds().has(memberId);
  }

  onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
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

  trackMember(_index: number, member: FamilyMemberSummary): string {
    return member.id;
  }
}

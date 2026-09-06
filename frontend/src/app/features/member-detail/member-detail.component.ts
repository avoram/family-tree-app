import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { catchError, forkJoin, of } from 'rxjs';

import { FamilyMemberDetail } from '../../core/models/family-member-detail.model';
import { FamilyMemberSummary } from '../../core/models/family-member-summary.model';
import { FAMILY_TREE_SERVICE } from '../../core/services/family-tree.service';
import { getMemberDisplayName } from '../../core/services/family-tree-layout';
import {
  getMemberPhotoUrl,
  MEMBER_PHOTO_EXTENSIONS,
} from '../../core/utils/member-photo.util';

interface MemberRelationships {
  father: string | null;
  mother: string | null;
  spouse: string | null;
}

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent {
  private readonly familyTreeService = inject(FAMILY_TREE_SERVICE);

  readonly treeId = input.required<string>();
  readonly memberId = input.required<string>();
  readonly closed = output<void>();

  readonly memberPhoto = viewChild<ElementRef<HTMLImageElement>>('memberPhoto');

  readonly member = signal<FamilyMemberDetail | null>(null);
  readonly relationships = signal<MemberRelationships>({
    father: null,
    mother: null,
    spouse: null,
  });
  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly photoVisible = signal(false);
  readonly photoExtensionIndex = signal(0);

  readonly displayName = computed(() => {
    const current = this.member();

    if (!current) {
      return '';
    }

    return getMemberDisplayName(current);
  });

  readonly photoUrl = computed(() => {
    const treeId = this.treeId();
    const memberId = this.memberId();
    const extension = MEMBER_PHOTO_EXTENSIONS[this.photoExtensionIndex()] ?? MEMBER_PHOTO_EXTENSIONS[0];

    return getMemberPhotoUrl(treeId, memberId, extension);
  });

  constructor() {
    effect(
      (onCleanup) => {
        const treeId = this.treeId();
        const memberId = this.memberId();

        this.loading.set(true);
        this.loadError.set(false);
        this.member.set(null);
        this.relationships.set({ father: null, mother: null, spouse: null });
        this.photoVisible.set(false);
        this.photoExtensionIndex.set(0);

        const subscription = forkJoin({
          member: this.familyTreeService.getMember(treeId, memberId).pipe(
            catchError((error) => {
              console.warn(`Failed to load member "${memberId}" in tree "${treeId}"`, error);
              this.loadError.set(true);
              return of(null as FamilyMemberDetail | null);
            }),
          ),
          members: this.familyTreeService.getMembers(treeId).pipe(
            catchError(() => of([] as FamilyMemberSummary[])),
          ),
        }).subscribe(({ member, members }) => {
          if (member) {
            this.member.set(member);
            this.relationships.set(resolveRelationships(member, members));
          }

          this.loading.set(false);
        });

        onCleanup(() => subscription.unsubscribe());
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      this.photoUrl();
      this.memberPhoto();

      queueMicrotask(() => this.syncPhotoFromElement());
    });
  }

  onClose(): void {
    this.closed.emit();
  }

  onPhotoLoad(): void {
    this.photoVisible.set(true);
  }

  onPhotoError(): void {
    const nextIndex = this.photoExtensionIndex() + 1;

    if (nextIndex < MEMBER_PHOTO_EXTENSIONS.length) {
      this.photoVisible.set(false);
      this.photoExtensionIndex.set(nextIndex);
      return;
    }

    this.photoVisible.set(false);
  }

  formatGender(gender: string | null): string {
    if (!gender) {
      return 'Not specified';
    }

    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }

  private syncPhotoFromElement(): void {
    const img = this.memberPhoto()?.nativeElement;

    if (!img || !this.member()) {
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      this.photoVisible.set(true);
    }
  }
}

function resolveRelationships(
  member: FamilyMemberDetail,
  members: FamilyMemberSummary[],
): MemberRelationships {
  const memberById = new Map(members.map((item) => [item.id, item]));

  return {
    father: resolveMemberName(memberById, member.fatherId),
    mother: resolveMemberName(memberById, member.motherId),
    spouse: resolveMemberName(memberById, member.spouseId),
  };
}

function resolveMemberName(
  memberById: Map<string, FamilyMemberSummary>,
  memberId: string | null,
): string | null {
  if (!memberId) {
    return null;
  }

  const related = memberById.get(memberId);

  if (!related) {
    return null;
  }

  return getMemberDisplayName(related);
}

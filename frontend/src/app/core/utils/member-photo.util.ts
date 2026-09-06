/** Supported photo file extensions (checked in order). */
export const MEMBER_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

export type MemberPhotoExtension = (typeof MEMBER_PHOTO_EXTENSIONS)[number];

/**
 * Convention-based member photo path (no JSON field required).
 *
 * Place files under `frontend/public/photos/<treeId>/<memberId>.<ext>`
 * e.g. `photos/family1/m1.jpg`
 *
 * Relative URL — resolves against the document `<base href>` (local `/` or GitHub Pages `/family-tree-app/`).
 */
export function getMemberPhotoUrl(
  treeId: string,
  memberId: string,
  extension: MemberPhotoExtension = MEMBER_PHOTO_EXTENSIONS[0],
): string {
  return `photos/${treeId}/${memberId}.${extension}`;
}

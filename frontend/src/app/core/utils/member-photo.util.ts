/**
 * Helper for documenting the photos folder layout.
 * Runtime photo paths come from each member's `photoUrl` field in the tree JSON.
 */
export const MEMBER_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

export type MemberPhotoExtension = (typeof MEMBER_PHOTO_EXTENSIONS)[number];

/**
 * Suggested path when adding a photo file + JSON link.
 *
 * 1. Save file under `frontend/public/photos/<treeId>/<memberId>.<ext>`
 * 2. Set member `"photoUrl": "photos/<treeId>/<memberId>.<ext>"` in the tree JSON
 */
export function getMemberPhotoUrl(
  treeId: string,
  memberId: string,
  extension: MemberPhotoExtension = MEMBER_PHOTO_EXTENSIONS[0],
): string {
  return `photos/${treeId}/${memberId}.${extension}`;
}

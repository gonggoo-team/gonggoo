/**
 * Badge Utilities
 *
 * 배지 관련 유틸리티 함수들입니다.
 * - Badge 타입을 StatusBadge 형식으로 변환
 */

import type { Badge } from '../types/product.types';
import type { StatusBadgeType } from '@/design-system/primitives/StatusBadge';

/**
 * Badge 타입을 StatusBadge 형식으로 변환
 *
 * @param badges - 변환할 배지 배열 (optional)
 * @returns StatusBadge 형식의 배지 배열
 *
 * @example
 * ```typescript
 * const badges = convertBadges([
 *   { type: 'deadline', label: '마감 임박' },
 *   { type: 'new', label: '신규' }
 * ]);
 * ```
 */
export const convertBadges = (
  badges?: Badge[]
): Array<{ type: StatusBadgeType; label: string }> => {
  if (!badges) return [];
  return badges.map((badge) => ({
    type: badge.type as StatusBadgeType,
    label: badge.label,
  }));
};

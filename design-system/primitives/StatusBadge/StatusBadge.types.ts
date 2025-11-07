/**
 * StatusBadge Types
 *
 * 상태 표시용 배지 컴포넌트의 타입 정의입니다.
 */

/**
 * StatusBadge 타입
 */
export type StatusBadgeType = 'deadline' | 'recruiting' | 'remaining' | 'closed';

/**
 * BadgeType (alias for StatusBadgeType)
 */
export type BadgeType = StatusBadgeType;

/**
 * StatusBadge Props
 */
export interface StatusBadgeProps {
  /**
   * 배지 타입
   * - deadline: 오늘 마감 (빨간색)
   * - recruiting: 모집 중 (초록색)
   * - remaining: 남은 기간 (연한 빨강)
   * - closed: 모집 마감 (회색)
   */
  type: StatusBadgeType;

  /**
   * 표시할 텍스트
   * @example "오늘 마감", "3명 모집", "14일 남음", "모집 마감"
   */
  label: string;
}

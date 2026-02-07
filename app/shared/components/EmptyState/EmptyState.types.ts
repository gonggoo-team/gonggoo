/**
 * EmptyState Types
 */

export interface EmptyStateProps {
  /** 빈 상태 메시지 */
  message: string;

  /** 아이콘 이름 (optional) */
  iconName?: string;

  /** 아이콘 크기 (optional) */
  iconSize?: number;

  /** 추가 설명 (optional) */
  description?: string;
}

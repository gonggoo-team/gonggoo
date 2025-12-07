/**
 * StatusBadge Types
 *
 * 상태 표시용 배지 컴포넌트의 타입 정의입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-12-07
 */

/**
 * StatusBadge Variant
 *
 * 배지의 크기와 스타일 컨텍스트를 결정합니다.
 *
 * @description
 * - card: ProductCard용 소형 배지 (11px, padding 2px 4px, 반응형)
 * - detail: 상품 상세 페이지용 대형 배지 (14px, padding 5px 10px, 고정 크기)
 */
export type StatusBadgeVariant = 'card' | 'detail';

/**
 * StatusBadge 타입
 *
 * @description
 * Card variant 용도:
 * - deadline: "오늘 마감" (빨간 배경 #F7514D, 흰색 텍스트)
 * - recruiting: "3명 모집" (연한 초록 배경 #E6EDE9, 진한 초록 텍스트 #006242)
 * - remaining: "14일 남음" (연한 핑크 배경 #FFF4F6, 빨간 텍스트 #F7514D)
 * - closed: "모집 마감" (회색 배경 #A6A6A6, 흰색 텍스트)
 *
 * Detail variant 용도:
 * - recruiting: "모집 중" (진한 초록 배경 #006242, 흰색 텍스트, font weight 600)
 * - recruitment-complete: "모집 완료" (연한 회색 배경 #D9D9D9, 검은색 텍스트)
 * - transaction-complete: "거래 완료" (연한 회색 배경 #D9D9D9, 검은색 텍스트)
 *
 * @note recruiting 타입은 variant에 따라 다른 색상을 사용합니다.
 */
export type StatusBadgeType =
  | 'deadline'
  | 'recruiting'
  | 'remaining'
  | 'closed'
  | 'recruitment-complete'
  | 'transaction-complete';

/**
 * BadgeType (alias for StatusBadgeType)
 *
 * @deprecated Use StatusBadgeType instead
 */
export type BadgeType = StatusBadgeType;

/**
 * StatusBadge Props
 */
export interface StatusBadgeProps {
  /**
   * 배지 variant - 크기 및 스타일 컨텍스트 결정
   *
   * @default 'card'
   *
   * @example
   * ```tsx
   * // ProductCard (기본값, card variant)
   * <StatusBadge type="deadline" label="오늘 마감" />
   * <StatusBadge type="recruiting" label="3명 모집" />
   * <StatusBadge type="remaining" label="14일 남음" />
   *
   * // 상품 상세 페이지 (detail variant)
   * <StatusBadge variant="detail" type="recruiting" label="모집 중" />
   * <StatusBadge variant="detail" type="recruitment-complete" label="모집 완료" />
   * <StatusBadge variant="detail" type="transaction-complete" label="거래 완료" />
   * ```
   */
  variant?: StatusBadgeVariant;

  /**
   * 배지 타입 - 색상 및 스타일 결정
   *
   * @note variant에 따라 같은 type도 다른 색상을 사용할 수 있습니다 (예: recruiting)
   */
  type: StatusBadgeType;

  /**
   * 표시할 텍스트
   *
   * @example
   * Card variant: "오늘 마감", "3명 모집", "14일 남음", "모집 마감"
   * Detail variant: "모집 중", "모집 완료", "거래 완료"
   */
  label: string;
}

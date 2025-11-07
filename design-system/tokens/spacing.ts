/**
 * Spacing Design Tokens
 *
 * 일관된 간격을 위한 spacing 토큰입니다.
 * Figma에서 추출하거나 수동으로 정의할 수 있습니다.
 *
 * 8px 베이스 시스템 사용 (4, 8, 16, 24, 32...)
 *
 * 수정 시 주의사항:
 * 1. 8의 배수 또는 4의 배수로 유지 (디자인 일관성)
 * 2. 새로운 spacing 추가 시 semantic한 이름 사용
 * 3. as const를 유지하여 타입 안전성 보장
 */

export const spacing = {
  /** 4px - 아주 작은 간격 */
  xxs: 4,

  /** 8px - 작은 간격 */
  xs: 8,

  /** 9px - 상품 카드 간격 (2열 그리드) */
  xs9: 9,

  /** 10px - 카테고리 항목 패딩 */
  sm10: 10,

  /** 12px - 작은-중간 간격 */
  sm: 12,

  /** 16px - 기본 간격 */
  md: 16,

  /** 20px - 중간-큰 간격 */
  lg: 20,

  /** 24px - 큰 간격 */
  xl: 24,

  /** 30px - 상품카드 행 간격 (Figma 기준) */
  xl30: 30,

  /** 32px - 아주 큰 간격 */
  xxl: 32,

  /** 40px - 섹션 간격 */
  xxxl: 40,

  /** 48px - 큰 섹션 간격 */
  xxxxl: 48,
} as const;

/**
 * Spacing 타입 추출
 */
export type Spacing = typeof spacing;

/**
 * Spacing 키 타입
 */
export type SpacingKey = keyof typeof spacing;

/**
 * Spacing 값 타입 (숫자)
 */
export type SpacingValue = typeof spacing[SpacingKey];

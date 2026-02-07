/**
 * Radius Design Tokens
 *
 * Border radius 관련 토큰입니다.
 * 버튼, 카드, 입력 필드 등의 모서리 둥글기를 정의합니다.
 *
 * 수정 시 주의사항:
 * 1. Figma의 corner radius 값과 동기화
 * 2. 일관된 둥글기 사용으로 디자인 통일성 유지
 */

export const radius = {
  /** 0px - 둥글지 않음 */
  none: 0,

  /** 4px - 약간 둥글게 */
  xs: 4,

  /** 8px - 작게 둥글게 */
  sm: 8,

  /** 12px - 중간 둥글게 */
  md: 12,

  /** 16px - 둥글게 */
  lg: 16,

  /** 20px - 많이 둥글게 */
  xl: 20,

  /** 24px - 아주 둥글게 */
  xxl: 24,

  /** 32px - 매우 둥글게 */
  xxxl: 32,

  /** 40px - pill 형태 (카테고리/검색 버튼) */
  xl40: 40,

  /** 48px - 완전히 둥글게 (pill 형태) */
  full: 48,

  /** 9999px - 완전한 원형 */
  round: 9999,
} as const;

/**
 * Radius 타입 추출
 */
export type Radius = typeof radius;

/**
 * Radius 키 타입
 */
export type RadiusKey = keyof typeof radius;

/**
 * Radius 값 타입 (숫자)
 */
export type RadiusValue = typeof radius[RadiusKey];

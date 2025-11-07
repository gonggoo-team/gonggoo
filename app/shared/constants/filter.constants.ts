/**
 * Filter Constants
 *
 * 필터 관련 상수를 중앙에서 관리합니다.
 * 매직 스트링을 제거하고 타입 안정성을 보장합니다.
 */

/**
 * 슬롯 범위 상수
 */
export const SLOT_RANGES = {
  RANGE_1_4: '1~4슬롯',
  RANGE_5_8: '5~8슬롯',
  RANGE_9_12: '9~12슬롯',
  RANGE_13_PLUS: '13슬롯 이상',
} as const;

/**
 * 슬롯 범위 배열 (기본 선택값)
 */
export const DEFAULT_SLOT_RANGES = [
  SLOT_RANGES.RANGE_1_4,
  SLOT_RANGES.RANGE_5_8,
  SLOT_RANGES.RANGE_9_12,
  SLOT_RANGES.RANGE_13_PLUS,
] as const;

/**
 * 슬롯 범위 타입
 */
export type SlotRange = (typeof SLOT_RANGES)[keyof typeof SLOT_RANGES];

/**
 * 모집 상태 상수
 */
export const RECRUITMENT_STATUSES = {
  RECRUITING: '모집 중',
  DEADLINE_SOON: '마감 임박',
  COMPLETED: '모집 완료',
  EXCLUDE_COMPLETED: '모집 완료 제외', // 필터 전용 옵션
} as const;

/**
 * 모집 상태 배열 (기본 선택값)
 * 기본적으로 '모집 중'과 '마감 임박'만 선택
 */
export const DEFAULT_RECRUITMENT_STATUSES = [
  RECRUITMENT_STATUSES.RECRUITING,
  RECRUITMENT_STATUSES.DEADLINE_SOON,
] as const;

/**
 * 모집 상태 타입
 */
export type RecruitmentStatusFilter =
  (typeof RECRUITMENT_STATUSES)[keyof typeof RECRUITMENT_STATUSES];

/**
 * 필터 이벤트 이름
 */
export const FILTER_EVENTS = {
  APPLIED: 'filter:applied',
  RESET: 'filter:reset',
} as const;

/**
 * 기본 가격 범위 (fallback)
 */
export const DEFAULT_PRICE_RANGE = {
  MIN: 100,
  MAX: 100000,
} as const;

/**
 * AgeFilterBar Type Definitions
 *
 * 연령대 필터 바 컴포넌트의 타입을 정의합니다.
 */

/**
 * AgeFilterBar Props
 */
export interface AgeFilterBarProps {
  /** 연령대 목록 */
  ageGroups: string[];

  /** 현재 선택된 연령대 */
  selectedAgeGroup: string;

  /** 연령대 선택 핸들러 */
  onSelect: (ageGroup: string) => void;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;
}

/**
 * 기본 연령대 목록
 * Figma 디자인 기준: 전체, 10대, 20대, 30대, 40대, 50대, 60대 이상
 */
export const DEFAULT_AGE_GROUPS = [
  '전체',
  '10대',
  '20대',
  '30대',
  '40대',
  '50대',
  '60대 이상',
];

/**
 * PopularFilterBar Type Definitions
 *
 * 인기 탭 전용 필터 바 컴포넌트의 타입을 정의합니다.
 */

/**
 * PopularFilterBar Props
 */
export interface PopularFilterBarProps {
  /** 성별 필터 클릭 핸들러 */
  onGenderPress: () => void;

  /** 연령대 필터 클릭 핸들러 */
  onAgePress: () => void;

  /** 기간 필터 클릭 핸들러 */
  onPeriodPress: () => void;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;
}

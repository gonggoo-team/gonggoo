/**
 * SectionHeader Type Definitions
 *
 * 섹션 헤더 컴포넌트의 타입을 정의합니다.
 */

/**
 * SectionHeader Props
 */
export interface SectionHeaderProps {
  /** 섹션 제목 */
  title: string;

  /** 섹션 부제목 (선택사항) */
  subtitle?: string;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;

  /** 커스텀 제목 스타일 */
  titleStyle?: object;

  /** 커스텀 부제목 스타일 */
  subtitleStyle?: object;
}

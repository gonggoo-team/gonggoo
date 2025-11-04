/**
 * ProgressBar Types
 *
 * 진행률 표시 게이지 컴포넌트의 타입 정의입니다.
 */

/**
 * ProgressBar Props
 */
export interface ProgressBarProps {
  /**
   * 진행률 (0-100)
   */
  percentage: number;

  /**
   * 색상 variant
   * - light: 텍스트 흰색 (진행 영역에 텍스트가 올 때)
   * - dark: 텍스트 검은색 (배경 영역에 텍스트가 올 때)
   */
  variant?: 'light' | 'dark';

  /**
   * 퍼센트 라벨 표시 여부
   * @default true
   */
  showLabel?: boolean;
}

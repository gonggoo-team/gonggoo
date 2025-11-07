/**
 * ScrollIndicator Types
 *
 * 스크롤 페이지네이션 인디케이터 컴포넌트의 타입 정의입니다.
 */

/**
 * ScrollIndicator Props
 */
export interface ScrollIndicatorProps {
  /**
   * 현재 페이지 인덱스 (0부터 시작)
   */
  currentIndex?: number;

  /**
   * 전체 페이지 수
   */
  totalPages: number;
  currentPage: number;
  /**
   * 활성화된 점의 색상
   * @default '#A6A6A6' (Figma 기준)
   */
  activeColor?: string;

  /**
   * 비활성화된 점의 색상
   * @default '#D1D6DA' (Figma 기준)
   */
  inactiveColor?: string;
}

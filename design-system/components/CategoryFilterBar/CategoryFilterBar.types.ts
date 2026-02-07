/**
 * CategoryFilterBar Type Definitions
 *
 * 카테고리 필터 바 컴포넌트의 타입을 정의합니다.
 */

/**
 * CategoryFilterBar Props
 */
export interface CategoryFilterBarProps {
  /** 카테고리 목록 */
  categories: string[];

  /** 현재 선택된 카테고리 */
  selectedCategory: string;

  /** 카테고리 선택 핸들러 */
  onSelect: (category: string) => void;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;
}

/**
 * 기본 카테고리 목록
 */
export const DEFAULT_CATEGORIES = [
  '전체',
  '식품',
  '생활',
  '육아',
  '애완용품',
  '가전',
  '주방',
  '리빙',
  '기타',
];

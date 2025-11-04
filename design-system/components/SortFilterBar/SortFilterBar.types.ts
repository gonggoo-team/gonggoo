/**
 * SortFilterBar Type Definitions
 *
 * 정렬/필터 버튼 바 컴포넌트의 타입을 정의합니다.
 */

/**
 * SortFilterBar Props
 */
export interface SortFilterBarProps {
  /** 정렬 옵션 목록 */
  sortOptions: string[];

  /** 현재 선택된 정렬 옵션 */
  selectedSort: string;

  /** 정렬 옵션 선택 핸들러 */
  onSortSelect: (sort: string) => void;

  /** 정렬 버튼 클릭 핸들러 (드롭다운 토글) */
  onSortPress: () => void;

  /** 필터 버튼 클릭 핸들러 */
  onFilterPress: () => void;

  /** 드롭다운 표시 여부 */
  isDropdownVisible: boolean;

  /** 드롭다운 닫기 핸들러 */
  onDropdownClose: () => void;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;

  resultsCount?: number;
}

/**
 * 기본 정렬 옵션
 */
export const DEFAULT_SORT_OPTIONS = ['추천순', '최신순', '오래된 순', '인기순', '할인율 높은 순'];

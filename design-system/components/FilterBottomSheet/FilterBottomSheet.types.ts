/**
 * FilterBottomSheet Type Definitions
 *
 * 필터 바텀시트 컴포넌트의 타입을 정의합니다.
 */

/**
 * Filter Type
 * 필터 종류: 성별, 연령대, 기간
 */
export type FilterType = 'gender' | 'age' | 'period';

/**
 * Filter Options
 * 각 필터 타입별 옵션 리스트
 */
export interface FilterOptions {
  /** 성별 옵션 */
  gender: string[];

  /** 연령대 옵션 */
  age: string[];

  /** 기간 옵션 */
  period: string[];
}

/**
 * Selected Filters
 * 현재 선택된 필터 값들
 */
export interface SelectedFilters {
  /** 선택된 성별 */
  gender: string;

  /** 선택된 연령대 */
  age: string;

  /** 선택된 기간 */
  period: string;
}

/**
 * FilterBottomSheet Props
 */
export interface FilterBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isVisible: boolean;

  /** 닫기 핸들러 */
  onClose: () => void;

  /** 현재 활성 탭 */
  activeTab: FilterType;

  /** 탭 변경 핸들러 */
  onTabChange: (tab: FilterType) => void;

  /** 현재 선택된 필터들 */
  selectedFilters: SelectedFilters;

  /** 옵션 선택 핸들러 */
  onSelectOption: (filterType: FilterType, option: string) => void;

  /** 초기화 핸들러 */
  onReset: () => void;

  /** 적용 핸들러 */
  onApply: () => void;

  /** 모집글 개수 */
  resultCount: number;
}

/**
 * 기본 필터 옵션 데이터
 */
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  gender: ['성별 전체', '여성', '남성'],
  age: ['연령대 전체', '10대', '20대', '30대', '40대 이상'],
  period: ['실시간 랭킹', '원데이 랭킹', '주간 랭킹', '월간 랭킹'],
};

/**
 * 필터 탭 라벨
 */
export const FILTER_TAB_LABELS: Record<FilterType, string> = {
  gender: '성별',
  age: '연령대',
  period: '기간',
};

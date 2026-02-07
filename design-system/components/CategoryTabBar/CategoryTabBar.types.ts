/**
 * CategoryTabBar Types
 *
 * 메인 홈 상단 카테고리 바 컴포넌트의 타입 정의입니다.
 */

/**
 * 카테고리 타입
 * 홈, 동네, 오늘 마감, 인기, 추천, 나눔, 이벤트
 */
export type CategoryType = 'home' | 'neighborhood' | 'today' | 'popular' | 'recommend' | 'share' | 'event';

/**
 * 카테고리 라벨 매핑
 */
export const CATEGORY_LABELS: Record<CategoryType, string> = {
  home: '홈',
  neighborhood: '동네',
  today: '오늘 마감',
  popular: '인기',
  recommend: '추천',
  share: '나눔',
  event: '이벤트',
};

/**
 * 카테고리 순서 배열
 */
export const CATEGORY_ORDER: CategoryType[] = [
  'home',
  'neighborhood',
  'today',
  'popular',
  'recommend',
  'share',
  'event',
];

/**
 * CategoryTabBar Props
 */
export interface CategoryTabBarProps {
  /**
   * 현재 선택된 카테고리
   */
  selectedCategory: CategoryType;

  /**
   * 카테고리 선택 시 호출되는 콜백
   */
  onCategoryChange: (category: CategoryType) => void;
}

/**
 * CategoryTabItem Props
 */
export interface CategoryTabItemProps {
  /**
   * 카테고리 타입
   */
  category: CategoryType;

  /**
   * 현재 선택되었는지 여부
   */
  isSelected: boolean;

  /**
   * 클릭 시 호출되는 콜백 (category를 인자로 받음)
   */
  onPress: (category: CategoryType) => void;
}

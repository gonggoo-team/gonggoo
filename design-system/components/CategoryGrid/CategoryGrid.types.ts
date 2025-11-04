/**
 * CategoryGrid Component Types
 */

import type { CategoryData } from '@/app/shared/types/category.types';
import type { ViewStyle } from 'react-native';

export interface CategoryGridProps {
  /** 카테고리 목록 */
  categories: CategoryData[];
  /** 카테고리 클릭 핸들러 */
  onCategoryPress: (category: CategoryData) => void;
  /** 그리드 열 개수 (기본값: 2) */
  numColumns?: number;
  /** 커스텀 스타일 */
  style?: ViewStyle;
}

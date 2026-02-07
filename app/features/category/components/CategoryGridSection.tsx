/**
 * CategoryGridSection Component
 *
 * 카테고리 그리드 섹션 컴포넌트입니다.
 * - CategoryGrid 컴포넌트를 래핑
 * - 카테고리 선택 로직 처리
 */

import React from 'react';
import { View } from 'react-native';
import { CategoryGrid } from '@/design-system';
import type { CategoryData } from '@/app/shared/types';

interface CategoryGridSectionProps {
  /** 카테고리 목록 */
  categories: CategoryData[];
  /** 카테고리 선택 핸들러 */
  onCategoryPress: (category: CategoryData) => void;
}

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({
  categories,
  onCategoryPress,
}) => {
  return (
    <View>
      <CategoryGrid
        categories={categories}
        onCategoryPress={onCategoryPress}
        numColumns={2}
      />
    </View>
  );
};

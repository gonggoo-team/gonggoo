/**
 * CategoryFilterBar Component
 *
 * 가로 스크롤이 가능한 카테고리 필터 버튼 바입니다.
 * - 여러 탭에서 재사용 가능
 * - Button 컴포넌트 기반 (category-selected/category-unselected variant)
 * - 반응형 지원
 *
 * 사용 예시:
 * ```tsx
 * <CategoryFilterBar
 *   categories={['전체', '식품', '생활', ...]}
 *   selectedCategory={selectedCategory}
 *   onSelect={setSelectedCategory}
 * />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Button } from '../../primitives/Button';
import { createCategoryFilterBarStyles } from './CategoryFilterBar.styles';
import type { CategoryFilterBarProps } from './CategoryFilterBar.types';

/**
 * CategoryFilterBar Component
 */
export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelect,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createCategoryFilterBarStyles(theme);

  // renderItem을 useCallback으로 메모이제이션
  const renderItem = useCallback(({ item }: { item: string }) => (
    <View style={{ marginRight: theme.spacing.xxs }}>
      <Button
        variant={selectedCategory === item ? 'category-selected' : 'category-unselected'}
        onPress={() => onSelect(item)}
      >
        {item}
      </Button>
    </View>
  ), [selectedCategory, onSelect, theme.spacing.xxs]);

  // getItemLayout 구현 (고정 너비 추정)
  const ITEM_WIDTH = 80; // 버튼 평균 너비 + 마진
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  }), []);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        scrollEnabled={true}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

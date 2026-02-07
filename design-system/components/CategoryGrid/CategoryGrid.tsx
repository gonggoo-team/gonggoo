/**
 * CategoryGrid Component
 *
 * 카테고리 그리드 레이아웃 컴포넌트입니다.
 * - 2열 그리드 (기본값)
 * - FlatList 기반 최적화
 * - 반응형 지원
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=796-11940
 * 마지막 동기화: 2025-10-27
 *
 * 사용 예시:
 * ```tsx
 * <CategoryGrid
 *   categories={categories}
 *   onCategoryPress={(category) => handlePress(category)}
 *   numColumns={2}
 * />
 * ```
 */

import type { CategoryData } from '@/app/shared/types/category.types';
import React, { useMemo, useCallback } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks';
import { CategoryItem } from '../../primitives/CategoryItem';
import { createCategoryGridStyles } from './CategoryGrid.styles';
import type { CategoryGridProps } from './CategoryGrid.types';

/**
 * CategoryGrid Component
 */
export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onCategoryPress,
  numColumns = 2,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createCategoryGridStyles(theme);
  const { width: screenWidth } = useWindowDimensions();

  // 2열 그리드 카드 너비 계산
  const itemWidth = useMemo(() => {
    const containerPadding = 40; // columnWrapper paddingHorizontal (좌우 각 20px)
    const gap = theme.spacing.xs9; // 9px
    const availableWidth = screenWidth - containerPadding;
    return (availableWidth - gap) / 2;
  }, [screenWidth, theme.spacing.xs9]);

  // 키 추출
  const keyExtractor = (item: CategoryData) => item.id;

  // 카테고리 아이템 클릭 핸들러 (메모이제이션으로 안정적인 참조 유지)
  const handleItemPress = useCallback(
    (item: CategoryData) => {
      onCategoryPress(item);
    },
    [onCategoryPress]
  );

  // 아이템 렌더링 (메모이제이션으로 불필요한 재렌더링 방지)
  const renderItem = useCallback(
    ({ item, index }: { item: CategoryData; index: number }) => {
      // 마지막 행의 아이템들은 border를 표시하지 않음
      const totalItems = categories.length;
      const isLastRow = index >= totalItems - numColumns;

      return (
        <View style={{ width: itemWidth }}>
          <CategoryItem
            label={item.label}
            onPress={() => handleItemPress(item)}
            showBorder={!isLastRow}
          />
        </View>
      );
    },
    [categories.length, numColumns, itemWidth, handleItemPress]
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 2 ? styles.columnWrapper : undefined}
        scrollEnabled={false} // 외부 ScrollView에서 스크롤 처리
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

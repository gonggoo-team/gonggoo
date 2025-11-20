/**
 * ProductGrid Component
 *
 * 유연한 상품 그리드 레이아웃 컴포넌트입니다.
 * - 1열 (세로 리스트) 또는 2열 (그리드) 지원
 * - FlatList 기반 최적화
 * - 커스텀 렌더링 함수 지원
 * - 헤더 컴포넌트 지원
 *
 * 사용 예시:
 * ```tsx
 * <ProductGrid
 *   data={products}
 *   numColumns={2}
 *   renderItem={(item, index) => <ProductCardVertical {...item} />}
 *   ListHeaderComponent={<Header />}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';

import { useTheme, useResponsive } from '../../hooks';

import { createProductGridStyles } from './ProductGrid.styles';
import type { ProductGridProps } from './ProductGrid.types';

/**
 * ProductGrid Component
 */
export function ProductGrid<T>({
  data,
  numColumns = 2,
  renderItem,
  ListHeaderComponent,
  keyExtractor,
  style,
  contentContainerStyle,
}: ProductGridProps<T>) {
  const { theme } = useTheme();
  const { spacing } = useResponsive();
  const { width: screenWidth } = useWindowDimensions();
  const styles = createProductGridStyles(theme);

  // 반응형 간격 계산
  const gapSize = spacing(theme.spacing.xs9); // 9px → 9-10px
  const bottomMargin = spacing(theme.spacing.xs); // 8px → 8-9px

  // 2열 그리드 카드 너비 계산 (반응형 간격 적용)
  const cardWidth = useMemo(() => {
    if (numColumns === 2) {
      const containerPadding = 40; // columnWrapper paddingHorizontal (좌우 각 20px)
      const availableWidth = screenWidth - containerPadding;
      return (availableWidth - gapSize) / 2;
    }
    return undefined;
  }, [screenWidth, numColumns, gapSize]);

  // keyExtractor 기본값 설정
  const defaultKeyExtractor = useMemo(
    () =>
      keyExtractor ||
      ((item: T, index: number) => {
        // 'id' 속성이 있으면 사용, 없으면 인덱스 사용
        const itemWithId = item as { id?: string | number };
        return itemWithId?.id?.toString() || `item-${index}`;
      }),
    [keyExtractor]
  );

  // 2열 그리드인 경우 renderItem 래핑 (반응형 간격 적용)
  const wrappedRenderItem = useMemo(() => {
    if (numColumns === 2) {
      return ({ item, index }: { item: T; index: number }) => {
        const isLeftColumn = index % 2 === 0;
        return (
          <View
            style={{
              width: cardWidth,
              marginRight: isLeftColumn ? gapSize : 0, // 반응형: 9px → 9-10px
              marginBottom: bottomMargin, // 반응형: 8px → 8-9px
            }}
          >
            {renderItem(item, index)}
          </View>
        );
      };
    }

    // 1열인 경우 그대로 사용
    return ({ item, index }: { item: T; index: number }) => renderItem(item, index);
  }, [numColumns, renderItem, cardWidth, gapSize, bottomMargin]);

  // 성능 최적화: getItemLayout (고정 높이 아이템용)
  // ProductCardVertical 기준 약 250px (이미지 163 + 내용 ~87)
  const ITEM_HEIGHT = 258; // 카드 높이 + marginBottom
  const getItemLayout = useMemo(() => {
    if (numColumns === 2) {
      // 2열 그리드의 경우, 행 단위로 계산
      return (_: unknown, index: number) => {
        const rowIndex = Math.floor(index / 2);
        return {
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * rowIndex,
          index,
        };
      };
    }
    // 1열의 경우
    return (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    });
  }, [numColumns]);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        renderItem={wrappedRenderItem}
        keyExtractor={defaultKeyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={numColumns === 2 ? styles.columnWrapper : undefined}
        contentContainerStyle={
          contentContainerStyle ||
          (numColumns === 2 ? styles.listContent : styles.listContentSingle)
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        stickyHeaderIndices={[]}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={numColumns === 2 ? 10 : 5}
        windowSize={5}
        initialNumToRender={numColumns === 2 ? 10 : 5}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

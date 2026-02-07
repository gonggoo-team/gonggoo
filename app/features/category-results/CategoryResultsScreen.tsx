/**
 * Category Results Screen
 *
 * 카테고리별 상품 결과를 표시하는 화면입니다.
 * - 상단: 커스텀 헤더 (뒤로가기 + 카테고리명 + 장바구니)
 * - 정렬/필터 바
 * - 상품 리스트 (ProductCardVertical, 2열 그리드)
 * - 빈 결과 상태 처리
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1066-5809
 * 마지막 동기화: 2025-10-28
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFilterNavigation, useProductCardGrid, useProductList, useTabFilters, useTabSort } from '@/app/shared/hooks';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { getMockCategories } from '@/app/shared/services/mock';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { convertBadges, calculatePriceRange } from '@/app/shared/utils';
import { getDefaultFilters } from '@/app/shared/types/filter.types';
import { CONTENT_PADDING } from '@/app/shared/constants/layout';

import {
  DEFAULT_SORT_OPTIONS,
  Icon,
  ProductCardVertical,
  ScreenWrapper,
  SortFilterBar,
  useTheme
} from '@/design-system';

/**
 * CategoryResultsScreen Component
 */
export default function CategoryResultsScreen() {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();

  // 탭바 높이 + 여유 공간: Galaxy S8=80px, iPhone=114px
  const contentPaddingBottom = CONTENT_PADDING.getTabScreenPadding(insets.bottom);

  // 카테고리 정보 조회
  const categoryInfo = useMemo(() => {
    const categories = getMockCategories();
    return categories.find((cat) => cat.slug === params.category);
  }, [params.category]);

  // 상태 관리
  const [allProducts, setAllProducts] = useState<ProductCardVerticalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 공통 훅 사용
  const { selectedCategory, setSelectedCategory, filters, setFilters } = useTabFilters();
  const {
    selectedSort,
    isDropdownVisible,
    handleSortPress,
    handleSortSelect,
    handleDropdownClose,
    applySorting,
  } = useTabSort();

  // 상품 로드 시 동적 가격 범위 업데이트
  useEffect(() => {
    if (allProducts.length > 0) {
      const range = calculatePriceRange(allProducts);
      const newFilters = getDefaultFilters([range.min, range.max]);
      setFilters(newFilters);
    }
  }, [allProducts, setFilters]);

  // 카테고리별 상품 로드
  const loadCategoryProducts = useCallback(async (categorySlug: string) => {
    setIsLoading(true);

    try {
      // getAllProducts()에서 모든 상품 가져오기
      const { getAllProducts } = await import('@/app/shared/services/mock/products.mock');
      const allProductsList = getAllProducts();

      // 카테고리 정보로 category 필드 매핑
      const categories = getMockCategories();
      const targetCategory = categories.find((cat) => cat.slug === categorySlug);

      if (!targetCategory) {
        setAllProducts([]);
        return;
      }

      // 카테고리로 필터링 (slug → label 매핑)
      // Mock 데이터의 category 필드는 label 형태 (예: "식품", "생활")
      const filteredProducts: ProductCardVerticalData[] = allProductsList.filter(
        (product) => product.category === targetCategory.label
      );

      setAllProducts(filteredProducts);
    } catch (error) {
      console.error('[CategoryResultsScreen] 상품 로드 실패:', error);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 최종 상품 목록 (공통 필터 + 정렬)
  // useProductList 훅을 사용하여 동네/오늘 마감 탭과 동일한 필터 로직 적용
  const filteredProducts = useProductList(allProducts, selectedCategory, filters, applySorting);

  // 필터 네비게이션 훅
  const { handleFilterPress } = useFilterNavigation(filteredProducts, filters);

  // 초기 로드 (URL params로 진입 시 1회만)
  useEffect(() => {
    if (params.category) {
      loadCategoryProducts(params.category);
      setSelectedCategory('전체'); // 초기화
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category]);

  // 뒤로가기
  const handleGoBack = useCallback(() => {
    back();
  }, [back]);

  // 장바구니 클릭
  const handleCartPress = useCallback(() => {
    // TODO: 장바구니 화면으로 이동
  }, []);

  // 상품 클릭
  const handleProductPress = useCallback((id: string) => {
    push({ pathname: '/product/[id]', params: { id } });
  }, [push]);

  // 좋아요 클릭
  const handleLikePress = useCallback((id: string) => {
    // TODO: 좋아요 기능 구현
  }, []);

  // 2열 그리드 레이아웃 계산
  const { cardWidth, gap, rowGap } = useProductCardGrid();

  // 상품 카드 렌더링 (2열 그리드)
  const renderProduct = useCallback(
    ({ item, index }: { item: ProductCardVerticalData; index: number }) => {
      const isLeftColumn = index % 2 === 0;

      return (
        <View
          style={{
            width: cardWidth,
            marginRight: isLeftColumn ? gap : 0,
            marginBottom: rowGap,
          }}
        >
          <ProductCardVertical
            imageUri={item.imageUri}
            id={item.id}
            title={item.title}
            price={item.price}
            pricePerSlot={item.pricePerSlot}
            priceLabelValue={item.priceLabelValue}
            likes={item.likes ?? 0}
            progress={item.progress ?? 0}
            showProgress={item.showProgress}
            badges={convertBadges(item.badges)}
            onPress={() => handleProductPress(item.id)}
            onLikePress={() => handleLikePress(item.id)}
          />
        </View>
      );
    },
    [cardWidth, gap, rowGap, handleProductPress, handleLikePress]
  );

  // 정렬/필터 바 헤더 (Figma 디자인 기준: 추천순 + 필터, 총 개수 없음)
  const renderResultsHeader = useCallback(() => {
    if (isLoading) return null;

    return (
      <View style={{ backgroundColor: theme.colors.surface.normal.bg1 }}>
        <SortFilterBar
          sortOptions={DEFAULT_SORT_OPTIONS}
          selectedSort={selectedSort}
          onSortSelect={handleSortSelect}
          onSortPress={handleSortPress}
          onFilterPress={handleFilterPress}
          isDropdownVisible={isDropdownVisible}
          onDropdownClose={handleDropdownClose}
          // resultsCount는 전달하지 않음 (카테고리 결과에서는 표시하지 않음)
        />
      </View>
    );
  }, [
    isLoading,
    selectedSort,
    handleSortSelect,
    handleSortPress,
    handleFilterPress,
    isDropdownVisible,
    handleDropdownClose,
    theme,
  ]);

  // 빈 결과 렌더링
  const renderEmptyResults = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.surface.brand.primary}
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            {
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontSize: theme.typography.fontSize.md,
            },
          ]}
        >
          {categoryInfo?.label} 카테고리에 상품이 없습니다.
        </Text>
      </View>
    );
  }, [isLoading, categoryInfo, theme]);

  return (
    <ScreenWrapper
      preset='fullscreen'
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* 커스텀 헤더 (뒤로가기 + 카테고리명 + 장바구니) */}
      <View
        style={[
          styles.header,
          {
            // paddingTop: insets.top + theme.spacing.md, // Status bar + 16px
            paddingHorizontal: theme.spacing.lg, // 20px
            // paddingBottom: theme.spacing.xs, // 8px
            borderBottomWidth: theme.dimensions.borderWidth.thin, // 1px
            borderBottomColor: theme.colors.border.lowEmp, // Figma 기준
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
          >
            <Icon
              name="back"
              size={theme.dimensions.iconSize.md} // 24px
              color={theme.colors.surface.texticon.onnormal.icon.black}
            />
          </TouchableOpacity>

          {/* 카테고리명 */}
          <Text
            style={[
              styles.categoryTitle,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.md, // 16px
                fontWeight: theme.typography.fontWeight.semiBold, // 600
                letterSpacing: theme.typography.getLetterSpacing(16),
                color: theme.colors.surface.texticon.onnormal.text.black,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityRole="header"
          >
            {categoryInfo?.label || '카테고리'}
          </Text>

          {/* 장바구니 아이콘 */}
          <TouchableOpacity
            onPress={handleCartPress}
            style={styles.cartButton}
            accessibilityRole="button"
            accessibilityLabel="장바구니"
          >
            <Icon
              name="cart"
              size={theme.dimensions.iconSize.md} // 24px
              color={theme.colors.surface.texticon.onnormal.icon.black}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 콘텐츠 영역 - 2열 그리드 레이아웃 (성능 최적화 적용) */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderResultsHeader}
        ListEmptyComponent={renderEmptyResults}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: theme.spacing.lg, // 20px
            paddingTop: theme.spacing.xs, // 8px
            // paddingBottom: contentPaddingBottom, // 동적 계산: Galaxy S8=80px, iPhone=114px
          },
          filteredProducts.length === 0 && styles.emptyListContent,
        ]}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDropdownVisible}
        // 성능 최적화 props
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // 동적 패딩 설정
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  cartButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    // 동적 패딩 설정
  },
  columnWrapper: {
    // 2열 그리드 간격은 renderProduct 내부에서 처리
    justifyContent: 'flex-start',
  },
  emptyListContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    // 동적 스타일 설정
  },
});

/**
 * NeighborhoodContent Component (리팩토링됨)
 *
 * 동네 카테고리 탭의 콘텐츠 영역입니다.
 * - 공통 컴포넌트 사용: CategoryFilterBar, SortFilterBar, SectionHeader, ProductGrid
 * - 공통 훅 사용: useTabFilters, useTabSort, useProductList
 * - TabContentLayout 기반
 */

import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { useAuth, useFAB } from '@/app/shared/contexts';
import { TabContentLayout } from '@/app/shared/components/layouts';
import { useProductCardGrid, useProductList, useTabFilters, useTabSort, useFilterNavigation } from '@/app/shared/hooks';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { getAllProducts } from '@/app/shared/services/mock/products.mock';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { convertBadges, calculatePriceRange, formatNeighborhoodSubtitle, applyNeighborhoodFilter } from '@/app/shared/utils';
import { useNeighborhoodFilter } from '../hooks/useNeighborhoodFilter';

import {
  CategoryFilterBar,
  DEFAULT_CATEGORIES,
  DEFAULT_SORT_OPTIONS,
  ProductCardVertical,
  SectionHeader,
  SortFilterBar,
  useTheme,
} from '@/design-system';

export const NeighborhoodContent = forwardRef<FlatList>((props, ref) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { push } = useThrottledNavigation();

  // Mock 데이터 로드 - 동네 탭은 모든 상품 표시
  const allProductsRaw = getAllProducts();
  const allProducts: ProductCardVerticalData[] = useMemo(() => allProductsRaw.map((p) => ({
    id: p.id,
    imageUri: p.imageUri,
    title: p.title,
    price: p.price,
    pricePerSlot: p.pricePerSlot,
    priceLabelValue: p.priceLabelValue,
    badges: p.badges,
    isClosed: p.isClosed,
    likes: p.likes,
    progress: p.progress,
    showProgress: p.showProgress,
    category: p.category,
    createdAt: p.createdAt,
    discountRate: p.discountRate,
    isReservationAvailable: p.isReservationAvailable,
    slotCount: p.slotCount,
    recruitmentStatus: p.recruitmentStatus,
    targetGender: p.targetGender,
    targetAge: p.targetAge,
    address: p.address
  })), [allProductsRaw]);

  // 동네 필터링 훅
  const { neighborhoodInfo } = useNeighborhoodFilter();

  // 동네 기반 필터링 적용 (Mock 데이터이므로 동네명 기반)
  const neighborhoodProducts = useMemo(() => {
    if (!neighborhoodInfo || !user?.location) {
      if (__DEV__) console.log('[NeighborhoodContent] No location info, showing all products');
      return allProducts;
    }

    if (__DEV__) console.log('[NeighborhoodContent] Filtering by neighborhood:', {
      neighborhood: user.location.neighborhood,
      range: user.location.range,
      totalProducts: allProducts.length,
    });

    const filtered = applyNeighborhoodFilter(
      allProducts,
      user.location,
      false // Mock 데이터이므로 동네명 기반 필터링 사용
    );

    if (__DEV__) console.log('[NeighborhoodContent] Filtered products:', {
      count: filtered.length,
      samples: filtered.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        address: p.address,
      })),
    });

    return filtered;
  }, [allProducts, neighborhoodInfo, user?.location]);

  // 동적 가격 범위 계산
  const priceRange = useMemo(() => {
    const range = calculatePriceRange(neighborhoodProducts);
    return [range.min, range.max] as [number, number];
  }, [neighborhoodProducts]);

  // 공통 훅 사용
  const { selectedCategory, setSelectedCategory, filters } = useTabFilters('전체', priceRange);
  const {
    selectedSort,
    isDropdownVisible,
    handleSortPress,
    handleSortSelect,
    handleDropdownClose,
    applySorting,
  } = useTabSort();

  // FAB 가시성 제어 (드롭다운 열릴 때 숨김)
  const { hideFAB, showFAB } = useFAB();
  useEffect(() => {
    if (isDropdownVisible) {
      hideFAB();
    } else {
      showFAB();
    }
  }, [isDropdownVisible, hideFAB, showFAB]);

  // 최종 상품 목록 (동네 필터링 + 카테고리 필터링 + 정렬)
  const products = useProductList(neighborhoodProducts, selectedCategory, filters, applySorting);

  // 필터 네비게이션 훅
  const { handleFilterPress } = useFilterNavigation(products, filters);

  // 이벤트 핸들러 (useCallback으로 메모이제이션)
  const handleProductPress = useCallback((id: string) => {
    push(`/product/${id}`);
  }, [push]);

  const handleLikePress = useCallback((id: string) => {
    if (__DEV__) {
      console.log('Like pressed:', id);
    }
  }, []);

  // 2열 그리드 레이아웃 계산
  const { cardWidth, gap, rowGap } = useProductCardGrid();

  // 상품 카드 렌더링 (useCallback으로 메모이제이션)
  const renderProductCard = useCallback(({ item, index }: { item: ProductCardVerticalData; index: number }) => {
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
  }, [cardWidth, gap, rowGap, handleProductPress, handleLikePress]);

  // 고정 헤더: 카테고리 + 정렬/필터 (배경색 포함, 스크롤해도 고정)
  const fixedHeader = useMemo(
    () => (
      <View style={{ backgroundColor: theme.colors.surface.normal.bg1 }}>
        <CategoryFilterBar
          categories={DEFAULT_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <SortFilterBar
          sortOptions={DEFAULT_SORT_OPTIONS}
          selectedSort={selectedSort}
          onSortSelect={handleSortSelect}
          onSortPress={handleSortPress}
          onFilterPress={handleFilterPress}
          isDropdownVisible={isDropdownVisible}
          onDropdownClose={handleDropdownClose}
        />
      </View>
    ),
    [
      selectedCategory,
      selectedSort,
      isDropdownVisible,
      handleSortPress,
      handleSortSelect,
      handleDropdownClose,
      theme,
    ]
  );

  // 일반 헤더: 제목/부제목 (자연스럽게 스크롤)
  const header = useMemo(
    () => (
      <SectionHeader
        title="우리 동네에서 모집 중!"
        subtitle={formatNeighborhoodSubtitle(user?.location?.address)}
      />
    ),
    [user?.location?.address]
  );

  return (
    <TabContentLayout
      ref={ref}
      fixedHeader={fixedHeader}
      header={header}
      data={products}
      renderItem={renderProductCard}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={!isDropdownVisible}
    />
  );
});

NeighborhoodContent.displayName = 'NeighborhoodContent';

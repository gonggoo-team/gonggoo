/**
 * TodayContent Component (리팩토링됨)
 *
 * 오늘 마감 카테고리 탭의 콘텐츠 영역입니다.
 * - 공통 컴포넌트 사용: CategoryFilterBar, SortFilterBar, SectionHeader, ProductGrid
 * - 공통 훅 사용: useTabFilters, useTabSort, useProductList
 * - TabContentLayout 기반
 * - 고유 기능: CountdownTimer
 */

import { TabContentLayout } from '@/app/shared/components/layouts';
import { useFAB } from '@/app/shared/contexts';
import { useProductList, useTabFilters, useTabSort, useFilterNavigation } from '@/app/shared/hooks';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { getMockDeadlineProducts } from '@/app/shared/services/mock';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { convertBadges, calculatePriceRange } from '@/app/shared/utils';
import {
  CategoryFilterBar,
  CountdownTimer,
  DEFAULT_CATEGORIES,
  DEFAULT_SORT_OPTIONS,
  ProductCardLarge,
  SectionHeader,
  SortFilterBar,
  useTheme,
} from '@/design-system';
import React, { forwardRef, useCallback, useEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export const TodayContent = forwardRef<FlatList>((props, ref) => {
  const { theme } = useTheme();
  const { push } = useThrottledNavigation();

  // Mock 데이터 로드
  const allProducts: ProductCardVerticalData[] = useMemo(() => getMockDeadlineProducts(), []);

  // 동적 가격 범위 계산
  const priceRange = useMemo(() => {
    const range = calculatePriceRange(allProducts);
    return [range.min, range.max] as [number, number];
  }, [allProducts]);

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

  // 최종 상품 목록 (필터링 + 정렬)
  const products = useProductList(allProducts, selectedCategory, filters, applySorting);

  // 필터 네비게이션 훅
  const { handleFilterPress } = useFilterNavigation(products, filters);

  // 타이머 타겟 시간 (오늘 자정)
  const getTargetTime = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight;
  };

  // 이벤트 핸들러 (useCallback으로 메모이제이션)
  const handleProductPress = useCallback((id: string) => {
    push(`/product/${id}`);
  }, [push]);

  const handleLikePress = useCallback((id: string) => {
    if (__DEV__) {
      console.log('Like pressed:', id);
    }
  }, []);

  const handleExpire = useCallback(() => {
    if (__DEV__) {
      console.log('마감되었습니다!');
    }
  }, []);

  // 상품 카드 렌더링 (1열, ProductCardLarge, useCallback으로 메모이제이션)
  const renderProductCard = useCallback(({ item }: { item: ProductCardVerticalData }) => (
    <View style={{ marginBottom: 22, paddingHorizontal: 20 }}>
      <ProductCardLarge
        imageUri={item.imageUri}
        title={item.title}
        id={item.id}
        price={item.price}
        pricePerSlot={item.pricePerSlot}
        likes={item.likes || 0}
        slotsRemaining={1}
        participantsCount={3}
        badges={convertBadges(item.badges)}
        onPress={() => handleProductPress(item.id)}
        onLikePress={() => handleLikePress(item.id)}
      />
    </View>
  ), [handleProductPress, handleLikePress]);

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

  // 일반 헤더: 제목/부제목 + 타이머 (자연스럽게 스크롤)
  const header = useMemo(
    () => (
      <>
        <SectionHeader title="오늘 마감" subtitle="오늘 마감되는 핫한 공구를 놓치지 마세요!" />
        {/* CountdownTimer - 텍스트/아이콘 빨간색 */}
        <View style={styles.timerContainer}>
          <CountdownTimer
            targetTime={getTargetTime()}
            onExpire={handleExpire}
            textColor={theme.colors.surface.env.accent}
            iconColor={theme.colors.surface.env.accent}
          />
        </View>
      </>
    ),
    [theme]
  );

  return (
    <TabContentLayout
      ref={ref}
      fixedHeader={fixedHeader}
      header={header}
      data={products}
      renderItem={renderProductCard}
      keyExtractor={(item) => item.id}
      numColumns={1}
      contentContainerStyle={styles.listContent}
      scrollEnabled={!isDropdownVisible}
    />
  );
});

TodayContent.displayName = 'TodayContent';

const styles = StyleSheet.create({
  timerContainer: {},
  listContent: {
    paddingBottom: 20,
  },
});

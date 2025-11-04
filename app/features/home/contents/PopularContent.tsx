/**
 * PopularContent Component (리팩토링됨)
 *
 * 인기 카테고리 탭의 콘텐츠 영역입니다.
 * - 공통 컴포넌트 사용: CategoryFilterBar, PopularFilterBar, SectionHeader, ProductGrid
 * - 공통 훅 사용: useTabFilters (카테고리만)
 * - TabContentLayout 기반
 * - 고유 기능: 성별/연령/기간 필터, 랭킹 배지, FilterBottomSheet
 */

import React, { forwardRef, useCallback, useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getMockPopularProductsVertical } from '@/app/shared/services/mock/products.mock';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { convertBadges } from '@/app/shared/utils';
import {
  CategoryFilterBar,
  DEFAULT_CATEGORIES,
  ProductCardVertical,
  PopularFilterBar,
  SectionHeader,
  useTheme,
} from '@/design-system';
import { FilterBottomSheet } from '@/design-system/components/FilterBottomSheet';
import { TabContentLayout } from '@/app/shared/components/layouts';
import { useTabFilters, useProductCardGrid } from '@/app/shared/hooks';
import { useRouter } from 'expo-router';

export const PopularContent = forwardRef<FlatList>((props, ref) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { push } = useThrottledNavigation();

  // 공통 훅 사용 (카테고리 필터만)
  const { selectedCategory, setSelectedCategory } = useTabFilters();

  // 인기 탭 전용 필터 상태
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'gender' | 'age' | 'period'>('gender');
  const [selectedFilters, setSelectedFilters] = useState({
    gender: '성별 전체',
    age: '연령대 전체',
    period: '실시간 랭킹',
  });

  // Mock 데이터 로드 - 인기 상품 (좋아요 50개 이상, 좋아요 순 정렬)
  const allProducts: ProductCardVerticalData[] = useMemo(() => getMockPopularProductsVertical(), []);

  // 필터링 및 정렬을 useMemo로 최적화
  const products = useMemo(() => {
    // 카테고리 필터 적용
    let filtered = selectedCategory === '전체'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);

    // 성별 필터 적용
    if (selectedFilters.gender !== '성별 전체') {
      filtered = filtered.filter(
        (product) => product.targetGender === selectedFilters.gender || product.targetGender === '성별 전체'
      );
    }

    // 연령대 필터 적용
    if (selectedFilters.age !== '연령대 전체') {
      filtered = filtered.filter(
        (product) => product.targetAge === selectedFilters.age || product.targetAge === '연령대 전체'
      );
    }

    // 기간별 정렬 (실시간 랭킹 vs 주간 랭킹 vs 월간 랭킹)
    return [...filtered].sort((a, b) => {
      if (selectedFilters.period === '실시간 랭킹') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      } else if (selectedFilters.period === '주간 랭킹') {
        return (b.likes || 0) - (a.likes || 0);
      } else if (selectedFilters.period === '월간 랭킹') {
        return (b.progress || 0) - (a.progress || 0);
      }
      return 0;
    });
  }, [allProducts, selectedCategory, selectedFilters.gender, selectedFilters.age, selectedFilters.period]);

  // 이벤트 핸들러 (useCallback으로 메모이제이션)
  const handleProductPress = useCallback((id: string) => {
    push(`/product/${id}`);
  }, [push]);

  const handleLikePress = useCallback((id: string) => {
    console.log('Like pressed:', id);
  }, []);

  const handleSelectOption = useCallback((filterType: 'gender' | 'age' | 'period', option: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: option,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSelectedFilters({
      gender: '성별 전체',
      age: '연령대 전체',
      period: '실시간 랭킹',
    });
  }, []);

  const handleApply = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  // 2열 그리드 레이아웃 계산
  const { cardWidth, gap, rowGap } = useProductCardGrid();

  // 상품 카드 렌더링 (랭킹 배지 포함, useCallback으로 메모이제이션)
  const renderProductCard = useCallback(({ item, index }: { item: ProductCardVerticalData; index: number }) => {
    const ranking = index + 1;
    const isLeftColumn = index % 2 === 0;

    return (
      <View
        style={{
          position: 'relative',
          width: cardWidth,
          marginRight: isLeftColumn ? gap : 0,
          marginBottom: rowGap,
        }}
      >
        {/* 랭킹 배지 */}
        <View style={styles.rankingBadge}>
          <Text style={styles.rankingText}>{ranking}</Text>
        </View>
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

  // 카테고리 필터 (배경색 포함)
  const fixedHeader = useMemo(
    () => (
      <View style={{ backgroundColor: theme.colors.surface.normal.bg1 }}>
        <CategoryFilterBar
          categories={DEFAULT_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>
    ),
    [selectedCategory, theme]
  );

  // 인기 필터 (배경색 포함)
  const collapsibleHeader = useMemo(
    () => (
      <View style={{ backgroundColor: theme.colors.surface.normal.bg1 }}>
        <PopularFilterBar
          onGenderPress={() => {
            setActiveTab('gender');
            setIsFilterVisible(true);
          }}
          onAgePress={() => {
            setActiveTab('age');
            setIsFilterVisible(true);
          }}
          onPeriodPress={() => {
            setActiveTab('period');
            setIsFilterVisible(true);
          }}
        />
      </View>
    ),
    [theme]
  );

  // 일반 헤더: 제목/부제목 (자연스럽게 스크롤)
  const header = useMemo(
    () => (
      <SectionHeader title="가장 인기 있는!" subtitle="가장 인기 있는 공구를 만나보세요!" />
    ),
    []
  );

  return (
    <>
      <TabContentLayout
        ref={ref}
        fixedHeader={fixedHeader}
        collapsibleHeader={collapsibleHeader}
        header={header}
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />

      {/* 필터 바텀시트 */}
      <FilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedFilters={selectedFilters}
        onSelectOption={handleSelectOption}
        onReset={handleReset}
        onApply={handleApply}
        resultCount={products.length}
      />
    </>
  );
});

PopularContent.displayName = 'PopularContent';

const styles = StyleSheet.create({
  rankingBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: 30,
    height: 30,
    backgroundColor: '#181A1A',
    borderTopLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

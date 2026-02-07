/**
 * Search Results Screen
 *
 * 검색 결과를 표시하는 화면입니다.
 * - 상단: 검색바 (읽기 전용, 재검색 가능)
 * - 검색 결과 개수 표시
 * - 상품 리스트 (ProductCardHorizontal 재사용)
 * - 빈 결과 상태 처리
 *
 * UI/UX 참고: 쿠팡, 네이버 쇼핑, 당근마켓 등의 검색 결과 화면
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFilterNavigation, useProductCardGrid, useProductList, useTabFilters, useTabSort } from '@/app/shared/hooks';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { SearchService } from '@/app/shared/services/searchService';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { convertBadges, calculatePriceRange } from '@/app/shared/utils';
import { getDefaultFilters } from '@/app/shared/types/filter.types';

import {
  DEFAULT_SORT_OPTIONS,
  Icon,
  ProductCardVertical,
  SearchBar,
  SortFilterBar,
  useTheme
} from '@/design-system';

import { EmptySearchResults } from './components';

/**
 * SearchResultsScreen Component
 */
export default function SearchResultsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { push, back } = useThrottledNavigation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string }>();

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState(params.q || '');
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

  // 검색 실행
  const performSearch = useCallback(async (query: string, addToRecent: boolean = true) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSelectedCategory('전체'); // 검색 시 카테고리 초기화

    // 최근 검색어에 추가 (중복 제거 로직은 SearchService 내부에서 처리)
    if (addToRecent) {
      await SearchService.addRecentSearch(query);
    }

    try {
      const results = await SearchService.searchProducts(query);
      setAllProducts(results);
    } catch (error) {
      console.error('[SearchResultsScreen] 검색 실패:', error);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [setSelectedCategory]);

  // 최종 상품 목록 (카테고리 필터링 + 공통 필터 + 정렬)
  // useProductList 훅을 사용하여 동네/오늘 마감 탭과 동일한 필터 로직 적용
  const filteredProducts = useProductList(allProducts, selectedCategory, filters, applySorting);

  // 필터 네비게이션 훅
  const { handleFilterPress } = useFilterNavigation(filteredProducts, filters);

  // 사용 가능한 카테고리 목록 추출
  const availableCategories = React.useMemo((): string[] => {
    const categories = new Set(
      allProducts.map((p) => p.category).filter((c): c is string => Boolean(c))
    );
    return ['전체', ...Array.from(categories).sort()];
  }, [allProducts]);

  // 초기 검색 실행 (URL params로 진입 시 1회만)
  // SearchScreen에서 이미 최근 검색어에 추가했으므로 addToRecent=false로 설정
  useEffect(() => {
    if (params.q) {
      performSearch(params.q, false);
    }
    // searchQuery 의존성 제거: 사용자가 입력할 때마다 자동 검색 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q]);

  // 검색 제출 핸들러 (재검색)
  const handleSearchSubmit = useCallback(async () => {
    if (searchQuery.trim()) {
      // performSearch 내부에서 최근 검색어에 추가하므로 중복 호출 제거
      performSearch(searchQuery);
      // URL 업데이트
      router.setParams({ q: searchQuery });
    }
  }, [searchQuery, performSearch, router]);

  // 뒤로가기
  const handleGoBack = useCallback(() => {
    back();
  }, [back]);

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

  // 정렬/필터 바 헤더 (Figma 디자인 기준: 추천순 + 필터 + 총 개수)
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
          resultsCount={filteredProducts.length}
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
    filteredProducts.length,
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

    return <EmptySearchResults query={searchQuery} />;
  }, [isLoading, searchQuery, theme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,       
        }}/>
      {/* 헤더 (검색바) */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xs,
            borderBottomWidth: theme.dimensions.borderWidth.thin,
            borderBottomColor: theme.colors.surface.normal.bg2, // Figma 기준
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
              size={theme.dimensions.iconSize.md}
              color={theme.colors.surface.texticon.onnormal.icon.black}
            />
          </TouchableOpacity>

          {/* 검색바 */}
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearchSubmit}
              placeholder="검색어를 입력해주세요."
            />
          </View>
        </View>
      </View>

      {/* 콘텐츠 영역 - 2열 그리드 레이아웃 */}
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
            paddingBottom: theme.spacing.xxl, // 32px
          },
          filteredProducts.length === 0 && styles.emptyListContent,
        ]}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDropdownVisible}
        // FlatList 성능 최적화 설정
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />
    </View>
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
    gap: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
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
});

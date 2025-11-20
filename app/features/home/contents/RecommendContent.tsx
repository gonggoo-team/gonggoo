/**
 * RecommendContent Component (리팩토링됨)
 *
 * 추천 카테고리 탭의 콘텐츠 영역입니다.
 * - 공통 컴포넌트 사용: CategoryFilterBar, SectionHeader
 * - 고유 레이아웃: 가로 스크롤 페이지, 3열 그리드, AdBanner
 * - RecommendContent는 구조가 독특하여 일부만 공통화
 */

import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { getMockHorizontalBanner, getMockMainBanners } from '@/app/shared/services/mock';
import { getMockRecommendedProducts } from '@/app/shared/services/mock/products.mock';
import type { AdBannerItem, ProductCardVerticalData } from '@/app/shared/types/product.types';
import { convertBadges } from '@/app/shared/utils';
import {
  AgeFilterBar,
  ProductCardCompact,
  ProductCardVertical,
  ScrollIndicator,
  SectionHeader,
  useTheme
} from '@/design-system';
import React, { useCallback, useState, useMemo } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { AdBannerSection } from '../sections';

export const RecommendContent: React.FC = () => {
  const { theme } = useTheme();
  const { push } = useThrottledNavigation();
  const { width: screenWidth } = useWindowDimensions();
  const [currentPage1, setCurrentPage1] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('전체');

  // 3열 그리드 동적 카드 너비 계산 (Figma 기준)
  const horizontalPadding = 40; // 20px × 2
  const availableWidth = screenWidth - horizontalPadding;
  const gap = 9; // Figma 기준 카드 간격
  const cardWidth = Math.floor((availableWidth - gap * 2) / 3);

  // Mock 데이터 로드 - useMemo로 최적화
  const products: ProductCardVerticalData[] = useMemo(() => getMockRecommendedProducts(), []);
  const bannerData: AdBannerItem[] = useMemo(() => getMockMainBanners(), []);
  const horizontalBanners: AdBannerItem[] = useMemo(() => getMockHorizontalBanner(), []);

  // 연령대별 필터링 - useMemo로 최적화
  const filteredProducts = useMemo(() =>
    selectedAgeGroup === '전체'
      ? products
      : products.filter((product) => {
          // TODO: product.ageGroup === selectedAgeGroup 로 필터링
          // 현재는 Mock 데이터에 ageGroup 필드가 없으므로 전체 표시
          return true;
        }),
    [selectedAgeGroup, products]
  );

  const handleProductPress = useCallback((id: string) => {
    push(`/product/${id}`);
  }, [push]);

  const handleBannerPress = useCallback((item: unknown) => {
    if (__DEV__) {
      console.log('Banner pressed:', item);
    }
  }, []);

  const handleScroll1 = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollX / screenWidth);
    setCurrentPage1(page);
  }, [screenWidth]);

  const handleScroll2 = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollX / screenWidth);
    setCurrentPage2(page);
  }, [screenWidth]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 광고 배너 (전체 너비, 375x289 비율) */}
        {/* <View style={styles.adBannerContainer}>
          <AdBanner
            items={bannerData}
            onBannerPress={handleBannerPress}
            autoPlay={true}
            autoPlayInterval={3000}
            fullWidth={true}
            aspectRatio={375 / 289}
          />
        </View> */}

      {/* 가로 광고 배너 (82px, 전체 너비) */}
      <View style={{paddingTop: theme.spacing.lg}}>
        <AdBannerSection
          banners={horizontalBanners}
          onBannerPress={handleBannerPress}
          autoPlay={false}
        />
      </View>
      
      {/* 00님을 위한 추천 섹션 */}
      <View style={styles.section}>
        <SectionHeader
          title="00님 을 위한 추천 공구"
          subtitle=""
        />

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll1}
          scrollEventThrottle={16}
        >
          {/* 3개씩 페이지로 나눔 */}
          {Array.from({ length: Math.ceil(products.length / 3) }).map((_, pageIndex) => (
            <View key={`page1-${pageIndex}`} style={{ width: screenWidth, paddingHorizontal: 20 }}>
              {products.slice(pageIndex * 3, (pageIndex + 1) * 3).map((product) => (
                <View key={product.id} style={{ marginBottom: 16 }}>
                  <ProductCardCompact
                    id={product.id}
                    imageUri={product.imageUri}
                    title={product.title}
                    price={product.price}
                    pricePerSlot={product.pricePerSlot}
                    badges={convertBadges(product.badges)}
                    isClosed={product.isClosed}
                    onPress={() => handleProductPress(product.id)}
                  />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        <ScrollIndicator totalPages={Math.ceil(products.length / 3)} currentIndex={currentPage1} currentPage={currentPage1} />
      </View>

      {/* 연령대별 추천 공구 섹션 */}
      <View style={styles.section}>
        <SectionHeader title="연령대별 추천 공구" />

        {/* 연령대 필터 */}
        <View>
          <AgeFilterBar
            ageGroups={['전체', '10대', '20대', '30대', '40대', '50대', '60대 이상']}
            selectedAgeGroup={selectedAgeGroup}
            onSelect={setSelectedAgeGroup}
          />
        </View>

        {/* 6개 그리드 (3열 × 2행) - 가로 스크롤 */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll2}
          scrollEventThrottle={16}
        >
          {/* 6개씩 페이지로 나눔 (3 columns × 2 rows) */}
          {Array.from({ length: Math.ceil(filteredProducts.length / 6) }).map((_, pageIndex) => (
            <View key={`page2-${pageIndex}`} style={{ width: screenWidth, paddingHorizontal: 20 }}>
              <View style={styles.gridContainer}>
                {filteredProducts.slice(pageIndex * 6, (pageIndex + 1) * 6).map((product, index) => {
                  const rowIndex = Math.floor(index / 3);
                  return (
                    <View
                      key={product.id}
                      style={{
                        width: cardWidth,
                        marginBottom: rowIndex === 0 ? gap : 0, // 첫 번째 행만 아래 간격
                      }}
                    >
                      <ProductCardVertical
                        imageUri={product.imageUri}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        pricePerSlot={product.pricePerSlot}
                        priceLabelValue={product.priceLabelValue}
                        likes={product.likes ?? 0}
                        // progress={product.progress ?? 0}
                        // showProgress={product.showProgress}
                        badges={convertBadges(product.badges)}
                        onPress={() => handleProductPress(product.id)}
                        onLikePress={() => handleProductPress(product.id)}
                        width={cardWidth}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <ScrollIndicator
          totalPages={Math.ceil(filteredProducts.length / 6)}
          currentIndex={currentPage2}
          currentPage={currentPage2}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adBannerContainer: {
    paddingTop: 20
  },
  section: {
    marginBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 카드 간 간격 균등 배분
    gap: 9, // Figma 기준: 9px 간격
  },
});

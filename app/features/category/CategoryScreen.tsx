/**
 * Category Screen
 *
 * 카테고리 선택 화면입니다.
 * - GNB: "카테고리" 제목
 * - 카테고리 그리드 (2열 × 4행)
 * - 광고 배너
 * - 추천 상품 섹션
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=796-11940
 * 마지막 동기화: 2025-10-27
 */

import { getMockCategories, getMockRecommendedProducts } from '@/app/shared/services/mock';
import { getMockHorizontalBanner } from '@/app/shared/services/mock/banners.mock';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import type { CategoryData } from '@/app/shared/types';
import { GNB, ThemeProvider, useTheme } from '@/design-system';
import { AdBannerSection } from '@/app/features/home/sections';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CategoryGridSection } from './components';
import { RecommendationSection } from './sections';

/**
 * CategoryScreen Component with ThemeProvider
 */
export default function CategoryScreen() {
  return (
    <ThemeProvider>
      <CategoryScreenContent />
    </ThemeProvider>
  );
}

/**
 * CategoryScreenContent Component (ThemeProvider 내부)
 */
function CategoryScreenContent() {
  const { theme } = useTheme();
  const router = useRouter();
  const { push } = useThrottledNavigation();

  // Mock 데이터 로드
  const categories = useMemo(() => getMockCategories(), []);
  const horizontalBanners = useMemo(() => getMockHorizontalBanner(), []);
  const recommendedProducts = useMemo(() => getMockRecommendedProducts(), []);

  // 카테고리 선택 핸들러
  const handleCategoryPress = (category: CategoryData) => {
    console.log('Category selected:', category);
    // 카테고리 결과 화면으로 이동
    push(`/category-results?category=${category.slug}`);
  };

  // 상품 클릭 핸들러
  const handleProductPress = (id: string) => {
    push(`/product/${id}`);
  };

  // 배너 클릭 핸들러
  const handleBannerPress = (item: any) => {
    console.log('Banner pressed:', item);
    // TODO: 배너 링크 처리
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      {/* GNB */}
      <GNB
        leftSection={{ type: 'logo-text', text: '카테고리' }}
      />

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 카테고리 그리드 */}
        <CategoryGridSection
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />

        {/* 구분선 (6px 회색 배경) */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: theme.colors.surface.normal.bg2, // #F5F5F5
              height: 6,
            },
          ]}
        />

        {/* 가로 광고 배너 (82px, 전체 너비) */}
        <View style={{ paddingTop: theme.spacing.xl }}>
          <AdBannerSection
            banners={horizontalBanners}
            onBannerPress={handleBannerPress}
            autoPlay={false}
          />
        </View>

        {/* 추천 상품 섹션 */}
        <View style={{ paddingTop: theme.spacing.xl }}>
          <RecommendationSection
            products={recommendedProducts}
            onProductPress={handleProductPress}
            userName="만댱"
          />
        </View>

        {/* 하단 여백 */}
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  divider: {
    width: '100%',
  },
});

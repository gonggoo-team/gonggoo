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

import React, { useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useAuth } from '@/app/shared/contexts';
import { getMockCategories, getMockRecommendedProducts } from '@/app/shared/services/mock';
import { getMockHorizontalBanner } from '@/app/shared/services/mock/banners.mock';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { getNicknameDisplay } from '@/app/shared/utils';
import type { CategoryData } from '@/app/shared/types';

import { GNB, ScreenWrapper, useTheme } from '@/design-system';

import { AdBannerSection } from '@/app/features/home/sections';
import { CategoryGridSection } from './components';
import { RecommendationSection } from './sections';

/**
 * CategoryScreen Component
 */
export default function CategoryScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { push } = useThrottledNavigation();

  // 사용자 닉네임 (없으면 "00" 표시)
  const userName = getNicknameDisplay(user?.nickname, '00');

  // Mock 데이터 로드
  const categories = useMemo(() => getMockCategories(), []);
  const horizontalBanners = useMemo(() => getMockHorizontalBanner(), []);
  const recommendedProducts = useMemo(() => getMockRecommendedProducts(), []);

  // 카테고리 선택 핸들러 (useCallback으로 안정적인 참조 유지)
  const handleCategoryPress = useCallback((category: CategoryData) => {
    // 카테고리 결과 화면으로 이동
    push(`/category-results?category=${category.slug}`);
  }, [push]);

  // 상품 클릭 핸들러 (useCallback으로 안정적인 참조 유지)
  const handleProductPress = useCallback((id: string) => {
    push(`/product/${id}`);
  }, [push]);

  // 배너 클릭 핸들러 (useCallback으로 안정적인 참조 유지)
  const handleBannerPress = useCallback((item: unknown) => {
    // TODO: 배너 링크 처리
  }, []);

  return (
    <ScreenWrapper preset="default" style={styles.container}>
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
              backgroundColor: theme.colors.surface.normal.bg2,
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
            userName={userName}
          />
        </View>

        {/* 하단 여백 */}
        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </ScreenWrapper>
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

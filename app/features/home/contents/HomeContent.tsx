/**
 * HomeContent Component
 *
 * 홈 탭의 콘텐츠 영역입니다.
 * - 메인 광고 배너
 * - 우리 동네에서 모집중 섹션
 * - 오늘마감 섹션
 * - 가장 인기 있는! 섹션
 * - 광고 배너
 * - 추천 공구팟 섹션
 */

import React, { useMemo, useCallback } from 'react';
import { ScrollView } from 'react-native';

import { useAuth } from '@/app/shared/contexts';
import {
  getMockDeadlineProducts,
  getMockMainBanners,
  getMockPopularProducts,
} from '@/app/shared/services/mock';
import { getMockHorizontalBanner } from '@/app/shared/services/mock/banners.mock';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { getNicknameDisplay } from '@/app/shared/utils';

import { AdBanner, useTheme } from '@/design-system';

import {
  AdBannerSection,
  DeadlineSection,
  NeighborhoodSection,
  PopularSection,
  RecommendedSection,
} from '../sections';

interface HomeContentProps {
  onNavigateToCategory: (category: string) => void;
}

export const HomeContent = React.memo<HomeContentProps>(({ onNavigateToCategory }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { push } = useThrottledNavigation();

  // 사용자 닉네임 (없으면 "00" 표시)
  const userName = getNicknameDisplay(user?.nickname, '00');

  // Mock 데이터 로드 - useMemo로 최적화
  const bannerData = useMemo(() => getMockMainBanners(), []);
  const horizontalBanners = useMemo(() => getMockHorizontalBanner(), []);
  const deadlineProducts = useMemo(() => getMockDeadlineProducts(), []);
  const popularProducts = useMemo(() => getMockPopularProducts(), []);

  // 이벤트 핸들러 - useCallback으로 최적화
  const handleBannerPress = useCallback((item: unknown) => {
    // Banner press handled
  }, []);

  const handleProductPress = useCallback((id: string) => {
    console.log(`/product/${id}`)
    push(`/product/${id}`);
  }, [push]);

  const handleLikePress = useCallback((id: string) => {
    if (__DEV__) {
      console.log('Like pressed:', id);
    }
  }, []);

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 60, paddingTop: theme.spacing.lg }}
    >
      {/* 메인 광고 배너 (전체 너비, 375x289 비율) */}
      <AdBanner
        items={bannerData}
        onBannerPress={handleBannerPress}
        autoPlay={true}
        autoPlayInterval={3000}
        fullWidth={true}
        aspectRatio={375 / 289}
      />

      {/* 우리 동네에서 모집중 섹션 */}
      <NeighborhoodSection
        products={deadlineProducts}
        onViewAll={() => onNavigateToCategory('neighborhood')}
        onProductPress={handleProductPress}
        onLikePress={handleLikePress}
      />

      {/* 오늘마감 섹션 */}
      <DeadlineSection
        products={deadlineProducts}
        targetTime={new Date(Date.now() + 5 * 60 * 60 * 1000 + 14 * 60 * 1000 + 35 * 1000)}
        onViewAll={() => onNavigateToCategory('today')}
        onProductPress={handleProductPress}
        onLikePress={handleLikePress}
        onExpire={() => {
          if (__DEV__) {
            console.log('마감되었습니다!');
          }
        }}
      />

      {/* 가장 인기 있는! 섹션 */}
      <PopularSection
        products={popularProducts}
        onViewAll={() => onNavigateToCategory('popular')}
        onProductPress={handleProductPress}
      />

      {/* 가로 광고 배너 (82px, 전체 너비) */}
      <AdBannerSection
        banners={horizontalBanners}
        onBannerPress={handleBannerPress}
        autoPlay={false}
      />

      {/* 00님을 위한 추천 공구팟 섹션 */}
      <RecommendedSection
        products={deadlineProducts}
        userName={userName}
        onViewAll={() => onNavigateToCategory('recommend')}
        onProductPress={handleProductPress}
        onLikePress={handleLikePress}
      />
    </ScrollView>
  );
});

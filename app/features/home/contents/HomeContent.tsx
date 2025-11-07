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

import {
  getMockDeadlineProducts,
  getMockMainBanners,
  getMockPopularProducts,
} from '@/app/shared/services/mock';
import { getMockHorizontalBanner } from '@/app/shared/services/mock/banners.mock';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { AdBanner, useTheme } from '@/design-system';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
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

export const HomeContent: React.FC<HomeContentProps> = ({ onNavigateToCategory }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { push } = useThrottledNavigation();

  // Mock 데이터 로드
  const bannerData = getMockMainBanners();
  const horizontalBanners = getMockHorizontalBanner();
  const deadlineProducts = getMockDeadlineProducts();
  const popularProducts = getMockPopularProducts();

  // 이벤트 핸들러
  const handleBannerPress = (item: any) => {
    console.log('Banner pressed:', item);
  };

  const handleProductPress = (id: string) => {
    push(`/product/${id}`);
  };

  const handleLikePress = (id: string) => {
    console.log('Like pressed:', id);
  };

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
        onExpire={() => console.log('마감되었습니다!')}
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
        onViewAll={() => onNavigateToCategory('recommend')}
        onProductPress={handleProductPress}
        onLikePress={handleLikePress}
      />
    </ScrollView>
  );
};

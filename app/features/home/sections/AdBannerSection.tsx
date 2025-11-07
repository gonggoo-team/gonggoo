/**
 * Ad Banner Section Component
 *
 * 가로 광고 배너 섹션 (82px 높이, 전체 너비)
 * 재사용 가능한 컴포넌트로 홈화면, 추천탭, 카테고리 화면에서 사용
 */

import React from 'react';
import { AdBanner } from '@/design-system';
import type { AdBannerItem } from '@/design-system/components/AdBanner/AdBanner.types';

export interface AdBannerSectionProps {
  /** 배너 데이터 배열 */
  banners: AdBannerItem[];
  /** 배너 클릭 핸들러 */
  onBannerPress?: (item: AdBannerItem) => void;
  /** 자동 재생 여부 (기본값: false) */
  autoPlay?: boolean;
}

export const AdBannerSection: React.FC<AdBannerSectionProps> = ({
  banners,
  onBannerPress,
  autoPlay = false,
}) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <AdBanner
      items={banners}
      onBannerPress={onBannerPress}
      autoPlay={autoPlay}
      autoPlayInterval={3000}
      fullWidth={true}
      height={82}
    />
  );
};

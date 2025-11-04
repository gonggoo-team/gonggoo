/**
 * Mock Banner Data
 *
 * 광고 배너 테스트 데이터
 * 추후 백엔드 API로 교체 예정
 */

import type { AdBannerItem } from '@/app/shared/types/product.types';

/**
 * 메인 광고 배너 데이터 (375x375)
 */
export const getMockMainBanners = (): AdBannerItem[] => [
  {
    id: '1',
    imageUri: 'https://gonggoo-product.netlify.app/adbanner.png',
    link: '/promotion/1',
  },
  {
    id: '2',
    imageUri: 'https://gonggoo-product.netlify.app/adhorizon.jpg',
    link: '/promotion/2',
  },
];

/**
 * 가로 광고 배너 데이터 (82px 높이)
 * adhorizon.jpg 이미지를 사용하는 가로형 배너
 */
export const getMockHorizontalBanner = (): AdBannerItem[] => [
  {
    id: '2',
    imageUri: 'https://gonggoo-product.netlify.app/adhorizon.jpg',
    link: '/promotion/2',
  },
];

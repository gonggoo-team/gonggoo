/**
 * Profile Products Mock Data
 *
 * 프로필 관련 화면용 Mock 데이터
 */

import type { SwipeableProductItem } from '@/app/shared/components';
import type { ProfileStatusType } from '@/app/features/profile-product-list/types';

/**
 * 상태별 Mock 데이터 가져오기
 */
export function getMockProfileProducts(statusType: ProfileStatusType): SwipeableProductItem[] {
  const baseProducts: SwipeableProductItem[] = [
    {
      id: '31',
      imageUri: 'https://gonggoo-product.netlify.app/product-10.png',
      title: '남성용 패션 정장 중목 무지 양말 100세트 5명 공구 모집해요',
      price: 75000,
      pricePerSlot: 15000,
      buyersCount: 4,
      progress: 80,
      badges: [{ type: 'recruiting', label: '모집 중' }],
    },
    {
      id: '32',
      imageUri: 'https://gonggoo-product.netlify.app/product-20.png',
      title: '한우 1++ 등급 선물세트 5kg 명절용 가족 모임용',
      price: 250000,
      pricePerSlot: 25000,
      buyersCount: 8,
      progress: 80,
      badges: [{ type: 'recruiting', label: '모집 중' }],
    },
    {
      id: '33',
      imageUri: 'https://gonggoo-product.netlify.app/product-30.png',
      title: '베베숲 아기 물티슈 100매 20팩 대용량',
      price: 35000,
      pricePerSlot: 3500,
      buyersCount: 9,
      progress: 90,
      badges: [{ type: 'recruiting', label: '모집 중' }],
    },
  ];

  return baseProducts;
}

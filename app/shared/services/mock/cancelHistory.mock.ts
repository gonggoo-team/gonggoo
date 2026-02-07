/**
 * Cancel History Mock Data
 *
 * 취소 내역 화면용 Mock 데이터입니다.
 */

import type { SwipeableProductItem } from '@/app/shared/components';

/**
 * 취소 내역 Mock 데이터
 */
export const MOCK_CANCEL_HISTORY: SwipeableProductItem[] = [
  {
    id: '34',
    imageUri: 'https://gonggoo-product.netlify.app/product-10.png',
    title: '아이폰 15 Pro 256GB 티타늄 블루 공동구매',
    price: 1490000,
    pricePerSlot: 149000,
    buyersCount: 0,
    progress: 0,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
    refundStatus: 'refunding',
  },
  {
    id: '36',
    imageUri: 'https://gonggoo-product.netlify.app/product-20.png',
    title: '한우 1++ 등급 선물세트 5kg 명절용',
    price: 250000,
    pricePerSlot: 25000,
    buyersCount: 0,
    progress: 0,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
    refundStatus: 'refunding',
  },
  {
    id: '38',
    imageUri: 'https://gonggoo-product.netlify.app/product-30.png',
    title: '베베숲 아기 물티슈 100매 20팩 대용량',
    price: 35000,
    pricePerSlot: 3500,
    buyersCount: 0,
    progress: 0,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
    refundStatus: 'refunded',
  },
  {
    id: '40',
    imageUri: 'https://gonggoo-product.netlify.app/product-40.png',
    title: '다이슨 무선청소기 V15 Detect Absolute',
    price: 890000,
    pricePerSlot: 89000,
    buyersCount: 0,
    progress: 0,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
    refundStatus: 'refunded',
  },
  {
    id: '42',
    imageUri: 'https://gonggoo-product.netlify.app/product-50.png',
    title: '제주 한라봉 프리미엄 5kg 박스',
    price: 45000,
    pricePerSlot: 4500,
    buyersCount: 0,
    progress: 0,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
    refundStatus: 'refunded',
  },
];

/**
 * 전체 취소 내역 데이터 조회
 */
export function getMockCancelHistory(): SwipeableProductItem[] {
  return MOCK_CANCEL_HISTORY;
}

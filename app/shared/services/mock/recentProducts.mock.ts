/**
 * Recent Products Mock Data
 *
 * 최근 본 상품 화면용 Mock 데이터입니다.
 */

import type { SwipeableProductItem } from '@/app/shared/components';

/**
 * 최근 본 상품 Mock 데이터
 * - 실제 앱에서는 AsyncStorage의 ID 목록과 API 데이터를 결합하여 사용
 * - 개발/테스트용으로 미리 정의된 데이터 제공
 */
export const MOCK_RECENT_PRODUCTS: SwipeableProductItem[] = [
  {
    id: '1',
    imageUri: 'https://gonggoo-product.netlify.app/product-47.png',
    title: '남성용 패션 정장 중목 무지 양말 100세트 5명 공구 모집해요',
    price: 75000,
    pricePerSlot: 15000,
    buyersCount: 45,
    progress: 66,
    badges: [
      { type: 'remaining', label: '3일 남음' },
      { type: 'recruiting', label: '5슬롯 모집 중' },
    ],
    completed: false,
  },
  {
    id: '2',
    imageUri: 'https://gonggoo-product.netlify.app/product-2.png',
    title: '삼성 갤럭시 버즈2 프로 최신형 블루투스 이어폰',
    price: 189000,
    pricePerSlot: 18900,
    buyersCount: 70,
    progress: 100,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
  },
  {
    id: '3',
    imageUri: 'https://gonggoo-product.netlify.app/product-3.png',
    title: 'LG 트롬 건조기 인기 모델 공동구매',
    price: 850000,
    pricePerSlot: 85000,
    buyersCount: 50,
    progress: 100,
    badges: [
      { type: 'closed', label: '모집 마감' },
    ],
    completed: true,
  },
  {
    id: '4',
    imageUri: 'https://gonggoo-product.netlify.app/product-4.png',
    title: '제주 감귤 10kg 산지 직송 신선한 과일',
    price: 45000,
    pricePerSlot: 4500,
    buyersCount: 85,
    progress: 85,
    badges: [
      { type: 'remaining', label: '1일 남음' },
      { type: 'recruiting', label: '15슬롯 모집 중' },
    ],
    completed: false,
  },
  {
    id: '5',
    imageUri: 'https://gonggoo-product.netlify.app/product-5.png',
    title: '다이슨 V15 무선청소기 최신형 2024년 모델',
    price: 890000,
    pricePerSlot: 89000,
    buyersCount: 30,
    progress: 60,
    badges: [
      { type: 'remaining', label: '5일 남음' },
      { type: 'recruiting', label: '10슬롯 모집 중' },
    ],
    completed: false,
  },
];

/**
 * 상품 ID 목록으로 최근 본 상품 데이터 조회
 * 실제 구현에서는 API 호출과 결합하여 사용
 */
export function getMockRecentProductsByIds(ids: string[]): SwipeableProductItem[] {
  return ids
    .map((id) => MOCK_RECENT_PRODUCTS.find((product) => product.id === id))
    .filter((product): product is SwipeableProductItem => product !== undefined);
}

/**
 * 전체 최근 본 상품 데이터 조회
 */
export function getMockRecentProducts(): SwipeableProductItem[] {
  return MOCK_RECENT_PRODUCTS;
}

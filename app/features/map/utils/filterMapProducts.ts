/**
 * 지도 필터링 유틸리티
 * MapScreen의 필터링 로직을 순수 함수로 분리
 */

import type { ProductCardVerticalData } from '@/app/shared/types/product.types';

/**
 * Viewport bounds 타입
 */
export interface ViewportBounds {
  northEast: { latitude: number; longitude: number };
  southWest: { latitude: number; longitude: number };
}

/**
 * 지도 필터링 파라미터
 */
export interface MapFilterParams {
  allProducts: ProductCardVerticalData[];
  selectedMarkerId?: string | null;
  viewportBounds: ViewportBounds;
  searchQuery: string;
  showLikedOnly: boolean;
  likedProductIds: string[] | Set<string>; // 🔥 Set도 허용
  activeTab: number;
  selectedCategory: string;
  userId?: string;
}

/**
 * 상품이 viewport bounds 내에 있는지 확인
 */
const isWithinViewportBounds = (
  product: ProductCardVerticalData,
  bounds: ViewportBounds
): boolean => {
  if (!product.latitude || !product.longitude) {
    return false;
  }

  const lat = product.latitude;
  const lng = product.longitude;

  return (
    lat <= bounds.northEast.latitude &&
    lat >= bounds.southWest.latitude &&
    lng <= bounds.northEast.longitude &&
    lng >= bounds.southWest.longitude
  );
};

/**
 * 6단계 지도 필터링 (Viewport-first 방식)
 *
 * 1️⃣ Viewport 필터: 화면에 보이는 영역만
 * 2️⃣ 검색어 필터: 제목에 검색어 포함
 * 3️⃣ 찜 필터: 찜한 상품만
 * 4️⃣ 탭 필터: 모집 중 / 개최 중
 * 5️⃣ 카테고리 필터: 선택된 카테고리만
 *
 * 🔥 Note: selectedMarkerId는 여기서 처리하지 않음
 * - 지도에는 모든 마커 표시 (선택된 마커만 detailed, 나머지는 simple)
 * - BottomSheet에만 선택된 상품 표시 (ProductBottomSheet 내부에서 처리)
 *
 * @param params 필터링 파라미터
 * @returns 필터링된 상품 배열
 */
export const applyMapFilters = (params: MapFilterParams): ProductCardVerticalData[] => {
  const {
    allProducts,
    viewportBounds,
    searchQuery,
    showLikedOnly,
    likedProductIds,
    activeTab,
    selectedCategory,
    userId,
  } = params;

  let result = allProducts;

  // 1️⃣ Viewport 필터링 (성능 최적화의 핵심)
  // 화면에 보이는 영역의 상품만 필터링
  result = result.filter((product) => isWithinViewportBounds(product, viewportBounds));

  // 2️⃣ 검색어 필터링
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((product) => product.title.toLowerCase().includes(query));
  }

  // 3️⃣ 찜한 상품만 보기
  // 🔥 최적화: Set 사용 시 O(1) 검색, 배열일 때는 O(n) includes
  if (showLikedOnly) {
    if (likedProductIds instanceof Set) {
      result = result.filter((product) => likedProductIds.has(product.id));
    } else {
      result = result.filter((product) => likedProductIds.includes(product.id));
    }
  }

  // 4️⃣ 탭 필터링
  if (activeTab === 0) {
    // 동네 모집 중: 모집 중 + 마감 임박
    result = result.filter(
      (product) =>
        product.recruitmentStatus === '모집 중' || product.recruitmentStatus === '마감 임박'
    );
  } else {
    // 개최 중: 현재 사용자가 개최한 공구
    result = result.filter((product) => product.hostId === userId);
  }

  // 5️⃣ 카테고리 필터링 (동네 모집 중 탭에서만)
  if (activeTab === 0 && selectedCategory !== '전체') {
    result = result.filter((product) => product.category === selectedCategory);
  }

  return result;
};

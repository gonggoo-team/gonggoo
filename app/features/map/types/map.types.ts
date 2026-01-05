/**
 * Map Feature Types
 *
 * 지도 화면 관련 타입 정의
 */

import type { ProductCardVerticalData } from '@/app/shared/types/product.types';

/**
 * 지도 마커 타입
 */
export type MarkerType =
  | 'my-location'
  | 'product'
  | 'product-recruiting'  // 모집중 (녹색)
  | 'product-closed'      // 모집마감 (회색)
  | 'product-closing-soon' // 마감임박 (빨간색)
  | 'liked-product';       // 찜한 공구 (하트)

/**
 * 지도 마커 데이터
 */
export interface MapMarker {
  id: string;
  type: MarkerType;
  latitude: number;
  longitude: number;
  /** 상품 정보 (가격 표시용, 선택 사항) */
  product?: {
    pricePerSlot: number;
    title?: string;
    progress?: number;
  };
  /** 선택 여부 (기본: false) */
  isSelected?: boolean;
  /** 마커 클릭 핸들러 */
  onPress?: () => void;
}

/**
 * 지도 상태
 */
export interface MapState {
  /** 중심 좌표 */
  center: {
    latitude: number;
    longitude: number;
  };
  /** 줌 레벨 (기본: 15) */
  zoom: number;
  /** 동네 범위 (km) */
  range: number;
}

/**
 * BottomSheet 상태
 */
export type BottomSheetState = 'collapsed' | 'partial' | 'expanded';

/**
 * 지도 필터 옵션
 */
export interface MapFilterOptions {
  /** 찜한 상품만 표시 */
  showLikedOnly: boolean;
  /** 카테고리 필터 */
  category?: string;
}

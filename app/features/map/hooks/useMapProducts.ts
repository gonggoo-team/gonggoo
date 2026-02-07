/**
 * useMapProducts Hook
 *
 * 지도 화면에서 주변 공구상품을 가져오는 hook
 */

import { useMemo } from 'react';
import { useProductContext } from '@/app/shared/contexts/ProductContext';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import type { MapMarker } from '../types';

interface UseMapProductsOptions {
  /** 중심 좌표 */
  centerLat: number;
  centerLng: number;
  /** 반경 (km) */
  radius: number;
  /** 찜한 상품만 표시 */
  showLikedOnly?: boolean;
  /** viewport 모드 사용 여부 */
  useViewportMode?: boolean;
  /** viewport bounds (viewport 모드에서만 사용) */
  bounds?: {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  };
}

interface UseMapProductsReturn {
  /** 지도에 표시할 상품 리스트 */
  products: ProductCardVerticalData[];
  /** 지도 마커 데이터 */
  markers: MapMarker[];
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 두 좌표 간 거리 계산 (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const useMapProducts = ({
  centerLat,
  centerLng,
  radius,
  showLikedOnly = false,
  useViewportMode = false,
  bounds,
}: UseMapProductsOptions): UseMapProductsReturn => {
  const { products: allProducts, likedProductIds } = useProductContext();
  const isLoading = false;

  /**
   * 반경 또는 viewport bounds 내의 상품 필터링
   */
  const filteredProducts = useMemo(() => {
    const result = allProducts.filter((product) => {
      // 위치 정보가 없는 상품 제외
      if (!product.latitude || !product.longitude) {
        return false;
      }

      // 찜한 상품만 표시 옵션
      if (showLikedOnly && !likedProductIds.includes(product.id)) {
        return false;
      }

      // viewport 모드: bounds 내에 있는지 확인
      if (useViewportMode && bounds) {
        const inBounds =
          product.latitude <= bounds.northEast.latitude &&
          product.latitude >= bounds.southWest.latitude &&
          product.longitude <= bounds.northEast.longitude &&
          product.longitude >= bounds.southWest.longitude;
        return inBounds;
      }

      // 반경 모드: 중심점으로부터 일정 반경 내에 있는지 확인
      const distance = calculateDistance(
        centerLat,
        centerLng,
        product.latitude,
        product.longitude
      );

      return distance <= radius;
    });

    if (__DEV__) console.log('[useMapProducts] 상품 필터링 결과:', {
      mode: useViewportMode ? 'viewport' : 'range',
      totalProducts: allProducts.length,
      filteredProducts: result.length,
      bounds: useViewportMode ? bounds : undefined,
      center: !useViewportMode ? { lat: centerLat, lng: centerLng, radius } : undefined,
    });

    return result;
  }, [allProducts, centerLat, centerLng, radius, showLikedOnly, likedProductIds, useViewportMode, bounds]);

  /**
   * 마커 데이터 생성 (내 위치 마커는 MapScreen에서 직접 추가)
   */
  const markers = useMemo(() => {
    const productMarkers: MapMarker[] = filteredProducts.map((product) => {
      // 찜한 상품은 하트 아이콘
      if (likedProductIds.includes(product.id)) {
        return {
          id: product.id,
          type: 'liked-product' as const,
          latitude: product.latitude!,
          longitude: product.longitude!,
          product: {
            pricePerSlot: product.pricePerSlot,
            title: product.title,
            progress: product.progress,
          },
        };
      }

      // 상품 상태에 따라 마커 타입 결정
      let markerType: 'product-recruiting' | 'product-closed' | 'product-closing-soon' = 'product-recruiting';

      if (product.recruitmentStatus === '모집 완료' || product.recruitmentStatus === '거래 완료') {
        markerType = 'product-closed';
      } else if (product.recruitmentStatus === '마감 임박') {
        markerType = 'product-closing-soon';
      }
      // '모집 중'은 기본값 'product-recruiting'

      return {
        id: product.id,
        type: markerType,
        latitude: product.latitude!,
        longitude: product.longitude!,
        product: {
          pricePerSlot: product.pricePerSlot,
          title: product.title,
          progress: product.progress,
        },
      };
    });

    // 마커 타입 분포 로그 (디버깅용)
    const markerTypeCounts = productMarkers.reduce((acc, marker) => {
      acc[marker.type] = (acc[marker.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (__DEV__) console.log('[useMapProducts] 마커 타입 분포:', markerTypeCounts);

    return productMarkers;
  }, [filteredProducts, likedProductIds]);

  return {
    products: filteredProducts,
    markers,
    isLoading,
  };
};

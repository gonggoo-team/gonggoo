/**
 * useFilterNavigation Hook
 *
 * 필터 화면으로 이동하는 로직을 재사용 가능한 훅으로 분리합니다.
 * - 가격 범위 계산
 * - 필터 화면으로 라우팅
 */

import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useThrottledNavigation } from './useThrottledNavigation';
import type { CommonFilters } from '../types/filter.types';

/**
 * 가격 범위를 가진 상품 타입
 */
interface ProductWithPrice {
  id: string;
  pricePerSlot: number;
}

/**
 * useFilterNavigation Hook
 *
 * 필터 화면으로 이동하는 핸들러를 제공합니다.
 *
 * @param products - 필터링된 상품 목록
 * @param filters - 현재 적용된 필터
 * @returns handleFilterPress - 필터 버튼 클릭 핸들러
 *
 * @example
 * ```typescript
 * const { handleFilterPress } = useFilterNavigation(filteredProducts, filters);
 *
 * <SortFilterBar
 *   onFilterPress={handleFilterPress}
 *   // ... other props
 * />
 * ```
 */
export const useFilterNavigation = <T extends ProductWithPrice>(
  products: T[],
  filters: CommonFilters
) => {
  const router = useRouter();
  const { push } = useThrottledNavigation();

  const handleFilterPress = useCallback(() => {
    // 가격 범위 계산
    const prices = products.map((p) => p.pricePerSlot);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 100;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;

    push({
      pathname: '/filter',
      params: {
        filters: JSON.stringify(filters),
        resultCount: products.length.toString(),
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        productIds: JSON.stringify(products.map((p) => p.id)), // 필터링 대상 상품 ID 배열
      },
    });
  }, [products, filters, push]);

  return { handleFilterPress };
};

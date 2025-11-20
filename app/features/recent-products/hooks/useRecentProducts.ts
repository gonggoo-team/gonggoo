/**
 * useRecentProducts Hook
 *
 * 최근 본 상품 데이터를 관리하는 hook입니다.
 * AsyncStorage와 Mock 데이터를 결합하여 사용합니다.
 */

import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { SwipeableProductItem } from '@/app/shared/components';
import {
  getRecentProductIds,
  removeRecentProductId,
  clearRecentProducts,
} from '@/app/shared/services/storage';
import { getMockRecentProducts } from '@/app/shared/services/mock';

export function useRecentProducts() {
  const [products, setProducts] = useState<SwipeableProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * 최근 본 상품 데이터 로드
   */
  const loadRecentProducts = useCallback(async () => {
    try {
      // AsyncStorage에서 최근 본 상품 ID 목록 조회
      const recentIds = await getRecentProductIds();

      // Mock 데이터에서 해당 ID의 상품 조회
      const allProducts = getMockRecentProducts();
      const filteredProducts = recentIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter((product): product is SwipeableProductItem => product !== undefined);

      setProducts(filteredProducts);
    } catch (error) {
      console.error('[RecentProducts] Failed to load recent products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadRecentProducts();
  }, [loadRecentProducts]);

  /**
   * 새로고침
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecentProducts();
    setRefreshing(false);
  }, [loadRecentProducts]);

  /**
   * 상품 삭제
   */
  const handleDeleteProduct = useCallback(
    async (item: SwipeableProductItem) => {
      try {
        // AsyncStorage에서 ID 제거
        await removeRecentProductId(item.id);

        // UI에서 제거 (애니메이션을 위해 즉시 반영)
        setProducts((prev) => prev.filter((product) => product.id !== item.id));
      } catch (error) {
        console.error('[RecentProducts] Failed to delete product:', error);
        Alert.alert('오류', '상품을 삭제하는 중 오류가 발생했습니다.');
      }
    },
    []
  );

  /**
   * 전체 삭제 (실제 삭제 로직만 담당, 모달은 Screen에서 처리)
   */
  const handleClearAll = useCallback(async () => {
    try {
      await clearRecentProducts();
      setProducts([]);
    } catch (error) {
      console.error('[RecentProducts] Failed to clear products:', error);
      Alert.alert('오류', '전체 삭제 중 오류가 발생했습니다.');
    }
  }, []);

  return {
    products,
    loading,
    refreshing,
    handleRefresh,
    handleDeleteProduct,
    handleClearAll,
  };
}

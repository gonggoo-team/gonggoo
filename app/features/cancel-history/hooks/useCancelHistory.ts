/**
 * useCancelHistory Hook
 *
 * 취소 내역 데이터를 관리하는 hook입니다.
 */

import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { SwipeableProductItem } from '@/app/shared/components';
import { getMockCancelHistory } from '@/app/shared/services/mock';

export function useCancelHistory() {
  const [products, setProducts] = useState<SwipeableProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * 취소 내역 데이터 로드
   */
  const loadCancelHistory = useCallback(async () => {
    try {
      // Mock 데이터 로드
      // 실제 앱에서는 API 호출로 대체
      const data = getMockCancelHistory();
      setProducts(data);
    } catch (error) {
      console.error('[CancelHistory] Failed to load cancel history:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadCancelHistory();
  }, [loadCancelHistory]);

  /**
   * 새로고침
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCancelHistory();
    setRefreshing(false);
  }, [loadCancelHistory]);

  /**
   * 상품 삭제 (메모리에서만)
   */
  const handleDeleteProduct = useCallback(
    async (item: SwipeableProductItem) => {
      try {
        // UI에서 제거 (메모리에서만, 실제로는 API 호출 필요)
        setProducts((prev) => prev.filter((product) => product.id !== item.id));
      } catch (error) {
        console.error('[CancelHistory] Failed to delete product:', error);
        Alert.alert('오류', '항목을 삭제하는 중 오류가 발생했습니다.');
      }
    },
    []
  );

  return {
    products,
    loading,
    refreshing,
    handleRefresh,
    handleDeleteProduct,
  };
}

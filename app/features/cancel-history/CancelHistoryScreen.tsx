/**
 * CancelHistoryScreen
 *
 * 취소 내역 화면입니다.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GNB, useTheme } from '@/design-system';
import { SwipeableProductList, EmptyState } from '@/app/shared/components';
import type { SwipeableProductSection } from '@/app/shared/components';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { useCancelHistory } from './hooks';

export default function CancelHistoryScreen() {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();
  const {
    products,
    loading,
    refreshing,
    handleRefresh,
    handleDeleteProduct,
  } = useCancelHistory();

  /**
   * 상품 클릭 - 상품 상세 화면으로 이동
   */
  const handleProductPress = (item: { id: string }) => {
    push(`/product/${item.id}`);
  };

  /**
   * 빈 상태 컴포넌트
   */
  const renderEmptyState = () => (
    <EmptyState
      message="취소 내역이 없습니다"
      description="취소한 공구가 여기에 표시됩니다"
    />
  );

  /**
   * 취소 내역을 섹션으로 변환
   * - 환불 중: refundStatus === 'refunding'
   * - 환불 완료: refundStatus === 'refunded'
   */
  const sections = useMemo<SwipeableProductSection[]>(() => {
    const refundingItems = products.filter((item) => item.refundStatus === 'refunding');
    const refundedItems = products.filter((item) => item.refundStatus === 'refunded');

    const result: SwipeableProductSection[] = [];

    if (refundingItems.length > 0) {
      result.push({
        title: '환불 중',
        data: refundingItems,
      });
    }

    if (refundedItems.length > 0) {
      result.push({
        title: '환불 완료',
        data: refundedItems,
      });
    }

    return result;
  }, [products]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
      edges={['bottom']}
    >
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: '취소 내역',
          onPress: back,
        }}
      />

      {/* 로딩 상태 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
        </View>
      ) : (
        /* 상품 리스트 (섹션으로 구분) */
        <SwipeableProductList
          sections={sections}
          onItemPress={handleProductPress}
          onDeleteItem={handleDeleteProduct}
          centerTextVertically={true}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

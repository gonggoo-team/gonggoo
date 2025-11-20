/**
 * RecentProductsScreen
 *
 * 최근 본 상품 화면입니다.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GNB, useTheme } from '@/design-system';
import { SwipeableProductList, EmptyState, ConfirmationModal } from '@/app/shared/components';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { useRecentProducts } from './hooks';

export default function RecentProductsScreen() {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();
  const {
    products,
    loading,
    refreshing,
    handleRefresh,
    handleDeleteProduct,
    handleClearAll: clearAllProducts,
  } = useRecentProducts();

  // ConfirmationModal 상태 관리
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);

  /**
   * 전체 삭제 버튼 클릭 핸들러 (모달 표시)
   */
  const handleClearAllClick = useCallback(() => {
    setClearAllModalVisible(true);
  }, []);

  /**
   * 전체 삭제 확인 핸들러 (실제 삭제 실행)
   */
  const handleClearAllConfirm = useCallback(async () => {
    await clearAllProducts();
    setClearAllModalVisible(false);
  }, [clearAllProducts]);

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
      message="최근 본 상품이 없습니다"
      description="상품을 둘러보고 마음에 드는 공구를 찾아보세요"
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
      edges={['bottom']}
    >
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: '최근 본 상품',
          onPress: back,
        }}
        rightTextButton={{
          type: 'text-button',
          text: '전체 삭제',
          variant: 'secondary',
          onPress: handleClearAllClick,
          disabled: products.length === 0,
        }}
      />

      {/* 로딩 상태 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
        </View>
      ) : (
        /* 상품 리스트 */
        <SwipeableProductList
          data={products}
          onItemPress={handleProductPress}
          onDeleteItem={handleDeleteProduct}
          centerTextVertically={true}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* 전체 삭제 확인 모달 */}
      <ConfirmationModal
        visible={clearAllModalVisible}
        title="전체 삭제하시겠어요?"
        descriptions={['최근 본 상품을 모두 삭제하시겠습니까?', '삭제한 항목은 복구할 수 없어요.']}
        cancelText="취소"
        confirmText="삭제"
        confirmColor={theme.colors.surface.env.accent}
        onCancel={() => setClearAllModalVisible(false)}
        onConfirm={handleClearAllConfirm}
      />
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

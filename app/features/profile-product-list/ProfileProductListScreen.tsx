/**
 * ProfileProductListScreen
 *
 * 프로필 관련 상품 리스트 화면 (재사용 가능)
 * 모집 중, 모집 완료, 공구 완료, 찜 목록, 참여 완료, 거래 완료 화면에서 사용
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GNB, useTheme } from '@/design-system';
import {
  SwipeableProductList,
  EmptyState,
  ConfirmationModal,
} from '@/app/shared/components';
import { useThrottledNavigation } from '@/app/shared/hooks';
import type { SwipeableProductItem } from '@/app/shared/components';
import { ScreenHeader } from './components';
import type { ProfileScreenConfig, ConfirmationModalConfig } from './types';
import { getMockProfileProducts } from '@/app/shared/services/mock/profileProducts.mock';

export interface ProfileProductListScreenProps {
  /** 화면 설정 */
  config: ProfileScreenConfig;
}

export default function ProfileProductListScreen({ config }: ProfileProductListScreenProps) {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();

  // 상태 관리
  const [products, setProducts] = useState<SwipeableProductItem[]>(() =>
    getMockProfileProducts(config.statusType)
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 확인 모달 상태
  const [modalConfig, setModalConfig] = useState<ConfirmationModalConfig>({
    visible: false,
    title: '',
    descriptions: [],
    cancelText: '취소',
    confirmText: '확인',
    confirmColor: theme.colors.surface.brand.primary,
    onCancel: () => {},
    onConfirm: () => {},
  });

  /**
   * 상품 클릭 - 상품 상세 화면으로 이동
   */
  const handleProductPress = useCallback(
    (item: SwipeableProductItem) => {
      push(`/product/${item.id}`);
    },
    [push]
  );

  /**
   * 새로고침 핸들러
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Mock: 실제로는 API 호출
    setTimeout(() => {
      setProducts(getMockProfileProducts(config.statusType));
      setRefreshing(false);
    }, 1000);
  }, [config.statusType]);

  /**
   * 전체 삭제 핸들러
   */
  const handleClearAll = useCallback(() => {
    if (products.length === 0) return;

    setModalConfig({
      visible: true,
      title: '전체 삭제하시겠어요?',
      descriptions: ['삭제한 항목은 복구할 수 없습니다.'],
      cancelText: '취소',
      confirmText: '삭제',
      confirmColor: theme.colors.surface.env.accent,
      onCancel: () => setModalConfig((prev) => ({ ...prev, visible: false })),
      onConfirm: () => {
        setProducts([]);
        setModalConfig((prev) => ({ ...prev, visible: false }));
        Alert.alert('삭제 완료', '모든 항목이 삭제되었습니다.');
      },
    });
  }, [products.length, theme]);

  /**
   * 빈 상태 컴포넌트
   */
  const renderEmptyState = useMemo(
    () => (
      <EmptyState
        message={config.emptyState.message}
        description={config.emptyState.description}
      />
    ),
    [config.emptyState]
  );

  /**
   * 우측 버튼 클릭 핸들러
   */
  const handleRightButtonPress = useCallback(() => {
    if (config.rightButton?.onPress) {
      config.rightButton.onPress();
    } else {
      // 기본 동작: 전체 삭제
      handleClearAll();
    }
  }, [config.rightButton, handleClearAll]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
      edges={['bottom']}
    >
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: config.screenTitle,
          onPress: back,
        }}
        rightTextButton={
          config.rightButton
            ? {
                type: 'text-button',
                text: config.rightButton.text,
                variant: config.rightButton.variant,
                onPress: handleRightButtonPress,
                disabled: products.length === 0,
              }
            : undefined
        }
      />

      {/* 화면 상단 헤더 (선택적) */}
      <ScreenHeader title={config.headerTitle} subtitle={config.headerSubtitle} />

      {/* 로딩 상태 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
        </View>
      ) : (
        /* 상품 리스트 */
        <SwipeableProductList
          data={products}
          swipeActions={config.swipeActions}
          onItemPress={handleProductPress}
          variant="profile"
          showDivider={false}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* 확인 모달 */}
      <ConfirmationModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        descriptions={modalConfig.descriptions}
        cancelText={modalConfig.cancelText}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        onCancel={modalConfig.onCancel}
        onConfirm={modalConfig.onConfirm}
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

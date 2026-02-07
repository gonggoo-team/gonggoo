/**
 * PriceMarker Component
 *
 * 가격 정보를 표시하는 마커 컴포넌트 (당근마켓 스타일)
 * - 1인 가격 표시
 * - 상태별 배경색 (녹색/회색/빨간색)
 * - 선택 시 강조 효과 (테두리 굵게 + 크기 확대)
 * - 그림자 효과
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MarkerType } from '../MapView.types';

interface PriceMarkerProps {
  /** 1인 가격 */
  price: number;
  /** 마커 타입 (상태별 색상) */
  type?: MarkerType;
  /** 선택 여부 (기본: false) */
  isSelected?: boolean;
}

/**
 * 가격 포맷팅 (천 단위 콤마)
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR');
};

/**
 * 타입별 배경색 반환
 */
const getBackgroundColor = (type?: MarkerType): string => {
  switch (type) {
    case 'product-recruiting':
      return '#006242'; // 녹색 (모집중)
    case 'product-closed':
      return '#9FA7B1'; // 회색 (모집마감)
    case 'product-closing-soon':
      return '#F7514D'; // 빨간색 (마감임박)
    case 'product':
    default:
      return '#006242'; // 기본 녹색
  }
};

/**
 * PriceMarker Component
 */
export const PriceMarker: React.FC<PriceMarkerProps> = ({
  price,
  type = 'product-recruiting',
  isSelected = false,
}) => {
  const backgroundColor = getBackgroundColor(type);

  return (
    <View
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        { backgroundColor },
      ]}
    >
      <Text style={styles.priceText}>₩{formatPrice(price)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    // 그림자 효과
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // 최소 크기 보장
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSelected: {
    // 선택 시 강조 효과
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.15 }],
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
    color: '#FFFFFF',
    letterSpacing: -0.325,
  },
});

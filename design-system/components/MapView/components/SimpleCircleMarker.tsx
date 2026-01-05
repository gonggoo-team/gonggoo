/**
 * SimpleCircleMarker Component
 *
 * 줌 아웃 상태에서 사용하는 단순 원형 마커
 * - 동그란 원 모양
 * - 상태별 배경색 (녹색/회색/빨간색)
 * - 선택 시 강조 효과
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { MarkerType } from '../MapView.types';

interface SimpleCircleMarkerProps {
  /** 마커 타입 (상태별 색상) */
  type?: MarkerType;
  /** 선택 여부 (기본: false) */
  isSelected?: boolean;
  /** 찜한 상품 여부 (기본: false) */
  isLiked?: boolean;
}

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
 * SimpleCircleMarker Component
 */
export const SimpleCircleMarker: React.FC<SimpleCircleMarkerProps> = ({
  type = 'product-recruiting',
  isSelected = false,
  isLiked = false,
}) => {
  const backgroundColor = getBackgroundColor(type);

  return (
    <View style={[styles.container, isSelected && styles.containerSelected]}>
      {/* 외부 원 - 흰색 배경 + 선택 시 테두리 강조 */}
      <View
        style={[
          styles.outerCircle,
          isSelected && styles.outerCircleSelected,
        ]}
      />
      {/* 내부 원 - 상태별 색상 (크기 항상 동일) */}
      <View style={[styles.innerCircle, { backgroundColor }]} />
      {/* 중앙 점 - 흰색 (위치 표시, 항상 표시) */}
      <View style={styles.centerDot} />

      {/* 🔥 찜한 상품 하트 뱃지 (우측 상단 오버레이) */}
      {isLiked && (
        <View style={styles.heartBadge}>
          <Svg width={10} height={10} viewBox="0 0 10 10">
            <Path
              d="M5 9.5L4.4 8.95C2.05 6.825 0.5 5.45 0.5 3.75C0.5 2.375 1.525 1.35 2.9 1.35C3.67 1.35 4.41 1.7 5 2.27C5.59 1.7 6.33 1.35 7.1 1.35C8.475 1.35 9.5 2.375 9.5 3.75C9.5 5.45 7.95 6.825 5.6 8.95L5 9.5Z"
              fill="#FF3B30"
            />
          </Svg>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSelected: {
    // 선택 시 약간의 스케일 효과 (선택 강조)
    transform: [{ scale: 1.15 }],
  },
  outerCircle: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  outerCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#006242',
    shadowColor: '#006242',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  innerCircle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  // 🔥 찜한 상품 하트 뱃지 스타일
  heartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

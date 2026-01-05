/**
 * DetailedMarker Component
 *
 * 줌 인 상태에서 사용하는 상세 마커
 * - 상품명만 표시 (가격 제거)
 * - 당근마켓 스타일
 * - 선택 시 강조 효과
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { MarkerType } from '../MapView.types';

interface DetailedMarkerProps {
  /** 상품명 */
  title: string;
  /** 1인 가격 (사용 안 함, 하위 호환성 유지) */
  price?: number;
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
 * DetailedMarker Component
 */
export const DetailedMarker: React.FC<DetailedMarkerProps> = ({
  title,
  type = 'product-recruiting',
  isSelected = false,
  isLiked = false,
}) => {
  const backgroundColor = getBackgroundColor(type);

  // 상품명 줄임 (최대 12자)
  const displayTitle = title.length > 12 ? `${title.substring(0, 12)}...` : title;

  return (
    <View style={[styles.container, isSelected && styles.containerSelected]}>
      {/* 상품명 */}
      <View
        style={[
          styles.titleContainer,
          {
            backgroundColor,
            borderColor: '#FFFFFF',
          },
          isSelected && styles.titleContainerSelected,
        ]}
      >
        <Text
          style={styles.titleText}
          numberOfLines={1}
        >
          {displayTitle}
        </Text>

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

      {/* 하단 화살표 (말풍선 꼬리) */}
      <View style={[styles.arrow, { borderTopColor: backgroundColor }]} />

      {/* 원형 아이콘 (위치 표시) */}
      <View style={styles.circleContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSelected: {
    // 선택 시 컨테이너 전체에 약간의 스케일 효과 (선택 강조)
    transform: [{ scale: 1.05 }],
  },
  titleContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    minWidth: 60,
    maxWidth: 140,
    alignItems: 'center',
    // 그림자 효과
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleContainerSelected: {
    // 선택 시 테두리 두께 증가 및 그림자 강화 (색상은 유지)
    borderWidth: 3,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 15,
    color: '#FFFFFF',
    letterSpacing: -0.3,
    paddingRight: 16, // 🔥 하트 뱃지 공간 확보
  },
  // 🔥 찜한 상품 하트 뱃지 스타일
  heartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 8,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderLeftWidth: 6,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    marginTop: -1,
  },
  // 원형 아이콘 스타일
  circleContainer: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
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
    borderWidth: 2,
    borderColor: '#006242',
    shadowColor: '#006242',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
});

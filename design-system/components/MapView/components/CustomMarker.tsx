/**
 * CustomMarker Component
 *
 * Figma 디자인에 맞춘 커스텀 마커 컴포넌트
 * - 내 위치: 파란색 원 + 그림자
 * - 공구 장소: displayMode에 따라 원형 또는 상세 마커
 * - 찜한 공구: 하트 아이콘
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import type { MarkerType, MarkerDisplayMode } from '../MapView.types';
import { SimpleCircleMarker } from './SimpleCircleMarker';
import { DetailedMarker } from './DetailedMarker';
import { PriceMarker } from './PriceMarker';

interface CustomMarkerProps {
  /** 마커 타입 (기본: 'default') */
  type?: MarkerType;
  /** 상품 정보 (가격 표시용, 선택 사항) */
  product?: {
    pricePerSlot: number;
    title?: string;
    progress?: number;
  };
  /** 선택 여부 (기본: false) */
  isSelected?: boolean;
  /** 표시 모드 (기본: 'simple') */
  displayMode?: MarkerDisplayMode;
  /** 찜한 상품 여부 (기본: false) */
  isLiked?: boolean;
}

export const CustomMarker: React.FC<CustomMarkerProps> = ({
  type = 'default',
  product,
  isSelected = false,
  displayMode = 'simple',
  isLiked = false,
}) => {
  // 내 위치 마커
  if (type === 'my-location') {
    return (
      <View style={styles.myLocationContainer}>
        {/* 외부 원 - 반투명 파란색 */}
        <View style={styles.myLocationOuter} />
        {/* 내부 원 - 파란색 + 흰색 테두리 */}
        <View style={styles.myLocationInner} />
      </View>
    );
  }

  // 🔥 DEPRECATED: 하위 호환성을 위해 liked-product 타입 지원 유지
  // 향후 백엔드 연동 시 isLiked 플래그로 대체 권장
  if (type === 'liked-product') {
    return (
      <View style={styles.productMarkerContainer}>
        <Svg width={26} height={26} viewBox="0 0 26 26">
          {/* 외부 원 - 흰색 배경 + 회색 테두리 */}
          <Circle cx="13" cy="13" r="12.5" fill="white" stroke="#E1E1E1" />
          {/* 내부 원 - 녹색 배경 */}
          <Circle cx="13" cy="13" r="11" fill="#006242" />
          {/* 하트 아이콘 - 흰색 */}
          <Path
            d="M15.7638 9.00065C15.3368 9.00057 14.9142 9.07978 14.5209 9.23359C14.1276 9.38741 13.7716 9.61271 13.474 9.89615L13.0024 10.3461L12.526 9.89615C12.2284 9.61259 11.8725 9.38717 11.4792 9.23324C11.0859 9.07931 10.6632 9 10.2362 9C9.80924 9 9.38658 9.07931 8.99328 9.23324C8.59997 9.38717 8.24403 9.61259 7.9465 9.89615C7.33944 10.4764 7 11.2526 7 12.0605C7 12.8683 7.33944 13.6445 7.9465 14.2248L13.0024 19L18.0535 14.2248C18.6606 13.6445 19 12.8683 19 12.0605C19 11.2526 18.6606 10.4764 18.0535 9.89615C17.7559 9.61271 17.3999 9.38741 17.0066 9.23359C16.6133 9.07978 16.1907 9.00057 15.7638 9.00065Z"
            fill="white"
          />
        </Svg>
      </View>
    );
  }

  // 공구 상품 마커: displayMode에 따라 다른 마커 렌더링
  if (product?.pricePerSlot) {
    // 🔥 안전장치: price가 유효한 숫자인지 확인
    const validPrice = typeof product.pricePerSlot === 'number' && !isNaN(product.pricePerSlot)
      ? product.pricePerSlot
      : 0;

    // 선택된 마커는 항상 상세 표시
    if (isSelected || displayMode === 'detailed') {
      return (
        <DetailedMarker
          title={product.title || '공구상품'}
          price={validPrice}
          type={type}
          isSelected={isSelected}
          isLiked={isLiked}
        />
      );
    }

    // displayMode가 'simple'이면 원형 마커 표시
    return (
      <SimpleCircleMarker
        type={type}
        isSelected={isSelected}
        isLiked={isLiked}
      />
    );
  }

  // fallback: 기본 원형 마커
  return (
    <SimpleCircleMarker
      type={type}
      isSelected={isSelected}
      isLiked={isLiked}
    />
  );
};

const styles = StyleSheet.create({
  // 내 위치 마커 스타일
  myLocationContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLocationOuter: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(29, 139, 255, 0.3)',
  },
  myLocationInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1D8BFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#1D8BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  // 공구 장소 마커 스타일 (Figma 디자인)
  productMarkerContainer: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productMarkerOuter: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  productMarkerInner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  productMarkerCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  heartIcon: {
    position: 'absolute',
  },
});

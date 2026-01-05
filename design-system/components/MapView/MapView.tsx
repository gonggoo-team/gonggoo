/**
 * MapView Component
 *
 * 네이버 지도를 표시하는 컴포넌트입니다.
 * @mj-studio/react-native-naver-map 라이브러리를 사용합니다.
 *
 * Figma: 거래 정보 섹션, 동네 설정 화면
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// 개발 환경에서만 console.error 활성화
const __DEV__ = process.env.NODE_ENV === 'development';
const debugError = (...args: any[]) => {
  if (__DEV__) {
    console.error(...args);
  }
};
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  NaverMapView,
  NaverMapCircleOverlay,
  NaverMapMarkerOverlay,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives';
import { CustomMarker } from './components/CustomMarker';
import type { MapViewProps } from './MapView.types';

/**
 * MapView ref 타입 정의 (외부에서 카메라 제어를 위해 사용)
 */
export interface MapViewRef {
  animateCameraTo: (params: {
    latitude: number;
    longitude: number;
    zoom?: number;
    duration?: number;
  }) => void;
}

export const MapView = forwardRef<MapViewRef, MapViewProps>(({
  latitude,
  longitude,
  address, // 하위 호환성 유지 (미사용)
  height = 200,
  showMarker = false,
  markers,
  rangeCircleRadius,
  rangeCircleCenter,
  showLocationButton = false,
  onLocationButtonPress,
  interactive = true,
  zoom = 15,
  onCameraChange,
  onMapClick,
  disableAutoAnimation = false,
}, ref) => {
  const { theme } = useTheme();
  const mapRef = useRef<NaverMapViewRef>(null);

  /**
   * 외부에서 카메라를 제어할 수 있도록 ref 노출
   */
  useImperativeHandle(ref, () => ({
    animateCameraTo: (params) => {
      mapRef.current?.animateCameraTo({
        latitude: params.latitude,
        longitude: params.longitude,
        zoom: params.zoom ?? zoom,
        duration: params.duration ?? 300,
      });
    },
  }));


  /**
   * 위치 또는 줌이 변경되면 카메라 이동
   * (disableAutoAnimation이 true면 건너뜀)
   */
  useEffect(() => {
    if (!disableAutoAnimation && mapRef.current) {
      mapRef.current.animateCameraTo({
        latitude,
        longitude,
        zoom,
        duration: 400, // 부드러운 애니메이션
      });
    }
  }, [latitude, longitude, zoom, disableAutoAnimation]);

  /**
   * 현재 위치 버튼 핸들러
   */
  const handleLocationPress = () => {
    if (onLocationButtonPress) {
      onLocationButtonPress();
    }
    // 지도를 현재 위치로 이동
    mapRef.current?.animateCameraTo({
      latitude,
      longitude,
      zoom,
      duration: 300,
    });
  };


  return (
    <View style={[styles.container, { height }]}>
      <NaverMapView
        ref={mapRef}
        style={styles.map}
        initialCamera={{
          latitude,
          longitude,
          zoom,
        }}
        isScrollGesturesEnabled={interactive}
        isZoomGesturesEnabled={interactive}
        isTiltGesturesEnabled={false}
        isRotateGesturesEnabled={false}
        isStopGesturesEnabled={interactive}
        logoAlign="BottomLeft"
        logoMargin={{ left: 8, bottom: 8 }}
        onCameraChanged={(event) => {
          if (onCameraChange && event.latitude !== undefined && event.longitude !== undefined) {
            onCameraChange(
              event.latitude,
              event.longitude,
              event.zoom ?? zoom // zoom이 undefined면 기본값 사용
            );
          }
        }}
        onTapMap={(event) => {
          if (onMapClick && event.latitude !== undefined && event.longitude !== undefined) {
            onMapClick(event.latitude, event.longitude);
          }
        }}
      >
        {/* 단일 마커 표시 (하위 호환성) */}
        {showMarker && !markers && (
          <NaverMapMarkerOverlay
            latitude={latitude}
            longitude={longitude}
            width={32}
            height={40}
            anchor={{ x: 0.5, y: 1 }}
          />
        )}

        {/* 여러 마커 표시 (새로운 방식) */}
        {markers && markers.map((marker) => {
          // 🔥 안전장치: 마커 데이터 검증
          if (!marker || !marker.id || marker.latitude === undefined || marker.longitude === undefined) {
            debugError('[MapView] ❌ 유효하지 않은 마커 데이터:', marker);
            return null;
          }

          // 마커 크기 계산
          let markerWidth = 26;
          let markerHeight = 26;
          let anchorY = 0.5;

          if (marker.type === 'my-location') {
            markerWidth = 38;
            markerHeight = 38;
          } else if (marker.product?.pricePerSlot) {
            // displayMode에 따라 크기 조정
            if (marker.isSelected || marker.displayMode === 'detailed') {
              // 상세 마커: 상품명 + 원형 아이콘
              markerWidth = 140;
              markerHeight = 70;
              // 원형 아이콘의 중심이 좌표를 가리키도록 (하단에서 13px 위)
              anchorY = (70 - 13) / 70; // ≈ 0.81
            } else {
              // 단순 원형 마커
              markerWidth = 26;
              markerHeight = 26;
              anchorY = 0.5;
            }
          }

          return (
            <NaverMapMarkerOverlay
              key={marker.id}
              latitude={marker.latitude}
              longitude={marker.longitude}
              width={markerWidth}
              height={markerHeight}
              anchor={{ x: 0.5, y: anchorY }}
              onTap={marker.onPress}
            >
              <CustomMarker
                type={marker.type}
                product={marker.product}
                isSelected={marker.isSelected}
                displayMode={marker.displayMode}
                isLiked={marker.isLiked}
              />
            </NaverMapMarkerOverlay>
          );
        })}

        {/* 범위 원 표시 (동네 설정 화면용 + 지도 화면용) */}
        {rangeCircleRadius !== undefined && rangeCircleRadius > 0 && (
          <NaverMapCircleOverlay
            latitude={rangeCircleCenter?.latitude ?? latitude}
            longitude={rangeCircleCenter?.longitude ?? longitude}
            radius={rangeCircleRadius * 1000} // km to meters
            color="rgba(57, 181, 74, 0.15)"
            outlineWidth={2}
            outlineColor="rgba(57, 181, 74, 0.8)"
          />
        )}

      </NaverMapView>

      {/* 현재 위치 버튼 (동네 설정 화면용) */}
      {showLocationButton && (
        <TouchableOpacity
          style={[
            styles.locationButton,
            {
              backgroundColor: theme.colors.surface.normal.bg1,
              shadowColor: theme.colors.surface.texticon.onnormal.text.black,
            },
          ]}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <Icon name="map-pin-fill" size={24} color={theme.colors.surface.brand.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  locationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});

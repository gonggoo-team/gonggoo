/**
 * MapView Component
 *
 * Naver Map을 표시하는 컴포넌트입니다.
 *
 * Features:
 * - 위치 표시 및 마커
 * - 범위 원형 표시
 * - 인터랙티브/정적 모드
 * - 내 위치 버튼
 * - 줌 레벨 제어
 *
 * Figma: 거래 정보 섹션
 */

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  NaverMapCircleOverlay,
} from '@mj-studio/react-native-naver-map';
import { useTheme } from '../../hooks';
import type { MapViewProps } from './MapView.types';
import { LocationButton } from './components/LocationButton';
import { CustomMarker } from './components/CustomMarker';

/**
 * Convert hex color to rgba with alpha channel
 */
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Validate coordinates
 */
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

/**
 * Calculate optimal zoom level based on circle radius
 */
const calculateOptimalZoom = (radiusKm?: number): number => {
  if (!radiusKm) return 15;

  if (radiusKm <= 2) return 14;
  if (radiusKm <= 5) return 13;
  if (radiusKm <= 10) return 12;
  return 11;
};

export const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  address,
  height = 200,
  showMarker = true,
  rangeCircleRadius,
  rangeCircleColor,
  interactive = false,
  showLocationButton = false,
  onLocationButtonPress,
  onRegionChange,
  zoomLevel,
}) => {
  const { theme } = useTheme();
  const [mapError, setMapError] = useState<string | null>(null);

  // Validate coordinates
  if (!isValidCoordinate(latitude, longitude)) {
    console.error('[MapView] Invalid coordinates:', { latitude, longitude });
    return (
      <View style={[styles.container, { height, backgroundColor: theme.colors.surface.normal.bg2 }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.surface.texticon.onnormal.text.midEmp }]}>
            유효하지 않은 좌표입니다
          </Text>
        </View>
      </View>
    );
  }

  // Calculate effective zoom level
  const effectiveZoom = zoomLevel || calculateOptimalZoom(rangeCircleRadius);

  // Circle colors
  const circleOutlineColor = rangeCircleColor || theme.colors.surface.brand.primary;
  const circleFillColor = hexToRgba(circleOutlineColor, 0.2);

  // Camera change handler
  const handleCameraChanged = useCallback(
    (params: { latitude: number; longitude: number; zoom?: number }) => {
      if (onRegionChange) {
        onRegionChange(params.latitude, params.longitude);
      }
    },
    [onRegionChange]
  );

  return (
    <View style={[styles.container, { height }]}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude,
          longitude,
          zoom: effectiveZoom,
        }}
        isScrollGesturesEnabled={interactive}
        isZoomGesturesEnabled={interactive}
        isTiltGesturesEnabled={false}
        isRotateGesturesEnabled={false}
        onCameraChanged={handleCameraChanged}
        onInitialized={() => {
          console.log('[MapView] Map initialized successfully');
          setMapError(null);
        }}
      >
        {/* Circle overlay for range */}
        {rangeCircleRadius && rangeCircleRadius > 0 && (
          <NaverMapCircleOverlay
            latitude={latitude}
            longitude={longitude}
            radius={rangeCircleRadius * 1000}
            color={circleFillColor}
            outlineWidth={2}
            outlineColor={circleOutlineColor}
          />
        )}

        {/* Marker overlay */}
        {showMarker && (
          <NaverMapMarkerOverlay
            latitude={latitude}
            longitude={longitude}
            anchor={{ x: 0.5, y: 1 }}
            width={48}
            height={60}
          >
            <CustomMarker />
          </NaverMapMarkerOverlay>
        )}
      </NaverMapView>

      {/* Error overlay */}
      {mapError && (
        <View style={styles.errorOverlay}>
          <Text style={[styles.errorText, { color: '#FFFFFF' }]}>
            {mapError}
          </Text>
        </View>
      )}

      {/* Location button */}
      {showLocationButton && onLocationButtonPress && (
        <LocationButton onPress={onLocationButtonPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

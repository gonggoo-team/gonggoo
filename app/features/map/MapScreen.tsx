/**
 * Map Screen
 *
 * 지도 화면 - 주변 공구상품을 지도에 표시하고 검색할 수 있는 화면
 * [UX Tuned Edition] 안전성과 반응성(Snappiness)의 황금 밸런스
 * * 변경점:
 * 1. Debounce/Throttle 시간 단축 (답답함 해소)
 * 2. 강제 대기(Timeout) 제거 (즉각 반응)
 * 3. Optimistic UI 강화
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

// 개발 환경에서만 console.log 활성화
const __DEV__ = process.env.NODE_ENV === 'development';
const debugLog = (...args: any[]) => {
  if (__DEV__) console.log(...args);
};
const debugError = (...args: any[]) => {
  if (__DEV__) console.error(...args);
};
const debugWarn = (...args: any[]) => {
  if (__DEV__) console.warn(...args);
};

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  ScrollView,
  Alert,
  Dimensions,
  InteractionManager,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '@/design-system';
import Reanimated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import * as Location from 'expo-location';
import type BottomSheet from '@gorhom/bottom-sheet';
import {
  ThemeProvider,
  useTheme,
  MapView,
  type MapViewRef,
  Icon,
} from '@/design-system';
import { useAuth } from '@/app/shared/contexts';
import { ProductProvider } from '@/app/shared/contexts/ProductContext';
import { getCurrentLocation } from '@/app/features/location/services/locationService';
import { getAllProducts } from '@/app/shared/services/mock/products.mock';
import {
  NeighborhoodButton,
  ProductBottomSheet,
} from './components';
import type { MapMarker } from './types';
import { useProductContext } from '@/app/shared/contexts/ProductContext';
import { createGridIndex, getMinDistanceFromGrid } from './utils/markerGrid';
import { applyMapFilters } from './utils/filterMapProducts';
import { applyMarkerOffsets } from './utils/markerCluster';

/**
 * 🔥 [UX 튜닝] 설정 상수 (반응성 강화)
 */
const MAP_CONFIG = {
  ANIMATION_DURATION: 400,
  // 이동 후 대기 시간을 대폭 줄여서 "멈춘 느낌" 제거
  FLAG_RESET_DELAY: 100,      
  // 스로틀링을 조금 더 풀어줌 (부드러움 향상)
  THROTTLE_MS: 100,           
  // 사람의 일반적인 터치 속도 고려 (너무 길면 씹힘)
  CLICK_DEBOUNCE_MS: 250,     
  ZOOM_THRESHOLD: 14.0,
  DISTANCE_THRESHOLD: 30,
  FEW_MARKERS_THRESHOLD: 5,
  PERFORMANCE_THRESHOLD: 50,
};

// ... (RangeOption, getZoomLevelForRange, calculateDistance, calculateViewportBounds - 기존 동일)
interface RangeOption {
  value: number;
  label: string;
}

const RANGE_OPTIONS: RangeOption[] = [
  { value: 0.5, label: '500m 이내' },
  { value: 1, label: '1km 이내' },
  { value: 2, label: '2km 이내' },
  { value: 3, label: '3km 이내' },
  { value: 4, label: '4km 이내' },
  { value: 5, label: '5km 이내' },
];

const getZoomLevelForRange = (rangeKm: number): number => {
  if (rangeKm <= 0.5) return 14.5;
  if (rangeKm <= 1) return 13.5;
  if (rangeKm <= 2) return 12.5;
  if (rangeKm <= 3) return 11.8;
  if (rangeKm <= 4) return 11.3;
  if (rangeKm <= 5) return 11;
  return 10.5;
};

const calculateDistance = (
  lat1: number, lng1: number, lat2: number, lng2: number
): number => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculateViewportBounds = (
  centerLat: number, centerLng: number, zoom: number, windowHeight: number
) => {
  const baseRangeKm = 40075 / Math.pow(2, zoom);
  const windowWidth = Dimensions.get('window').width;
  const screenRatio = windowHeight / windowWidth;
  const latPerKm = 1 / 111;
  const lngPerKm = 1 / (111 * Math.cos(centerLat * Math.PI / 180));
  const latDelta = (baseRangeKm * latPerKm * screenRatio) / 2;
  const lngDelta = (baseRangeKm * lngPerKm) / 2;
  return {
    northEast: { latitude: centerLat + latDelta, longitude: centerLng + lngDelta },
    southWest: { latitude: centerLat - latDelta, longitude: centerLng - lngDelta },
  };
};

export default function MapScreen() {
  return (
    <ThemeProvider>
      <ProductProvider products={getAllProducts()}>
        <MapScreenContent />
      </ProductProvider>
    </ThemeProvider>
  );
}

const cleanupCameraAnimation = (
  timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  flagRef: React.MutableRefObject<boolean>
) => {
  if (timerRef.current) {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }
  flagRef.current = false;
};

function MapScreenContent() {
  const { theme } = useTheme();
  const { push } = useThrottledNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { height: windowHeight } = useWindowDimensions();

  const params = useLocalSearchParams<{ searchQuery?: string }>();
  const searchQuery = params.searchQuery || '';

  const mapRef = useRef<MapViewRef>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const neighborhoodLocation = useMemo(() => ({
    latitude: user?.location?.latitude || 37.5012767,
    longitude: user?.location?.longitude || 127.0395812,
    range: user?.location?.range || 5,
  }), [user?.location?.latitude, user?.location?.longitude, user?.location?.range]);

  const [currentGPSLocation, setCurrentGPSLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [mapCenter, setMapCenter] = useState(() => ({
    latitude: neighborhoodLocation.latitude,
    longitude: neighborhoodLocation.longitude,
    zoom: getZoomLevelForRange(neighborhoodLocation.range),
  }));

  const [selectedRange, setSelectedRange] = useState<number | null | 'neighborhood'>(null);

  const [currentViewportBounds, setCurrentViewportBounds] = useState<{
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  }>(() => {
    const zoom = getZoomLevelForRange(neighborhoodLocation.range);
    return calculateViewportBounds(neighborhoodLocation.latitude, neighborhoodLocation.longitude, zoom, windowHeight);
  });

  const viewportBoundsKey = useMemo(() => {
    return `${currentViewportBounds.northEast.latitude.toFixed(4)},${currentViewportBounds.northEast.longitude.toFixed(4)},${currentViewportBounds.southWest.latitude.toFixed(4)},${currentViewportBounds.southWest.longitude.toFixed(4)}`;
  }, [currentViewportBounds]);

  const isProgrammaticMove = useRef(false);
  const isInteractionProcessing = useRef(false);
  const cameraAnimationTimer = useRef<NodeJS.Timeout | null>(null);
  const previousMapCenter = useRef({
    latitude: neighborhoodLocation.latitude,
    longitude: neighborhoodLocation.longitude,
  });
  const previousViewportBoundsKey = useRef<string>('');

  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [bottomSheetIndex, setBottomSheetIndex] = useState(1);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const lastMarkerClickTime = useRef<number>(0);
  const lastCameraChangeTime = useRef<number>(0);

  const animatedPosition = useSharedValue(windowHeight * 0.40);
  const maxSnapPoint = windowHeight * 0.85;

  const rangeButtonAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const bottomSheetBottom = windowHeight - animatedPosition.value;
    const opacity = bottomSheetBottom >= maxSnapPoint * 0.95 ? 0 : 1;
    return { opacity };
  }, [maxSnapPoint, windowHeight]);

  const floatingButtonAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const bottomSheetTop = animatedPosition.value;
    // bottomsheet와 더 가깝게 위치하도록 간격을 12px로 조정
    const floatingButtonBottomTop = bottomSheetTop - 12;
    const bottom = windowHeight - floatingButtonBottomTop - 40;
    const bottomSheetHeight = windowHeight - bottomSheetTop;
    const opacity = bottomSheetHeight >= maxSnapPoint * 0.95 ? 0 : 1;
    return { opacity, bottom };
  }, [maxSnapPoint, windowHeight]);

  const calculateZoomForRange = useCallback((rangeKm: number): number => getZoomLevelForRange(rangeKm), []);

  const moveCameraTo = useCallback((
    target: { latitude: number; longitude: number; zoom: number },
    onAnimationComplete?: () => void
  ) => {
    if (!mapRef.current) return;
    if (cameraAnimationTimer.current) clearTimeout(cameraAnimationTimer.current);

    isProgrammaticMove.current = true;
    setMapCenter(target);
    previousMapCenter.current = { latitude: target.latitude, longitude: target.longitude };

    mapRef.current.animateCameraTo({
      ...target,
      duration: MAP_CONFIG.ANIMATION_DURATION,
    });

    // 🔥 [튜닝] 이동 후 대기 시간을 줄여서 바로 터치 가능하게 함
    cameraAnimationTimer.current = setTimeout(() => {
      isProgrammaticMove.current = false;
      cameraAnimationTimer.current = null;
      if (onAnimationComplete) onAnimationComplete();
    }, MAP_CONFIG.FLAG_RESET_DELAY); // 100ms
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', '현재 위치로 이동하려면 위치 권한이 필요합니다.', [{ text: '확인' }]);
        return false;
      }
      return true;
    } catch (error) { return false; }
  }, []);

  const initLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
    try {
      const lastLocation = await Location.getLastKnownPositionAsync();
      if (lastLocation) {
        setCurrentGPSLocation({ latitude: lastLocation.coords.latitude, longitude: lastLocation.coords.longitude });
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCurrentGPSLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch (e) {}
  }, [requestLocationPermission]);

  useEffect(() => {
    initLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMyLocationPress = useCallback(async () => {
    if (isInteractionProcessing.current || isLocationLoading) return;
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    setIsLocationLoading(true);

    try {
      // 1단계: 캐시된 위치로 먼저 이동 (즉각적인 피드백)
      try {
        const lastLocation = await Location.getLastKnownPositionAsync({ requiredAccuracy: 1000 });
        if (lastLocation) {
          moveCameraTo({
            latitude: lastLocation.coords.latitude,
            longitude: lastLocation.coords.longitude,
            zoom: 15
          });
          setCurrentGPSLocation({ latitude: lastLocation.coords.latitude, longitude: lastLocation.coords.longitude });
        }
      } catch (e) {
        debugLog('[Map] Last known position not available:', e);
      }

      // 2단계: 정확한 현재 위치 가져오기 (locationService 사용)
      debugLog('[Map] Getting current GPS location...');
      const coords = await getCurrentLocation();

      const targetLat = coords.latitude;
      const targetLng = coords.longitude;

      debugLog('[Map] GPS location success:', { lat: targetLat, lng: targetLng });

      setCurrentGPSLocation({ latitude: targetLat, longitude: targetLng });
      moveCameraTo({ latitude: targetLat, longitude: targetLng, zoom: 16 });

    } catch (error) {
      debugError('[Map] GPS location failed:', error);
      Alert.alert('위치 확인 실패', '현재 위치를 찾을 수 없습니다.', [{ text: '확인' }]);

      // 실패 시 사용자의 동네 위치로 이동
      moveCameraTo({
        latitude: neighborhoodLocation.latitude,
        longitude: neighborhoodLocation.longitude,
        zoom: calculateZoomForRange(neighborhoodLocation.range)
      });
      setCurrentGPSLocation({ latitude: neighborhoodLocation.latitude, longitude: neighborhoodLocation.longitude });
    } finally {
      setIsLocationLoading(false);
    }
  }, [requestLocationPermission, moveCameraTo, neighborhoodLocation, isLocationLoading, calculateZoomForRange]);

  useEffect(() => {
    if (user?.location && mapRef.current) {
      const zoom = calculateZoomForRange(user.location.range);
      moveCameraTo({ latitude: user.location.latitude, longitude: user.location.longitude, zoom });
    }
  }, [user?.location, calculateZoomForRange, moveCameraTo]);

  const { products: allProducts, likedProductIds } = useProductContext();
  const allProductIds = useMemo(() => new Set(allProducts.map(p => p.id)), [allProducts]);
  const likedProductIdsSet = useMemo(() => new Set(likedProductIds), [likedProductIds]);

  const filteredProducts = useMemo(() => {
    return applyMapFilters({
      allProducts,
      viewportBounds: currentViewportBounds,
      searchQuery,
      showLikedOnly,
      likedProductIds: likedProductIdsSet,
      activeTab,
      selectedCategory,
      userId: user?.id,
    });
  }, [allProducts, searchQuery, showLikedOnly, likedProductIdsSet, activeTab, selectedCategory, user?.id, viewportBoundsKey]);

  const markers = useMemo(() => {
    const productMarkers: MapMarker[] = filteredProducts
      .filter((product) => {
        return (
          product?.id && product?.title &&
          product.latitude != null && product.longitude != null &&
          !isNaN(product.latitude) && !isNaN(product.longitude)
        );
      })
      .map((product) => {
        let markerType: 'product-recruiting' | 'product-closed' | 'product-closing-soon' = 'product-recruiting';
        if (product.recruitmentStatus === '모집 완료' || product.recruitmentStatus === '거래 완료') {
          markerType = 'product-closed';
        } else if (product.recruitmentStatus === '마감 임박') {
          markerType = 'product-closing-soon';
        }
        const isLiked = likedProductIdsSet.has(product.id);
        return {
          id: product.id,
          type: markerType,
          latitude: product.latitude!,
          longitude: product.longitude!,
          isLiked,
          product: {
            pricePerSlot: product.pricePerSlot,
            title: product.title,
            progress: product.progress ?? 0,
          },
        };
      });
    return applyMarkerOffsets(productMarkers);
  }, [filteredProducts, likedProductIdsSet]);

  const gridIndex = useMemo(() => {
    if (markers.length > 10 && markers.length <= MAP_CONFIG.PERFORMANCE_THRESHOLD) {
      return createGridIndex(markers, 30);
    }
    return null;
  }, [markers]);

  const markersWithDisplayMode = useMemo(() => {
    if (selectedMarkerId) {
      return markers.map((marker) => ({
        ...marker,
        displayMode: (marker.id === selectedMarkerId ? 'detailed' : 'simple') as 'simple' | 'detailed',
      }));
    }
    if (markers.length <= MAP_CONFIG.FEW_MARKERS_THRESHOLD) {
      return markers.map(marker => ({ ...marker, displayMode: 'detailed' as const }));
    }
    if (mapCenter.zoom < MAP_CONFIG.ZOOM_THRESHOLD) {
      return markers.map(marker => ({ ...marker, displayMode: 'simple' as const }));
    }
    if (markers.length <= 10) {
      return markers.map(marker => ({ ...marker, displayMode: 'detailed' as const }));
    }
    if (markers.length > MAP_CONFIG.PERFORMANCE_THRESHOLD) {
      return markers.map(marker => ({ ...marker, displayMode: 'simple' as const }));
    }
    if (gridIndex) {
      return markers.map((marker) => {
        const minDistance = getMinDistanceFromGrid(marker, gridIndex, calculateDistance, 30);
        return {
          ...marker,
          displayMode: (minDistance >= MAP_CONFIG.DISTANCE_THRESHOLD ? 'detailed' : 'simple') as 'simple' | 'detailed',
        };
      });
    }
    return markers.map(marker => ({ ...marker, displayMode: 'simple' as const }));
  }, [markers, mapCenter.zoom, selectedMarkerId, gridIndex]);

  const handleSearchPress = useCallback(() => push('/map-search'), [push]);
  const handleClearSearch = useCallback(() => push('/(tabs)/map'), [push]);

  /**
   * 🔥 [핵심 튜닝] 마커 클릭 핸들러 (빠릿함 + 안전성)
   * 1. 락은 걸되, 빨리 푼다.
   * 2. InteractionManager로 무거운 작업만 뒤로 미룬다.
   * 3. 마커 선택(State 변경)은 즉시 실행한다.
   */
  const handleMarkerPress = useCallback((productId: string) => {
    // 1. 카메라가 움직이는 중에는 클릭 방지 (좌표 튀는 것 방지)
    if (isProgrammaticMove.current) return;
    
    // 2. 이미 처리 중이면 무시 (따닥 방지) - 단, Lock 시간을 매우 짧게 둠
    if (isInteractionProcessing.current) return;

    const now = Date.now();
    // 3. Debounce: 250ms (너무 짧은 중복 터치만 막음)
    if (now - lastMarkerClickTime.current < MAP_CONFIG.CLICK_DEBOUNCE_MS) return;
    lastMarkerClickTime.current = now;

    if (!allProductIds.has(productId)) return;
    
    // Lock On
    isInteractionProcessing.current = true;

    try {
      if (selectedMarkerId === productId) {
        // 선택 해제: 즉시 반영
        setSelectedMarkerId(null);
        // 무거운 애니메이션만 렌더링 후로 미룸
        requestAnimationFrame(() => {
           bottomSheetRef.current?.snapToIndex(0);
        });
      } else {
        // 선택: 즉시 반영 (지도에서 마커가 바로 반응하도록)
        setSelectedMarkerId(productId);
        
        // BottomSheet 올라오는 무거운 작업은 JS 스레드가 비었을 때 실행
        InteractionManager.runAfterInteractions(() => {
          if (bottomSheetRef.current && bottomSheetIndex < 1) {
            bottomSheetRef.current.snapToIndex(1);
          }
        });
      }
    } catch (error) {
      setSelectedMarkerId(null);
    } finally {
      // 🔥 [튜닝] Lock 해제 시간을 제거하거나 극도로 줄임
      // setTimeout 없이 즉시 해제하거나, 50ms 정도로만 둠
      setTimeout(() => {
         isInteractionProcessing.current = false;
      }, 50); // 50ms: 거의 즉시 해제
    }
  }, [allProductIds, selectedMarkerId, bottomSheetIndex]);

  const handleNeighborhoodSelect = useCallback(() => {
    if (isInteractionProcessing.current) return;
    if (selectedRange === 'neighborhood') {
      setSelectedRange(null);
      bottomSheetRef.current?.snapToIndex(0);
      return;
    }
    setSelectedRange('neighborhood');
    bottomSheetRef.current?.snapToIndex(0);
    const zoom = calculateZoomForRange(neighborhoodLocation.range);
    moveCameraTo({ latitude: neighborhoodLocation.latitude, longitude: neighborhoodLocation.longitude, zoom });
  }, [neighborhoodLocation, selectedRange, calculateZoomForRange, moveCameraTo]);

  const handleRangeSelect = useCallback((newRange: number) => {
    if (isInteractionProcessing.current) return;
    if (selectedRange === newRange) {
      setSelectedRange(null);
      bottomSheetRef.current?.snapToIndex(0);
      return;
    }
    setSelectedRange(newRange);
    bottomSheetRef.current?.snapToIndex(0);
    const zoom = calculateZoomForRange(newRange);
    moveCameraTo({ latitude: neighborhoodLocation.latitude, longitude: neighborhoodLocation.longitude, zoom });
  }, [selectedRange, neighborhoodLocation, calculateZoomForRange, moveCameraTo]);

  const handleCameraChange = useCallback((lat: number, lng: number, z: number) => {
    const now = Date.now();
    // Throttle 100ms: 부드러움과 성능의 타협점
    if (now - lastCameraChangeTime.current < MAP_CONFIG.THROTTLE_MS) return;
    lastCameraChangeTime.current = now;

    setMapCenter(prev => ({ ...prev, latitude: lat, longitude: lng, zoom: z }));

    const bounds = calculateViewportBounds(lat, lng, z, windowHeight);
    const newBoundsKey = `${bounds.northEast.latitude.toFixed(4)},${bounds.northEast.longitude.toFixed(4)},${bounds.southWest.latitude.toFixed(4)},${bounds.southWest.longitude.toFixed(4)}`;

    if (previousViewportBoundsKey.current !== newBoundsKey) {
      setCurrentViewportBounds({ northEast: { ...bounds.northEast }, southWest: { ...bounds.southWest } });
      previousViewportBoundsKey.current = newBoundsKey;
    }

    if (!isProgrammaticMove.current) {
      const latDiff = Math.abs(lat - previousMapCenter.current.latitude);
      const lngDiff = Math.abs(lng - previousMapCenter.current.longitude);
      const DRAG_THRESHOLD = 0.001;

      if (latDiff > DRAG_THRESHOLD || lngDiff > DRAG_THRESHOLD) {
        if (selectedMarkerId) setSelectedMarkerId(null);
        if (selectedRange) setSelectedRange(null);
        requestAnimationFrame(() => { bottomSheetRef.current?.snapToIndex(0); });
        previousMapCenter.current = { latitude: lat, longitude: lng };
      }
    }
  }, [windowHeight, selectedMarkerId, selectedRange]);

  const handleMapClick = useCallback(() => {
    // 맵 클릭은 Lock의 영향을 덜 받게 하여 해제가 잘 되도록 함
    if (isProgrammaticMove.current) return;
    if (selectedMarkerId) {
      setSelectedMarkerId(null);
    }
  }, [selectedMarkerId]);

  const handleLikedFilterToggle = useCallback(() => setShowLikedOnly((prev) => !prev), []);

  const handleBottomSheetChange = useCallback((index: number) => {
    if (index < 0 || index > 2) return;
    setBottomSheetIndex(index);
    if (index === 0 && selectedMarkerId !== null) {
      // 바텀시트로 인한 해제는 Lock 무시 (자연스러운 흐름)
      setSelectedMarkerId(null);
    }
  }, [selectedMarkerId]);

  const markerPressHandlers = useMemo(() => {
    const handlers = new Map<string, () => void>();
    markersWithDisplayMode.forEach((marker) => {
      handlers.set(marker.id, () => handleMarkerPress(marker.id));
    });
    return handlers;
  }, [markersWithDisplayMode.map(m => m.id).join(','), handleMarkerPress]);

  const finalMarkers = useMemo(() => {
    const myLocationMarker = {
      id: 'my-location',
      type: 'my-location' as const,
      latitude: currentGPSLocation?.latitude ?? neighborhoodLocation.latitude,
      longitude: currentGPSLocation?.longitude ?? neighborhoodLocation.longitude,
    };
    const productMarkers = markersWithDisplayMode
      .filter((marker) => marker.type !== 'my-location')
      .map((marker) => ({
        ...marker,
        isSelected: marker.id === selectedMarkerId,
        onPress: markerPressHandlers.get(marker.id),
      }));
    return [myLocationMarker, ...productMarkers];
  }, [currentGPSLocation, neighborhoodLocation, markersWithDisplayMode, selectedMarkerId, markerPressHandlers]);

  useEffect(() => {
    return () => {
      cleanupCameraAnimation(cameraAnimationTimer, isProgrammaticMove);
    };
  }, []);

  return (
    <ScreenWrapper preset="modal" style={styles.container}>
      <MapView
        ref={mapRef}
        latitude={mapCenter.latitude}
        longitude={mapCenter.longitude}
        zoom={mapCenter.zoom}
        height={windowHeight}
        markers={finalMarkers}
        onCameraChange={handleCameraChange}
        onMapClick={handleMapClick}
        interactive
        disableAutoAnimation={true}
        rangeCircleRadius={
          selectedRange === null
            ? undefined
            : selectedRange === 'neighborhood'
              ? neighborhoodLocation.range
              : selectedRange
        }
        rangeCircleCenter={{
          latitude: neighborhoodLocation.latitude,
          longitude: neighborhoodLocation.longitude,
        }}
      />
      
      <View style={[styles.topControls, { paddingTop: insets.top + theme.spacing.md, paddingBottom: theme.spacing.xs, backgroundColor: 'transparent' }]} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: theme.colors.surface.normal.bg1, shadowColor: theme.colors.surface.texticon.onnormal.text.black }]}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <View style={styles.searchBarContent}>
            <Text style={[styles.searchPlaceholder, { color: searchQuery ? theme.colors.surface.texticon.onnormal.text.black : theme.colors.surface.texticon.onnormal.text.lowEmp, fontWeight: searchQuery ? '600' : '500' }]} numberOfLines={1}>
              {searchQuery || '검색어를 입력해주세요.'}
            </Text>
            <View style={styles.searchBarText}>
              {searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="close" size={20} color={theme.colors.surface.texticon.onnormal.icon.black} />
                </TouchableOpacity>
              ) : (
                <Icon name="search" size={24} color={theme.colors.surface.texticon.onnormal.icon.black} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
  
      <Reanimated.View style={[styles.rangeControls, { top: insets.top + theme.spacing.md + 46 + theme.spacing.xs }, rangeButtonAnimatedStyle]} pointerEvents={bottomSheetIndex === 2 ? 'none' : 'auto'}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangeScrollContainer} style={styles.rangeScrollView} bounces={false}>
          <NeighborhoodButton neighborhood={user?.location?.neighborhood || '동네 미설정'} isSelected={selectedRange === 'neighborhood'} onPress={handleNeighborhoodSelect} />
          {RANGE_OPTIONS.map((range) => {
            const isSelected = range.value === selectedRange;
            return (
              <TouchableOpacity
                key={range.value}
                style={[styles.rangeButton, { backgroundColor: isSelected ? '#006242' : theme.colors.surface.normal.bg1, borderColor: isSelected ? '#006242' : '#E1E1E1' }]}
                onPress={() => handleRangeSelect(range.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.rangeButtonText, { color: isSelected ? '#FFFFFF' : theme.colors.surface.texticon.onnormal.text.highEmp }]}>{range.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Reanimated.View>

      <Reanimated.View style={[styles.floatingButtonsContainer, floatingButtonAnimatedStyle]} pointerEvents={bottomSheetIndex === 2 ? 'none' : 'auto'}>
        <TouchableOpacity style={[styles.floatingButton, { backgroundColor: showLikedOnly ? theme.colors.surface.brand.primary : theme.colors.surface.normal.bg1, shadowColor: theme.colors.surface.texticon.onnormal.text.black }]} onPress={handleLikedFilterToggle} activeOpacity={0.7}>
          <Icon name={showLikedOnly ? 'heart-fill' : 'heart-line'} size={18} color={showLikedOnly ? theme.colors.surface.texticon.onnormal.text.white : theme.colors.surface.texticon.onnormal.icon.black} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: theme.colors.surface.normal.bg1, shadowColor: theme.colors.surface.texticon.onnormal.text.black }]}
          onPress={handleMyLocationPress}
          activeOpacity={0.7}
          disabled={isLocationLoading}
        >
          {isLocationLoading ? (
            <ActivityIndicator size="small" color={theme.colors.surface.texticon.onnormal.icon.black} />
          ) : (
            <Icon name="map-pin-fill" size={19} color={theme.colors.surface.texticon.onnormal.icon.black} />
          )}
        </TouchableOpacity>
      </Reanimated.View>

      <ProductBottomSheet
        ref={bottomSheetRef}
        products={filteredProducts}
        initialIndex={1}
        searchBarBottom={16 + 46}
        onSheetChange={handleBottomSheetChange}
        animatedPosition={animatedPosition}
        selectedProductId={selectedMarkerId}
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        onTabChange={setActiveTab}
        onCategoryChange={setSelectedCategory}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topControls: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, zIndex: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: 16, borderRadius: 40, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  searchBarContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  searchPlaceholder: { fontSize: 13, fontWeight: '500', lineHeight: 16, letterSpacing: -0.325 },
  searchBarText: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rangeControls: { position: 'absolute', left: 0, right: 0, zIndex: 9 },
  rangeScrollView: { flexGrow: 0 },
  rangeScrollContainer: { paddingLeft: 20, paddingRight: 20, gap: 8 },
  rangeButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  rangeButtonText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  floatingButtonsContainer: { position: 'absolute', left: 20, gap: 12, zIndex: 50 },
  floatingButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
});
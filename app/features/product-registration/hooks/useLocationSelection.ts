/**
 * useLocationSelection Hook
 *
 * LocationSelectionModal에서 사용되는 위치 선택 로직을 관리하는 hook입니다.
 *
 * Features:
 * - 초기 위치: 제공된 initialLocation 또는 기본 좌표(서울시청)로 설정
 * - GPS 현재 위치: 명시적으로 getCurrentLocation() 호출 시에만 권한 요청
 * - 카메라 변경 시 역지오코딩 (debounced 500ms)
 * - 세부 주소 업데이트 함수
 * - 지도 카메라 이동 함수 (검색 결과 선택 시)
 */

import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { reverseGeocode } from '@/app/shared/utils/geocoding';
import { useDebounce } from '@/app/shared/hooks/useDebounce';

export interface LocationState {
  latitude: number;
  longitude: number;
  address: string;
  detailAddress: string;
}

interface InitialLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  detailAddress?: string;
}

/**
 * useLocationSelection Hook
 *
 * @param initialLocation - 초기 위치 데이터 (선택사항)
 * @returns 위치 선택에 필요한 상태와 함수들
 */
export function useLocationSelection(initialLocation?: InitialLocation | null) {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const mapRef = useRef<any>(null);

  /**
   * 현재 GPS 위치 가져오기
   * "현 위치로 설정" 버튼 클릭 시 명시적으로 호출됩니다.
   *
   * @returns {Promise<{ success: boolean; error?: 'denied' | 'unavailable' }>}
   */
  const getCurrentLocation = async (): Promise<{ success: boolean; error?: 'denied' | 'unavailable' }> => {
    try {
      setIsLoadingLocation(true);

      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('[useLocationSelection] Location permission denied.');
        setIsLoadingLocation(false);
        return { success: false, error: 'denied' };
      }

      // GPS 위치 가져오기
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 역지오코딩으로 주소 가져오기
      const address = await reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: address || '주소를 가져올 수 없습니다',
        detailAddress: '',
      });

      setIsLoadingLocation(false);
      return { success: true };
    } catch (error) {
      console.error('[useLocationSelection] Get current location error:', error);
      setIsLoadingLocation(false);
      return { success: false, error: 'unavailable' };
    }
  };

  /**
   * 초기화: 제공된 위치 또는 기본 좌표(서울시청)로 설정
   * GPS 위치는 자동으로 가져오지 않고, 사용자가 "현 위치로 설정" 버튼을 클릭할 때만 요청
   */
  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      // 1. 제공된 위치 사용 (수정 모드)
      setLocation({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        address: initialLocation.address,
        detailAddress: initialLocation.detailAddress || '',
      });
    } else {
      // 2. 기본 좌표 설정 (서울시청) - 권한 요청 없음
      setLocation({
        latitude: 37.5665,
        longitude: 126.9780,
        address: '서울특별시 중구 태평로1가',
        detailAddress: '',
      });
    }
    setIsLoadingLocation(false);
  }, []); // initialLocation을 의존성에 넣지 않음 (초기화 시에만 실행)

  /**
   * 카메라 변경 핸들러 (역지오코딩)
   * Debouncing이 적용된 함수
   */
  const handleCameraChangeInternal = async (lat: number, lng: number) => {
    if (!location) return;

    setIsGeocoding(true);
    try {
      const address = await reverseGeocode(lat, lng);
      setLocation((prev) => ({
        ...prev!,
        latitude: lat,
        longitude: lng,
        address: address || `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`,
      }));
    } catch (error) {
      console.error('[useLocationSelection] Reverse geocoding error:', error);
      // Fallback: 좌표만 표시
      setLocation((prev) => ({
        ...prev!,
        latitude: lat,
        longitude: lng,
        address: `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`,
      }));
    } finally {
      setIsGeocoding(false);
    }
  };

  // Debounced 역지오코딩 (500ms)
  const handleCameraChange = useDebounce(handleCameraChangeInternal, 500);

  /**
   * 세부 주소 업데이트
   */
  const updateDetailAddress = (detailAddress: string) => {
    setLocation((prev) => (prev ? { ...prev, detailAddress } : null));
  };

  /**
   * 좌표로 지도 카메라 이동
   */
  const moveToCoordinates = (lat: number, lng: number) => {
    mapRef.current?.animateCameraTo({
      latitude: lat,
      longitude: lng,
      zoom: 15,
      duration: 300,
    });
  };

  return {
    location,
    isLoadingLocation,
    isGeocoding,
    mapRef,
    getCurrentLocation, // 명시적으로 호출하여 권한 요청
    handleCameraChange,
    updateDetailAddress,
    moveToCoordinates,
  };
}

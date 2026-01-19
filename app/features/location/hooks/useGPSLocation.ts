/**
 * useGPSLocation Hook
 *
 * GPS 위치 감지 및 역지오코딩 Hook
 */

import { useState, useCallback } from 'react';
import type { DetectedLocation, GPSError } from '../types/location.types';
import {
  getCurrentLocation,
  reverseGeocode,
  isLocationSupported,
} from '../services/locationService';

export function useGPSLocation() {
  const [detectedLocation, setDetectedLocation] = useState<
    DetectedLocation | undefined
  >();
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<GPSError | undefined>();

  /**
   * 위치 감지 및 역지오코딩
   */
  const detectLocation = useCallback(async (): Promise<
    DetectedLocation | undefined
  > => {
    setIsDetecting(true);
    setError(undefined);

    try {
      // Step 1: GPS 좌표 가져오기
      if (__DEV__) console.log('[useGPSLocation] Getting GPS coordinates...');
      const coords = await getCurrentLocation();

      // Step 2: 역지오코딩 (좌표 → 주소)
      if (__DEV__) console.log('[useGPSLocation] Reverse geocoding...');
      const neighborhood = await reverseGeocode(
        coords.latitude,
        coords.longitude
      );

      // Step 3: 지원 지역 확인
      if (__DEV__) console.log('[useGPSLocation] Checking if location is supported...');
      const supported = await isLocationSupported(neighborhood.neighborhood);

      if (!supported) {
        setError('UNSUPPORTED_AREA');
        return undefined;
      }

      // Step 4: 감지된 위치 저장
      const location: DetectedLocation = {
        ...neighborhood,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      };

      setDetectedLocation(location);
      if (__DEV__) console.log('[useGPSLocation] Location detected:', location.neighborhood);

      return location;
    } catch (err: any) {
      console.error('[useGPSLocation] Detection error:', err);

      // 에러 타입 분류
      const errorMessage = err.message || '';
      if (errorMessage.includes('LOCATION_UNAVAILABLE')) {
        setError('LOCATION_UNAVAILABLE');
      } else if (errorMessage.includes('GEOCODING_FAILED')) {
        setError('GEOCODING_FAILED');
      } else if (errorMessage.includes('TIMEOUT')) {
        setError('TIMEOUT');
      } else {
        setError('NETWORK_ERROR');
      }

      return undefined;
    } finally {
      setIsDetecting(false);
    }
  }, []);

  /**
   * 재시도
   */
  const retry = useCallback(() => {
    return detectLocation();
  }, [detectLocation]);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    detectedLocation,
    isDetecting,
    error,
    detectLocation,
    retry,
    clearError,
  };
}

/**
 * Unified Location Hook
 *
 * GPS 감지 + 수동 검색 + 범위 선택을 통합 관리하는 훅
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { LocationData } from '@/app/shared/types/auth.types';
import type { GPSError, NeighborhoodData } from '../types/location.types';
import { useAuth } from '@/app/shared/contexts';
import { useLocationPermission } from './useLocationPermission';
import { useGPSLocation } from './useGPSLocation';
import { getCurrentLocation, reverseGeocode } from '../services/locationService';
import { geocodeAddress } from '@/app/shared/utils/geocoding';
import { parseNeighborhoodData, parseGeocodingResult } from '@/app/shared/utils/locationParser';

export type LocationMode = 'gps' | 'manual';
export type LocationStep =
  | 'permission-request'
  | 'detecting'
  | 'location-set'
  | 'range-selection'
  | 'confirmation';

interface UnifiedLocationState {
  mode: LocationMode;
  step: LocationStep;
  location: LocationData | null;
  selectedRange: 2 | 5 | 10;
  isLoading: boolean;
  error: GPSError | null;
}

interface UseUnifiedLocationReturn extends UnifiedLocationState {
  // GPS 관련
  detectGPSLocation: () => Promise<void>;
  retryGPS: () => Promise<void>;

  // 수동 검색 관련
  searchAddress: (query: string) => Promise<void>;
  switchToManualMode: () => void;
  switchToGPSMode: () => void;

  // 범위 선택
  selectRange: (range: 2 | 5 | 10) => void;

  // 최종 확인 및 저장
  confirmAndSave: () => Promise<void>;

  // 네비게이션
  goBack: () => void;
}

export function useUnifiedLocation(): UseUnifiedLocationReturn {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signup, updateLocation, user } = useAuth();

  const {
    status: permissionStatus,
    requestPermission,
    checkPermission,
  } = useLocationPermission();

  const [state, setState] = useState<UnifiedLocationState>({
    mode: 'gps',
    step: 'permission-request',
    location: null,
    selectedRange: 5,
    isLoading: false,
    error: null,
  });

  const isFromSignup = params.fromSignup === 'true';
  const phone = params.phone as string | undefined;

  /**
   * 초기 상태 로그
   */
  useEffect(() => {
    if (__DEV__) console.log('[UnifiedLocation] Initial state:', {
      mode: state.mode,
      step: state.step,
      selectedRange: state.selectedRange,
      hasLocation: !!state.location,
    });
  }, []);

  /**
   * 동네 검색에서 돌아온 경우 처리
   */
  useEffect(() => {
    if (params.mode === 'manual' && params.lat && params.lng) {
      if (__DEV__) console.log('[UnifiedLocation] Loading location from search params:', params);

      const locationData: LocationData = {
        address: (params.address as string) || '',
        neighborhood: (params.neighborhood as string) || '',
        city: (params.city as string) || '',
        district: (params.district as string) || '',
        latitude: parseFloat(params.lat as string),
        longitude: parseFloat(params.lng as string),
        range: state.selectedRange,
        verified: false,
        gpsVerified: false,
      };

      setState(prev => ({
        ...prev,
        mode: 'manual',
        step: 'location-set',
        location: locationData,
      }));
    }
  }, [params.mode, params.lat, params.lng, params.address, params.neighborhood, params.city, params.district]);

  /**
   * 초기 GPS 시도 (동네 검색에서 돌아온 경우가 아닐 때만)
   */
  useEffect(() => {
    // 동네 검색에서 돌아온 경우 GPS 초기화 건너뛰기
    if (params.mode === 'manual' && params.lat && params.lng) {
      return;
    }

    const initializeGPS = async () => {
      const status = await checkPermission();

      if (status === 'granted') {
        // 권한이 이미 있으면 GPS 감지 시작
        setState(prev => ({ ...prev, step: 'detecting' }));
        await detectGPSLocation();
      } else if (status === 'undetermined') {
        // 권한 미결정 상태
        setState(prev => ({ ...prev, step: 'permission-request' }));
      } else {
        // 권한 거부 → 수동 모드로 전환 (에러 표시 안 함)
        setState(prev => ({
          ...prev,
          mode: 'manual',
          step: 'location-set',
          error: null, // 에러 표시하지 않음
        }));
      }
    };

    initializeGPS();
  }, []);

  /**
   * GPS 위치 감지
   */
  const detectGPSLocation = useCallback(async () => {
    setState(prev => ({ ...prev, step: 'detecting', isLoading: true, error: null }));

    try {
      // 1단계: 권한 확인 및 요청
      if (__DEV__) console.log('[UnifiedLocation] Checking location permission...');
      const permissionGranted = await requestPermission();

      if (!permissionGranted) {
        console.warn('[UnifiedLocation] Location permission denied');
        throw new Error('PERMISSION_DENIED');
      }

      if (__DEV__) console.log('[UnifiedLocation] Permission granted, getting GPS location...');

      // 2단계: GPS 좌표 가져오기
      const coords = await getCurrentLocation();

      // 3단계: 역지오코딩으로 주소 변환
      const neighborhood = await reverseGeocode(coords.latitude, coords.longitude);

      // 4단계: LocationData로 변환
      const locationData = parseNeighborhoodData(neighborhood, coords, {
        defaultRange: state.selectedRange,
        gpsVerified: true,
      });

      setState(prev => ({
        ...prev,
        location: locationData,
        step: 'location-set', // 바로 지도 표시
        isLoading: false,
      }));
    } catch (error) {
      console.error('[UnifiedLocation] GPS detection failed:', error);

      // 권한 거부 또는 GPS 실패 → 수동 모드로 자동 전환
      setState(prev => ({
        ...prev,
        mode: 'manual',
        step: 'location-set',
        error: null, // 에러 표시하지 않고 수동 모드로 전환
        isLoading: false,
      }));
    }
  }, [state.selectedRange, requestPermission]);

  /**
   * GPS 재시도
   */
  const retryGPS = useCallback(async () => {
    setState(prev => ({ ...prev, mode: 'gps', error: null }));
    await detectGPSLocation();
  }, [detectGPSLocation]);

  /**
   * 주소 검색 (수동 모드)
   */
  const searchAddress = useCallback(async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await geocodeAddress(query);

      if (!result) {
        throw new Error('주소를 찾을 수 없습니다');
      }

      // LocationData로 변환
      const locationData = parseGeocodingResult(result, {
        defaultRange: state.selectedRange,
      });

      setState(prev => ({
        ...prev,
        location: locationData,
        step: 'location-set', // 바로 지도 표시
        isLoading: false,
      }));
    } catch (error) {
      console.error('[UnifiedLocation] Address search failed:', error);

      setState(prev => ({
        ...prev,
        error: 'GEOCODING_FAILED',
        isLoading: false,
      }));
    }
  }, [state.selectedRange]);

  /**
   * 수동 모드로 전환
   */
  const switchToManualMode = useCallback(() => {
    setState(prev => ({ ...prev, mode: 'manual', step: 'location-set', error: null }));
  }, []);

  /**
   * GPS 모드로 전환
   */
  const switchToGPSMode = useCallback(async () => {
    setState(prev => ({ ...prev, mode: 'gps', error: null }));
    await detectGPSLocation();
  }, [detectGPSLocation]);

  /**
   * 범위 선택
   */
  const selectRange = useCallback((range: 2 | 5 | 10) => {
    if (__DEV__) console.log('[UnifiedLocation] Range selected:', range);
    setState(prev => ({
      ...prev,
      selectedRange: range,
      location: prev.location ? { ...prev.location, range } : null,
    }));
  }, []);

  /**
   * 최종 확인 및 저장
   */
  const confirmAndSave = useCallback(async () => {
    if (!state.location) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const finalLocation: LocationData = {
        ...state.location,
        range: state.selectedRange,
        gpsVerified: state.mode === 'gps',
        verified: true,
      };

      if (isFromSignup && phone) {
        // 회원가입 플로우
        const result = await signup(phone, finalLocation);

        if (result.success) {
          router.dismissAll();
          router.replace('/(tabs)');
        } else {
          throw new Error(result.error || '회원가입에 실패했습니다');
        }
      } else {
        // 위치 재설정 플로우
        const success = await updateLocation(finalLocation);

        if (success) {
          // 스택 구조: 내 정보 → location-setting (현재)
          // 단순히 한 번의 back()으로 내 정보로 복귀
          router.back();
        } else {
          throw new Error('위치 설정에 실패했습니다');
        }
      }
    } catch (error) {
      console.error('[UnifiedLocation] Save failed:', error);
      alert(error instanceof Error ? error.message : '오류가 발생했습니다');
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.location, state.selectedRange, state.mode, isFromSignup, phone, signup, updateLocation, router]);

  /**
   * 뒤로 가기
   */
  const goBack = useCallback(() => {
    if (isFromSignup) {
      router.replace('/onboarding');
    } else {
      router.back();
    }
  }, [isFromSignup, router]);

  return {
    ...state,
    detectGPSLocation,
    retryGPS,
    searchAddress,
    switchToManualMode,
    switchToGPSMode,
    selectRange,
    confirmAndSave,
    goBack,
  };
}

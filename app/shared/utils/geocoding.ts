/**
 * Geocoding Utility
 *
 * 주소 ↔ 좌표 변환 유틸리티
 * Naver Map API 사용
 * - 캐싱으로 API 호출 최소화
 * - 최근 검색 결과 캐싱 (최대 50개)
 */

import { ENV } from '../config/env';
import {
  reverseGeocodeWithNaver,
  geocodeWithNaver,
} from '@/app/features/location/services/naverGeocodingService';

/**
 * 캐시 관리
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5분
const MAX_CACHE_SIZE = 50;

const geocodingCache = new Map<string, CacheEntry<GeocodingResult>>();
const reverseGeocodingCache = new Map<string, CacheEntry<string>>();

/**
 * 캐시에서 값 가져오기
 */
function getCachedValue<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string
): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  // 캐시 유효기간 확인
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * 캐시에 값 저장
 */
function setCachedValue<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: T
): void {
  // 캐시 크기 제한
  if (cache.size >= MAX_CACHE_SIZE) {
    // 가장 오래된 항목 삭제
    const firstKey = cache.keys().next().value;
    if (firstKey) {
      cache.delete(firstKey);
    }
  }

  cache.set(key, {
    data: value,
    timestamp: Date.now(),
  });
}


/**
 * 주소 → 좌표 변환 결과 타입
 */
export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
}

/**
 * 주소를 좌표로 변환 (Geocoding)
 * 캐싱으로 API 호출 최소화
 *
 * @param address - 검색할 주소 또는 장소명
 * @returns 좌표 및 주소 정보
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  // 캐시 확인
  const cacheKey = `geocode:${address.toLowerCase()}`;
  const cached = getCachedValue(geocodingCache, cacheKey);
  if (cached) {
    if (__DEV__) console.log('[Geocoding] Cache hit:', address);
    return cached;
  }

  try {
    const result = await geocodeWithNaver(address);

    if (!result) {
      if (__DEV__) console.log('[Geocoding] No results found for:', address);
      return null;
    }

    const geocodingResult = {
      latitude: result.latitude,
      longitude: result.longitude,
      address: result.address,
    };

    // 캐시에 저장
    setCachedValue(geocodingCache, cacheKey, geocodingResult);

    return geocodingResult;
  } catch (error) {
    console.error('[Geocoding] Failed:', error);
    throw error;
  }
}

/**
 * 좌표를 주소로 변환 (Reverse Geocoding)
 * 캐싱으로 API 호출 최소화
 *
 * @param latitude - 위도
 * @param longitude - 경도
 * @returns 주소 문자열
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  // 좌표를 소수점 4자리로 반올림하여 캐시 키 생성
  const lat = latitude.toFixed(4);
  const lng = longitude.toFixed(4);
  const cacheKey = `reverse:${lat},${lng}`;

  // 캐시 확인
  const cached = getCachedValue(reverseGeocodingCache, cacheKey);
  if (cached) {
    if (__DEV__) console.log('[Geocoding] Reverse cache hit:', { lat, lng });
    return cached;
  }

  try {
    const result = await reverseGeocodeWithNaver(latitude, longitude);

    // 캐시에 저장
    setCachedValue(reverseGeocodingCache, cacheKey, result.fullAddress);

    return result.fullAddress;
  } catch (error) {
    console.error('[Geocoding] Reverse geocoding failed:', error);
    // 폴백: 좌표만 표시
    const fallback = `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`;
    return fallback;
  }
}

/**
 * 캐시 초기화 (메모리 관리)
 */
export function clearGeocodingCache(): void {
  geocodingCache.clear();
  reverseGeocodingCache.clear();
  if (__DEV__) console.log('[Geocoding] Cache cleared');
}

/**
 * API 키 유효성 확인
 */
export function hasGeocodingApiKey(): boolean {
  return (
    !!ENV.NAVER_MAP_CLIENT_ID &&
    !!ENV.NAVER_MAP_CLIENT_SECRET &&
    ENV.NAVER_MAP_CLIENT_ID !== 'your_client_id_here' &&
    ENV.NAVER_MAP_CLIENT_SECRET !== 'your_client_secret_here'
  );
}

/**
 * Location Parser Utility
 *
 * Naver API 응답을 표준 LocationData로 변환하는 유틸리티
 */

import type { LocationData } from '../types/auth.types';
import type {
  NeighborhoodData,
  GPSCoordinates,
} from '@/app/features/location/types/location.types';
import type { GeocodingResult } from './geocoding';
import { extractNeighborhood } from './addressUtils';

interface ParseLocationOptions {
  defaultRange?: 2 | 5 | 10;
  gpsVerified?: boolean;
}

/**
 * Naver API 역지오코딩 결과를 LocationData로 변환
 *
 * @param data - Naver API 역지오코딩 응답 (NeighborhoodData)
 * @param coords - GPS 좌표 정보
 * @param options - 추가 옵션 (기본 범위, GPS 검증 여부)
 * @returns 표준 LocationData 객체
 */
export function parseNeighborhoodData(
  data: NeighborhoodData,
  coords: GPSCoordinates,
  options?: ParseLocationOptions
): LocationData {
  const defaultRange = options?.defaultRange || 5;
  const gpsVerified = options?.gpsVerified !== undefined ? options.gpsVerified : true;

  return {
    address: data.fullAddress,
    neighborhood: data.neighborhood || extractNeighborhood(data.fullAddress) || '',
    city: data.city || '',
    district: data.district || '',
    latitude: coords.latitude,
    longitude: coords.longitude,
    verified: true,
    range: defaultRange,
    gpsVerified,
    detectedAt: new Date().toISOString(),
    accuracy: coords.accuracy,
  };
}

/**
 * Naver API 지오코딩 결과를 LocationData로 변환
 *
 * @param result - Naver API 지오코딩 응답 (GeocodingResult)
 * @param options - 추가 옵션 (기본 범위)
 * @returns 표준 LocationData 객체 (neighborhood/city/district는 주소에서 추출)
 */
export function parseGeocodingResult(
  result: GeocodingResult,
  options?: ParseLocationOptions
): LocationData {
  const defaultRange = options?.defaultRange || 5;
  const neighborhood = extractNeighborhood(result.address);

  // 주소를 공백으로 분리하여 city와 district 추출 시도
  const addressParts = result.address.split(' ');
  let city = '';
  let district = '';

  if (addressParts.length >= 2) {
    city = addressParts[0]; // 첫 번째: 시/도
    district = addressParts[1]; // 두 번째: 구/군
  }

  return {
    address: result.address,
    neighborhood: neighborhood || '',
    city,
    district,
    latitude: result.latitude,
    longitude: result.longitude,
    verified: true,
    range: defaultRange,
    gpsVerified: false, // 수동 검색이므로 GPS 검증 아님
  };
}

/**
 * 동네명 유효성 검증
 *
 * @param neighborhood - 검증할 동네명
 * @returns 유효하면 true, 아니면 false
 */
export function validateNeighborhood(neighborhood: string): boolean {
  if (!neighborhood || neighborhood.trim().length === 0) {
    return false;
  }

  // 동네명 패턴: "동", "읍", "면"으로 끝나는 경우
  const neighborhoodPattern = /[가-힣]+(동|읍|면)$/;
  return neighborhoodPattern.test(neighborhood);
}

/**
 * LocationData 객체 유효성 검증
 *
 * @param data - 검증할 LocationData 객체
 * @returns 유효하면 true, 아니면 false
 */
export function validateLocationData(data: LocationData): boolean {
  // 필수 필드 확인
  if (!data.address || !data.neighborhood || !data.city || !data.district) {
    return false;
  }

  // 좌표 유효성 확인
  if (
    typeof data.latitude !== 'number' ||
    typeof data.longitude !== 'number' ||
    isNaN(data.latitude) ||
    isNaN(data.longitude)
  ) {
    return false;
  }

  // 한국 좌표 범위 확인 (대략적)
  // 위도: 33.0 ~ 38.5, 경도: 124.5 ~ 131.9
  if (
    data.latitude < 33.0 ||
    data.latitude > 38.5 ||
    data.longitude < 124.5 ||
    data.longitude > 131.9
  ) {
    return false;
  }

  // 범위 유효성 확인
  if (![2, 5, 10].includes(data.range)) {
    return false;
  }

  return true;
}

/**
 * 기존 LocationData에 누락된 필드를 채우는 마이그레이션 헬퍼
 *
 * @param oldData - 기존 LocationData (일부 필드 누락 가능)
 * @returns 모든 필드가 채워진 LocationData
 */
export function migrateLocationData(oldData: Partial<LocationData>): LocationData | null {
  if (!oldData.address || !oldData.latitude || !oldData.longitude) {
    return null;
  }

  const neighborhood = oldData.neighborhood || extractNeighborhood(oldData.address) || '';
  const addressParts = oldData.address.split(' ');
  const city = oldData.city || (addressParts.length >= 1 ? addressParts[0] : '');
  const district = oldData.district || (addressParts.length >= 2 ? addressParts[1] : '');
  const range = oldData.range || 5;

  return {
    address: oldData.address,
    neighborhood,
    city,
    district,
    latitude: oldData.latitude,
    longitude: oldData.longitude,
    verified: oldData.verified !== undefined ? oldData.verified : true,
    range,
    gpsVerified: oldData.gpsVerified,
    detectedAt: oldData.detectedAt,
    accuracy: oldData.accuracy,
  };
}

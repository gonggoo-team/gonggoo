/**
 * Geocoding Utility
 *
 * 주소 ↔ 좌표 변환 유틸리티
 * Kakao Local API 사용
 */

import { ENV } from '../config/env';
import { reverseGeocodeWithKakao } from '@/app/features/location/services/kakaoGeocodingService';

/**
 * Kakao Local API - 주소 검색 응답 타입
 */
interface KakaoAddressSearchResponse {
  meta: {
    total_count: number;
  };
  documents: Array<{
    address_name: string;
    address_type: 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';
    x: string; // 경도
    y: string; // 위도
    address?: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
    };
    road_address?: {
      address_name: string;
      region_1depth_name: string;
      region_2depth_name: string;
      region_3depth_name: string;
    };
  }>;
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
 *
 * @param address - 검색할 주소 또는 장소명
 * @returns 좌표 및 주소 정보
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult | null> {
  const apiKey = ENV.KAKAO_REST_API_KEY;

  if (!apiKey) {
    console.error('[Geocoding] Kakao API key is missing');
    throw new Error('KAKAO_API_KEY_MISSING');
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('[Geocoding] API error:', response.status, response.statusText);
      throw new Error('GEOCODING_API_ERROR');
    }

    const data: KakaoAddressSearchResponse = await response.json();

    if (!data.documents || data.documents.length === 0) {
      console.log('[Geocoding] No results found for:', address);
      return null;
    }

    const result = data.documents[0];
    const latitude = parseFloat(result.y);
    const longitude = parseFloat(result.x);
    const addressName = result.address_name || result.road_address?.address_name || address;

    console.log('[Geocoding] Success:', { latitude, longitude, address: addressName });

    return {
      latitude,
      longitude,
      address: addressName,
    };
  } catch (error) {
    console.error('[Geocoding] Failed:', error);
    throw error;
  }
}

/**
 * 좌표를 주소로 변환 (Reverse Geocoding)
 *
 * @param latitude - 위도
 * @param longitude - 경도
 * @returns 주소 문자열
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const result = await reverseGeocodeWithKakao(latitude, longitude);
    return result.fullAddress;
  } catch (error) {
    console.error('[Geocoding] Reverse geocoding failed:', error);
    // 폴백: 좌표만 표시
    return `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`;
  }
}

/**
 * API 키 유효성 확인
 */
export function hasGeocodingApiKey(): boolean {
  return !!ENV.KAKAO_REST_API_KEY && ENV.KAKAO_REST_API_KEY !== 'your_kakao_rest_api_key_here';
}

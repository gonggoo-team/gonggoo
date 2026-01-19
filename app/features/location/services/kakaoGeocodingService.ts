/**
 * Kakao Local API - Geocoding Service
 *
 * Kakao 역지오코딩 API를 사용하여 GPS 좌표를 주소로 변환
 * https://developers.kakao.com/docs/latest/ko/local/dev-guide
 */

import { ENV } from '@/app/shared/config/env';
import type { NeighborhoodData } from '../types/location.types';

const KAKAO_API_BASE_URL = 'https://dapi.kakao.com';

/**
 * Kakao API 응답 타입
 */
interface KakaoGeocodingResponse {
  meta: {
    total_count: number;
  };
  documents: Array<{
    address?: {
      address_name: string;
      region_1depth_name: string; // 시/도
      region_2depth_name: string; // 구/군
      region_3depth_name: string; // 법정동
      region_3depth_h_name: string; // 행정동
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
 * Kakao API를 사용한 역지오코딩
 *
 * @param latitude - 위도
 * @param longitude - 경도
 * @returns 동네 정보
 */
export async function reverseGeocodeWithKakao(
  latitude: number,
  longitude: number
): Promise<NeighborhoodData> {
  const apiKey = ENV.KAKAO_REST_API_KEY;

  if (!apiKey) {
    throw new Error('KAKAO_API_KEY_MISSING');
  }

  try {
    const url = `${KAKAO_API_BASE_URL}/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('[Kakao] API error:', response.status, response.statusText);
      throw new Error('KAKAO_API_ERROR');
    }

    const data: KakaoGeocodingResponse = await response.json();

    if (!data.documents || data.documents.length === 0) {
      throw new Error('KAKAO_NO_RESULTS');
    }

    const document = data.documents[0];
    const address = document.address;

    if (!address) {
      throw new Error('KAKAO_NO_ADDRESS');
    }

    // 행정동 우선 사용, 없으면 법정동 사용
    const neighborhood = address.region_3depth_h_name || address.region_3depth_name;
    const district = address.region_2depth_name;
    const city = address.region_1depth_name;

    if (__DEV__) console.log('[Kakao] Geocoding success:', { city, district, neighborhood });

    return {
      neighborhood,
      fullAddress: `${city} ${district} ${neighborhood}`,
      city,
      district,
    };
  } catch (error) {
    console.error('[Kakao] Geocoding failed:', error);
    throw error;
  }
}

/**
 * API 키 유효성 확인
 */
export function hasKakaoApiKey(): boolean {
  return !!ENV.KAKAO_REST_API_KEY && ENV.KAKAO_REST_API_KEY !== 'your_kakao_rest_api_key_here';
}

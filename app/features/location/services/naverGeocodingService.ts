/**
 * Naver Reverse Geocoding Service
 *
 * 네이버 역지오코딩 API를 사용하여 GPS 좌표를 주소로 변환
 * https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding-gc
 */

import { ENV } from '@/app/shared/config/env';
import type { NeighborhoodData } from '../types/location.types';

const NAVER_REVERSE_GEOCODE_URL =
  'https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc';

/**
 * 네이버 역지오코딩 API 응답 타입
 */
interface NaverReverseGeocodeResponse {
  status: {
    code: number;
    name: string;
    message: string;
  };
  results: Array<{
    name: string;
    code: {
      id: string;
      type: string;
      mappingId: string;
    };
    region: {
      area0: { name: string }; // 국가
      area1: { name: string; alias?: string }; // 시/도
      area2: { name: string }; // 구/군
      area3: { name: string }; // 읍/면/동
      area4: { name: string }; // 리
    };
    land?: {
      type: string;
      number1: string;
      number2: string;
      addition0: { type: string; value: string };
      addition1: { type: string; value: string };
      addition2: { type: string; value: string };
      addition3: { type: string; value: string };
      addition4: { type: string; value: string };
    };
  }>;
}

/**
 * 네이버 API를 사용한 역지오코딩
 *
 * @param latitude - 위도
 * @param longitude - 경도
 * @returns 동네 정보
 */
export async function reverseGeocodeWithNaver(
  latitude: number,
  longitude: number
): Promise<NeighborhoodData> {
  const clientId = ENV.NAVER_MAP_CLIENT_ID;
  const clientSecret = ENV.NAVER_MAP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('NAVER_API_KEY_MISSING');
  }

  try {
    // 네이버 API는 경도,위도 순서
    const coords = `${longitude},${latitude}`;
    const url = `${NAVER_REVERSE_GEOCODE_URL}?coords=${coords}&output=json&orders=roadaddr,addr`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });

    if (!response.ok) {
      console.error('[Naver] API error:', response.status, response.statusText);
      throw new Error('NAVER_API_ERROR');
    }

    const data: NaverReverseGeocodeResponse = await response.json();
    if (__DEV__) {
      console.log('[Naver] URL:', url);
      console.log('[Naver] Coords:', coords);
      console.log('[Naver] Response:', data);
    }
    if (data.status.code !== 0) {
      console.error('[Naver] API status error:', data.status);
      throw new Error('NAVER_API_STATUS_ERROR');
    }
    
    if (!data.results || data.results.length === 0) {
      throw new Error('NAVER_NO_RESULTS');
    }

    // 첫 번째 결과 사용 (roadaddr 우선, 없으면 addr)
    const result = data.results[0];
    const region = result.region;

    // 시/도, 구/군, 동
    const city = region.area1.name; // 예: 서울특별시
    const district = region.area2.name; // 예: 강남구
    const neighborhood = region.area3.name; // 예: 역삼동

    const fullAddress = `${city} ${district} ${neighborhood}`.trim();

    if (__DEV__) console.log('[Naver] Reverse geocoding success:', {
      city,
      district,
      neighborhood,
      fullAddress,
    });

    return {
      neighborhood,
      fullAddress,
      city,
      district,
    };
  } catch (error) {
    console.error('[Naver] Reverse geocoding failed:', error);
    throw error;
  }
}

/**
 * 주소 검색 (Geocoding)
 *
 * @param query - 검색할 주소
 * @returns 좌표 정보
 */
export async function geocodeWithNaver(
  query: string
): Promise<{ latitude: number; longitude: number; address: string } | null> {
  const clientId = ENV.NAVER_MAP_CLIENT_ID;
  const clientSecret = ENV.NAVER_MAP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('NAVER_API_KEY_MISSING');
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedQuery}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });
    
    if (!response.ok) {
      console.error('[Naver] Geocode API error:', response.status, response.statusText);
      throw new Error('NAVER_GEOCODE_API_ERROR');
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.addresses || data.addresses.length === 0) {
      if (__DEV__) console.log('[Naver] No geocode results found for:', query);
      return null;
    }

    const result = data.addresses[0];
    const latitude = parseFloat(result.y);
    const longitude = parseFloat(result.x);
    const address = result.roadAddress || result.jibunAddress || query;

    if (__DEV__) console.log('[Naver] Geocoding success:', { latitude, longitude, address });

    return {
      latitude,
      longitude,
      address,
    };
  } catch (error) {
    console.error('[Naver] Geocoding failed:', error);
    throw error;
  }
}

/**
 * 동네 검색 결과 타입
 */
export interface NeighborhoodSearchResult {
  id: string; // unique identifier (address 기반)
  fullAddress: string; // 전체 주소
  roadAddress: string; // 도로명 주소
  jibunAddress: string; // 지번 주소
  neighborhood: string; // 동네명 (역지오코딩으로 추출 필요)
  city: string; // 시/도 (역지오코딩으로 추출 필요)
  district: string; // 구/군 (역지오코딩으로 추출 필요)
  latitude: number;
  longitude: number;
}

/**
 * 동네 검색 (여러 결과 반환)
 *
 * @param query - 검색할 주소 또는 동네명
 * @returns 검색 결과 배열
 */
export async function searchNeighborhoods(
  query: string
): Promise<NeighborhoodSearchResult[]> {
  const clientId = ENV.NAVER_MAP_CLIENT_ID;
  const clientSecret = ENV.NAVER_MAP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('NAVER_API_KEY_MISSING');
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedQuery}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });

    if (!response.ok) {
      console.error('[Naver] Search API error:', response.status, response.statusText);
      throw new Error('NAVER_SEARCH_API_ERROR');
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.addresses || data.addresses.length === 0) {
      if (__DEV__) console.log('[Naver] No search results found for:', query);
      return [];
    }

    // 모든 결과를 반환하되, 최대 10개로 제한
    const results = await Promise.all(
      data.addresses.slice(0, 10).map(async (address: any) => {
        const latitude = parseFloat(address.y);
        const longitude = parseFloat(address.x);
        const roadAddress = address.roadAddress || '';
        const jibunAddress = address.jibunAddress || '';
        const fullAddress = roadAddress || jibunAddress;

        // 역지오코딩으로 동네명 추출
        try {
          const neighborhoodData = await reverseGeocodeWithNaver(latitude, longitude);

          return {
            id: fullAddress, // 주소를 ID로 사용
            fullAddress,
            roadAddress,
            jibunAddress,
            neighborhood: neighborhoodData.neighborhood,
            city: neighborhoodData.city,
            district: neighborhoodData.district,
            latitude,
            longitude,
          };
        } catch (error) {
          console.error('[Naver] Reverse geocoding failed for result:', error);
          // 역지오코딩 실패 시 기본값 사용
          return {
            id: fullAddress,
            fullAddress,
            roadAddress,
            jibunAddress,
            neighborhood: '',
            city: '',
            district: '',
            latitude,
            longitude,
          };
        }
      })
    );

    if (__DEV__) console.log('[Naver] Search success:', results.length, 'results');
    return results;
  } catch (error) {
    console.error('[Naver] Search failed:', error);
    throw error;
  }
}

/**
 * API 키 유효성 확인
 */
export function hasNaverApiKey(): boolean {
  return (
    !!ENV.NAVER_MAP_CLIENT_ID &&
    !!ENV.NAVER_MAP_CLIENT_SECRET &&
    ENV.NAVER_MAP_CLIENT_ID !== 'your_client_id_here' &&
    ENV.NAVER_MAP_CLIENT_SECRET !== 'your_client_secret_here'
  );
}

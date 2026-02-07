/**
 * Static Map Utilities
 *
 * Naver Static Map API를 사용하여 정적 지도 이미지 URL을 생성합니다.
 * 읽기 모드(TransactionInfoSection)에서 비용 절감을 위해 사용됩니다.
 *
 * API Docs: https://api.ncloud-docs.com/docs/ai-naver-mapsstatic-raster
 */

import { ENV } from '@/app/shared/config/env';

export interface StaticMapParams {
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 이미지 너비 (픽셀) */
  width?: number;
  /** 이미지 높이 (픽셀) */
  height?: number;
  /** 줌 레벨 (0-20) */
  zoom?: number;
  /** 마커 크기 */
  markerSize?: 'tiny' | 'small' | 'mid' | 'large';
}

/**
 * Naver Static Map API URL 생성
 *
 * @param params - 지도 파라미터
 * @returns Static Map 이미지 URL
 * @throws API 키가 없을 경우 에러
 *
 * @example
 * ```typescript
 * const imageUrl = generateNaverStaticMapUrl({
 *   latitude: 37.5665,
 *   longitude: 126.9780,
 *   width: 600,
 *   height: 400,
 *   zoom: 15,
 *   markerSize: 'mid'
 * });
 * ```
 */
export async function generateNaverStaticMapUrl(params: StaticMapParams): Promise<any> {
  const {
    latitude,
    longitude,
    width = 600,
    height = 400,
    zoom = 15,
    markerSize = 'mid',
  } = params;

  const clientId = ENV.NAVER_MAP_CLIENT_ID;
  const clientSecret = ENV.NAVER_MAP_CLIENT_SECRET;

  if (!clientId) {
    console.error('[StaticMapUtils] NAVER_MAP_CLIENT_ID is not configured');
    throw new Error('NAVER_MAP_CLIENT_ID is required for static maps');
  }

  // 좌표 검증
  if (latitude < -90 || latitude > 90) {
    throw new Error(`Invalid latitude: ${latitude}. Must be between -90 and 90`);
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error(`Invalid longitude: ${longitude}. Must be between -180 and 180`);
  }

  // URL 파라미터 구성
  // center: 경도,위도 (Naver API는 경도,위도 순서)
  const center = `center=${longitude},${latitude}`;

  // level: 줌 레벨 (0-20)
  const level = `level=${Math.max(0, Math.min(20, zoom))}`;

  // w, h: 이미지 크기
  const size = `w=${width}&h=${height}`;

  // markers: 마커 설정 (size:크기|pos:경도 위도)
  const markers = `markers=size:${markerSize}|pos:${longitude}%20${latitude}`;

  // Naver Static Map API 엔드포인트
  const baseUrl = 'https://maps.apigw.ntruss.com/map-static/v2/raster';
  
  const url = `${baseUrl}?${center}&${level}&${size}&${markers}&X-NCP-APIGW-API-KEY-ID=${clientId}`
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    });
  const data = await response.json();
  if (__DEV__) console.log('[StaticMap] Response:', data);
  
  return '';`${baseUrl}?${center}&${level}&${size}&${markers}&X-NCP-APIGW-API-KEY-ID=${clientId}&`;
}

/**
 * Static Map URL이 유효한지 확인
 *
 * @returns API 키가 설정되어 있으면 true
 */
export function canUseStaticMap(): boolean {
  return !!ENV.NAVER_MAP_CLIENT_ID;
}

/**
 * React Native Image 컴포넌트용 Source 객체 생성
 * API 호출을 위한 헤더 정보를 포함합니다.
 */
export function getNaverStaticMapSource(params: StaticMapParams) {
  const {
    latitude,
    longitude,
    width = 600,
    height = 400,
    zoom = 15,
    markerSize = 'mid',
  } = params;

  const clientId = ENV.NAVER_MAP_CLIENT_ID;
  const clientSecret = ENV.NAVER_MAP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[StaticMapUtils] Credentials are missing');
    // 에러 발생 시 빈 객체 혹은 에러 처리
    return { uri: '' };
  }

  // URL 파라미터 구성
  const center = `center=${longitude},${latitude}`;
  const level = `level=${Math.max(0, Math.min(20, zoom))}`;
  const size = `w=${width}&h=${height}`;
  const markers = `markers=size:${markerSize}|pos:${longitude}%20${latitude}`;
  
  // CORS 엔드포인트가 아닌 기본 엔드포인트 사용 권장 (Native 앱에서는 CORS 제약 없음)
  const baseUrl = 'https://maps.apigw.ntruss.com/map-static/v2/raster';  

  const url = `${baseUrl}?${center}&${level}&${size}&${markers}`;

  // React Native Image Source 객체 반환
  return {
    uri: url,
    headers: {
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
    },
  };
}
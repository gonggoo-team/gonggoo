/**
 * Map Deep Link Utilities
 *
 * 네이버 지도, 카카오맵 앱을 여는 딥링크 유틸리티입니다.
 * TransactionInfoSection에서 정적 지도 이미지 클릭 시 사용됩니다.
 */

import { Linking, Platform, Alert } from 'react-native';

export interface MapDeepLinkParams {
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 주소 (선택) */
  address?: string;
  /** 장소명 (선택) */
  placeName?: string;
}

/**
 * 네이버 지도 딥링크 생성
 *
 * @param params - 지도 파라미터
 * @returns 네이버 지도 딥링크 URL
 *
 * @example
 * ```typescript
 * const naverLink = generateNaverMapDeepLink({
 *   latitude: 37.5665,
 *   longitude: 126.9780,
 *   placeName: '서울시청'
 * });
 * // nmap://place?lat=37.5665&lng=126.9780&name=%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD&appname=com.neighbors
 * ```
 */
export function generateNaverMapDeepLink(params: MapDeepLinkParams): string {
  const { latitude, longitude, address, placeName } = params;
  const name = encodeURIComponent(placeName || address || '위치');

  // iOS와 Android 모두 동일한 URL Scheme 사용
  return `nmap://place?lat=${latitude}&lng=${longitude}&name=${name}&appname=com.neighbors`;
}

/**
 * 카카오맵 딥링크 생성
 *
 * @param params - 지도 파라미터
 * @returns 카카오맵 딥링크 URL
 *
 * @example
 * ```typescript
 * const kakaoLink = generateKakaoMapDeepLink({
 *   latitude: 37.5665,
 *   longitude: 126.9780,
 *   placeName: '서울시청'
 * });
 * // kakaomap://look?p=37.5665,126.9780&name=%EC%84%9C%EC%9A%B8%EC%8B%9C%EC%B2%AD
 * ```
 */
export function generateKakaoMapDeepLink(params: MapDeepLinkParams): string {
  const { latitude, longitude, placeName } = params;
  const name = encodeURIComponent(placeName || '위치');

  return `kakaomap://look?p=${latitude},${longitude}&name=${name}`;
}

/**
 * 네이버 지도 웹 URL 생성 (fallback용)
 *
 * @param params - 지도 파라미터
 * @returns 네이버 지도 웹 URL
 */
export function generateNaverMapWebUrl(params: MapDeepLinkParams): string {
  const { latitude, longitude } = params;

  // Naver Map Web URL 포맷
  // c=경도,위도,줌레벨,0,0,0,dh
  return `https://map.naver.com/v5/?c=${longitude},${latitude},15,0,0,0,dh`;
}

/**
 * 지도 앱을 자동으로 열기 (fallback 포함)
 *
 * 우선순위:
 * 1. 네이버 지도 앱
 * 2. 카카오맵 앱
 * 3. 웹 브라우저 (네이버 지도)
 *
 * @param params - 지도 파라미터
 *
 * @example
 * ```typescript
 * await openInMapApp({
 *   latitude: 37.5665,
 *   longitude: 126.9780,
 *   address: '서울특별시 중구 태평로1가',
 *   placeName: '서울시청'
 * });
 * ```
 */
export async function openInMapApp(params: MapDeepLinkParams): Promise<void> {
  const naverLink = generateNaverMapDeepLink(params);
  const kakaoLink = generateKakaoMapDeepLink(params);

  try {
    // 1. 네이버 지도 앱 시도
    const canOpenNaver = await Linking.canOpenURL(naverLink);
    if (canOpenNaver) {
      await Linking.openURL(naverLink);
      return;
    }

    // 2. 카카오맵 앱 시도
    const canOpenKakao = await Linking.canOpenURL(kakaoLink);
    if (canOpenKakao) {
      await Linking.openURL(kakaoLink);
      return;
    }

    // 3. Fallback: 웹 브라우저에서 네이버 지도 열기
    const webUrl = generateNaverMapWebUrl(params);
    await Linking.openURL(webUrl);
  } catch (error) {
    console.error('[MapDeepLink] Failed to open map:', error);
    Alert.alert('오류', '지도 앱을 열 수 없습니다.');
  }
}

/**
 * 지도 앱 선택 다이얼로그 표시
 *
 * 사용 가능한 지도 앱 목록을 보여주고 사용자가 선택하도록 합니다.
 *
 * @param params - 지도 파라미터
 *
 * @example
 * ```typescript
 * await showMapAppSelector({
 *   latitude: 37.5665,
 *   longitude: 126.9780,
 *   address: '서울특별시 중구 태평로1가'
 * });
 * ```
 */
export async function showMapAppSelector(params: MapDeepLinkParams): Promise<void> {
  const naverLink = generateNaverMapDeepLink(params);
  const kakaoLink = generateKakaoMapDeepLink(params);
  const webUrl = generateNaverMapWebUrl(params);

  try {
    // 앱 설치 여부 확인
    const [canOpenNaver, canOpenKakao] = await Promise.all([
      Linking.canOpenURL(naverLink),
      Linking.canOpenURL(kakaoLink),
    ]);

    const buttons: any[] = [];

    // 네이버 지도 버튼
    if (canOpenNaver) {
      buttons.push({
        text: '네이버 지도',
        onPress: () => Linking.openURL(naverLink),
      });
    }

    // 카카오맵 버튼
    if (canOpenKakao) {
      buttons.push({
        text: '카카오맵',
        onPress: () => Linking.openURL(kakaoLink),
      });
    }

    // 웹에서 보기 버튼 (항상 표시)
    buttons.push({
      text: '웹에서 보기',
      onPress: () => Linking.openURL(webUrl),
    });

    // 취소 버튼
    buttons.push({
      text: '취소',
      style: 'cancel',
    });

    // Alert 다이얼로그 표시
    Alert.alert('지도 앱 선택', '어떤 앱으로 열까요?', buttons, {
      cancelable: true,
    });
  } catch (error) {
    console.error('[MapDeepLink] Failed to show app selector:', error);
    // Fallback: 웹으로 바로 열기
    try {
      await Linking.openURL(webUrl);
    } catch (webError) {
      Alert.alert('오류', '지도를 열 수 없습니다.');
    }
  }
}

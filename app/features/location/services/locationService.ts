/**
 * Location Service
 *
 * GPS 위치 감지 및 역지오코딩 서비스
 * 개발 모드에서는 Mock 데이터 사용
 */

import * as Location from 'expo-location';
import type {
  GPSCoordinates,
  NeighborhoodData,
  PermissionResponse,
  PermissionStatus,
} from '../types/location.types';

// 개발 모드 감지
const isDevelopment = __DEV__;

// Mock GPS 좌표 (서울시 주요 동네)
export const MOCK_GPS_LOCATIONS = [
  {
    latitude: 37.5012767241426,
    longitude: 127.03958123605,
    neighborhood: '역삼동',
    fullAddress: '서울시 강남구 역삼동',
    city: '서울시',
    district: '강남구',
  },
  {
    latitude: 37.4838,
    longitude: 127.0323,
    neighborhood: '서초동',
    fullAddress: '서울시 서초구 서초동',
    city: '서울시',
    district: '서초구',
  },
  {
    latitude: 37.5133,
    longitude: 127.1028,
    neighborhood: '잠실동',
    fullAddress: '서울시 송파구 잠실동',
    city: '서울시',
    district: '송파구',
  },
  {
    latitude: 37.5791,
    longitude: 126.8893,
    neighborhood: '상암동',
    fullAddress: '서울시 마포구 상암동',
    city: '서울시',
    district: '마포구',
  },
];

/**
 * 위치 권한 요청
 */
export async function requestLocationPermission(): Promise<PermissionResponse> {
  try {
    const { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    return {
      status: convertPermissionStatus(status),
      canAskAgain,
    };
  } catch (error) {
    console.error('[Location] Permission request error:', error);
    return {
      status: 'denied',
      canAskAgain: false,
    };
  }
}

/**
 * 위치 권한 확인
 */
export async function checkLocationPermission(): Promise<PermissionStatus> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return convertPermissionStatus(status);
  } catch (error) {
    console.error('[Location] Permission check error:', error);
    return 'denied';
  }
}

/**
 * expo-location 권한 상태를 앱 권한 상태로 변환
 */
function convertPermissionStatus(
  status: Location.PermissionStatus
): PermissionStatus {
  switch (status) {
    case Location.PermissionStatus.GRANTED:
      return 'granted';
    case Location.PermissionStatus.DENIED:
      return 'denied';
    case Location.PermissionStatus.UNDETERMINED:
      return 'undetermined';
    default:
      return 'denied';
  }
}

/**
 * 현재 GPS 위치 가져오기
 */
export async function getCurrentLocation(): Promise<GPSCoordinates> {
  if (isDevelopment) {
    // Mock: 랜덤 위치 반환
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomLocation =
      MOCK_GPS_LOCATIONS[
        Math.floor(Math.random() * MOCK_GPS_LOCATIONS.length)
      ];

    console.log('[Location] Mock GPS location:', randomLocation.neighborhood);

    return {
      latitude: randomLocation.latitude,
      longitude: randomLocation.longitude,
      accuracy: 15,
    };
  }

  // Production: 실제 GPS 사용
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
    };
  } catch (error) {
    console.error('[Location] GPS error:', error);
    throw new Error('LOCATION_UNAVAILABLE');
  }
}

/**
 * 역지오코딩: 좌표 → 주소
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<NeighborhoodData> {
  if (isDevelopment) {
    // Mock: 가장 가까운 위치 찾기
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const nearest = findNearestMockLocation(lat, lng);
    console.log('[Location] Mock geocode result:', nearest.neighborhood);

    return {
      neighborhood: nearest.neighborhood,
      fullAddress: nearest.fullAddress,
      city: nearest.city,
      district: nearest.district,
    };
  }

  // Production: expo-location의 reverseGeocodeAsync 사용
  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });

    if (!addresses || addresses.length === 0) {
      throw new Error('GEOCODING_FAILED');
    }

    const address = addresses[0];

    // 한국 주소 형식으로 변환
    // TODO: 실제 서버 API로 정확한 동네 이름 가져오기
    const neighborhood = address.district || address.subregion || '알 수 없음';
    const district = address.city || '';
    const city = address.region || '서울시';

    return {
      neighborhood,
      fullAddress: `${city} ${district} ${neighborhood}`,
      city,
      district,
    };
  } catch (error) {
    console.error('[Location] Geocoding error:', error);
    throw new Error('GEOCODING_FAILED');
  }
}

/**
 * 가장 가까운 Mock 위치 찾기 (개발용)
 */
function findNearestMockLocation(lat: number, lng: number) {
  let nearest = MOCK_GPS_LOCATIONS[0];
  let minDistance = calculateDistance(
    lat,
    lng,
    nearest.latitude,
    nearest.longitude
  );

  for (const location of MOCK_GPS_LOCATIONS) {
    const distance = calculateDistance(
      lat,
      lng,
      location.latitude,
      location.longitude
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  }

  return nearest;
}

/**
 * 두 좌표 간 거리 계산 (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 지원하는 지역인지 확인
 */
export async function isLocationSupported(neighborhood: string): Promise<boolean> {
  // Mock: 모든 서울 지역 지원
  const supportedNeighborhoods = MOCK_GPS_LOCATIONS.map((loc) => loc.neighborhood);

  const isSupported = supportedNeighborhoods.includes(neighborhood);
  console.log('[Location] Location supported:', neighborhood, isSupported);

  return isSupported;
}

/**
 * 앱 설정으로 이동 (권한 설정용)
 */
export async function openAppSettings(): Promise<void> {
  try {
    await Location.enableNetworkProviderAsync();
  } catch (error) {
    console.error('[Location] Failed to open settings:', error);
  }
}

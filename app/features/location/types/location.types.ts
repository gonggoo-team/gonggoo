/**
 * Location Types
 *
 * GPS 및 위치 관련 타입 정의
 */

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface NeighborhoodData {
  neighborhood: string; // "역삼동"
  fullAddress: string; // "서울시 강남구 역삼동"
  city: string; // "서울시"
  district: string; // "강남구"
}

export type PermissionStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'restricted';

export interface PermissionResponse {
  status: PermissionStatus;
  canAskAgain: boolean;
}

export type GPSError =
  | 'PERMISSION_DENIED'
  | 'LOCATION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNSUPPORTED_AREA'
  | 'GEOCODING_FAILED'
  | 'NETWORK_ERROR';

export interface DetectedLocation extends NeighborhoodData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

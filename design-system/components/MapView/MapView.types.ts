/**
 * MapView Types
 */

export interface MapViewProps {
  /** 위도 */
  latitude: number;

  /** 경도 */
  longitude: number;

  /** 주소 (옵션) */
  address?: string;

  /** 지도 높이 (기본: 200px) */
  height?: number;

  /** 마커 표시 여부 (기본: true) */
  showMarker?: boolean;

  /** 범위 원형 표시 반지름 (km 단위) */
  rangeCircleRadius?: number;

  /** 범위 원형 색상 (기본: 테마 primary 색상) */
  rangeCircleColor?: string;

  /** 지도 인터랙션 활성화 여부 (기본: false) */
  interactive?: boolean;

  /** 내 위치 버튼 표시 여부 (기본: false) */
  showLocationButton?: boolean;

  /** 내 위치 버튼 클릭 핸들러 */
  onLocationButtonPress?: () => void;

  /** 지도 중심 변경 핸들러 */
  onRegionChange?: (latitude: number, longitude: number) => void;

  /** 줌 레벨 (기본: 15) */
  zoomLevel?: number;
}

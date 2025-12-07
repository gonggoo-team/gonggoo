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
}

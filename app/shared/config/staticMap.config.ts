/**
 * Static Map Configuration
 *
 * Hybrid Map Strategy를 위한 설정입니다.
 * enabled를 true로 설정하면 TransactionInfoSection에서 정적 지도 이미지를 사용합니다.
 * false로 설정하면 동적 지도(NaverMapView)를 계속 사용합니다.
 */

export interface StaticMapConfig {
  /** Static Map 사용 여부 (true: 정적 지도, false: 동적 지도) */
  enabled: boolean;
  /** 이미지 너비 (픽셀) */
  width: number;
  /** 이미지 높이 (픽셀) */
  height: number;
  /** 줌 레벨 (0-20) */
  zoom: number;
  /** 마커 크기 */
  markerSize: 'tiny' | 'small' | 'mid' | 'large';
}

/**
 * Static Map 전역 설정
 *
 * 읽기 모드(Read Mode)에서 비용 최적화를 위해 사용됩니다.
 */
export const STATIC_MAP_CONFIG: StaticMapConfig = {
  // Static Map 사용 여부
  // true: TransactionInfoSection에서 정적 이미지 사용 (비용 절감)
  // false: Dynamic Map(NaverMapView) 계속 사용
  enabled: true,

  // 이미지 크기
  width: 600,
  height: 400,

  // 줌 레벨 (15 = 동네 단위)
  zoom: 15,

  // 마커 크기
  markerSize: 'mid',
};

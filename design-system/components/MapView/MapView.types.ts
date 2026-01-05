/**
 * MapView Types
 */

/**
 * 마커 타입
 */
export type MarkerType =
  | 'default'
  | 'my-location'
  | 'product'
  | 'product-recruiting'  // 모집중 (녹색)
  | 'product-closed'      // 모집마감 (회색)
  | 'product-closing-soon' // 마감임박 (빨간색)
  | 'liked-product';       // 찜한 공구 (하트)

/**
 * 마커 표시 모드
 * - 'simple': 단순 원형 마커
 * - 'detailed': 상세 정보 마커 (가격 + 상품명)
 */
export type MarkerDisplayMode = 'simple' | 'detailed';

/**
 * 지도 마커 데이터
 */
export interface MapMarkerData {
  /** 마커 ID */
  id: string;
  /** 마커 타입 */
  type?: MarkerType;
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 마커 클릭 핸들러 */
  onPress?: () => void;
  /** 상품 정보 (가격 표시용, 선택 사항) */
  product?: {
    /** 1인 가격 */
    pricePerSlot: number;
    /** 제목 (향후 확장용) */
    title?: string;
    /** 모집률 (향후 확장용) */
    progress?: number;
  };
  /** 선택 여부 (기본: false) */
  isSelected?: boolean;
  /** 표시 모드 (기본: 'simple') */
  displayMode?: MarkerDisplayMode;
  /** 찜한 상품 여부 (기본: false) - 백엔드 연동 대비 */
  isLiked?: boolean;
}

export interface MapViewProps {
  /** 위도 (지도 중심) */
  latitude: number;

  /** 경도 (지도 중심) */
  longitude: number;

  /** 주소 (옵션, 미사용이지만 하위 호환성 유지) */
  address?: string;

  /** 지도 높이 (기본: 200px) */
  height?: number;

  /** 단일 마커 표시 여부 (하위 호환성을 위해 유지, 기본: false) */
  showMarker?: boolean;

  /** 여러 마커 표시 (새로운 방식) */
  markers?: MapMarkerData[];

  /** 범위 원 반경 (km 단위, 동네 설정 화면에서 사용) */
  rangeCircleRadius?: number;

  /** 범위 원 중심 좌표 (지정하지 않으면 지도 중심 사용) */
  rangeCircleCenter?: {
    latitude: number;
    longitude: number;
  };

  /** 현재 위치 버튼 표시 여부 (기본: false, 동네 설정 화면에서 사용) */
  showLocationButton?: boolean;

  /** 현재 위치 버튼 클릭 핸들러 */
  onLocationButtonPress?: () => void;

  /** 지도 인터랙션 활성화 여부 (기본: true) */
  interactive?: boolean;

  /** 줌 레벨 (기본: 15) */
  zoom?: number;

  /** 지도 카메라 변경 핸들러 (드래그 시 호출) */
  onCameraChange?: (latitude: number, longitude: number, zoom: number) => void;

  /** 지도 빈 영역 클릭 핸들러 */
  onMapClick?: (latitude: number, longitude: number) => void;

  /** props 변경 시 자동 애니메이션 비활성화 (기본: false) */
  disableAutoAnimation?: boolean;
}

/**
 * AdBanner Types
 */

export interface AdBannerItem {
  /** 배너 ID */
  id: string;
  /** 배너 이미지 URL */
  imageUri: string;
  /** 배너 클릭 시 이동할 링크 (optional) */
  link?: string;
}

export interface AdBannerProps {
  /** 배너 아이템 배열 */
  items: AdBannerItem[];
  /** 배너 클릭 이벤트 */
  onBannerPress?: (item: AdBannerItem) => void;
  /** 자동 재생 여부 (default: false) */
  autoPlay?: boolean;
  /** 자동 재생 간격 (ms, default: 3000) */
  autoPlayInterval?: number;
  /** 배너 높이 (default: 120) */
  height?: number;
  width?: number;
  /** 전체 너비 모드 (padding 제거, default: false) */
  fullWidth?: boolean;
  /** 이미지 비율 (aspectRatio 기반 높이 자동 계산, default: undefined) */
  aspectRatio?: number;
}

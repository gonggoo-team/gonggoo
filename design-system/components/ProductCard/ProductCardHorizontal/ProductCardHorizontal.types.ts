/**
 * ProductCardHorizontal Types
 */

import type { BadgeType } from '../../../primitives/StatusBadge';

export interface ProductCardHorizontalProps {
  /** 상품 고유 ID */
  id: string;
  /** 상품 이미지 URI */
  imageUri: string;
  /** 상품 제목 */
  title: string;
  /** 전체 가격 (optional) */
  price?: number;
  /** 슬롯당 가격 (optional) */
  pricePerSlot?: number;
  /** 가격 취소선 표시 여부 */
  priceStrikethrough?: boolean;
  /** 가격 라벨 (예: "슬롯", "팩") */
  priceLabel?: string;
  /** 가격 라벨 값 (예: 1, 2) */
  priceLabelValue?: string | number;
  /** 가격 라벨 색상 */
  priceLabelColor?: string;
  /** 구매 중인 인원 수 */
  buyersCount: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 배지 목록 */
  badges: Array<{
    type: BadgeType;
    label: string;
  }>;
  /** 카드 클릭 이벤트 */
  onPress: () => void;

  /**
   * 총 가격 표시 여부
   * @default true
   */
  showPrice?: boolean;

  /**
   * 슬롯당 가격 표시 여부
   * @default true
   */
  showPricePerSlot?: boolean;

  /**
   * 배지 표시 여부
   * @default true
   */
  showBadges?: boolean;

  /**
   * 진행률 바 표시 여부
   * @default true
   */
  showProgress?: boolean;

  /**
   * 제목 최대 라인 수
   * @default 2
   */
  titleLines?: number;
}

/**
 * Note: Figma 디자인(445-6497)에는 좋아요 기능이 없습니다.
 * likes, onLikePress props는 제거되었습니다.
 */

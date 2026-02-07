/**
 * ProductCardLarge Types
 */

import type { BadgeType } from '../../../primitives/StatusBadge';

export interface ProductCardLargeProps {
  /** 상품 고유 ID */
  id: string;
  /** 상품 이미지 URI */
  imageUri: string;
  /** 상품 제목 */
  title: string;
  /** 전체 가격 */
  price: number;
  /** 슬롯당 가격 */
  pricePerSlot: number;
  /** 좋아요 수 */
  likes: number;
  /** 남은 슬롯 수 */
  slotsRemaining: number;
  /** 참가 중인 인원 */
  participantsCount: number;
  /** 배지 목록 */
  badges: Array<{
    type: BadgeType;
    label: string;
  }>;
  /** 카드 클릭 이벤트 */
  onPress: () => void;
  /** 좋아요 클릭 이벤트 */
  onLikePress: () => void;

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
   * 좋아요 표시 여부
   * @default true
   */
  showLikes?: boolean;

  /**
   * 제목 최대 라인 수
   * @default 2
   */
  titleLines?: number;
}

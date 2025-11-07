/**
 * ProductCardVertical Types
 *
 * 세로형 상품 카드 컴포넌트의 타입 정의입니다.
 */

import type { StatusBadgeType } from '../../../primitives/StatusBadge';

/**
 * ProductCardVertical Props
 */
export interface ProductCardVerticalProps {
  /**
   * 상품 ID
   */
  id: string | number;

  /**
   * 이미지 URI
   */
  imageUri: string;

  /**
   * 상품 제목
   */
  title: string;

  /**
   * 총 가격 (optional, 없으면 표시하지 않음)
   */
  price?: number;

  /**
   * 가격에 취소선 표시 여부
   * @default false
   */
  priceStrikethrough?: boolean;

  /**
   * 슬롯당 가격 (optional, 없으면 표시하지 않음)
   */
  pricePerSlot?: number;

  /**
   * 가격 라벨 (예: "1인", "1슬롯", "1팩")
   * @default "1인"
   */
  priceLabel?: string;

  priceLabelValue?: string | number;
  /**
   * 가격 라벨 색상 (optional, 기본값: #006242 초록색)
   */
  priceLabelColor?: string;

  /**
   * 좋아요 개수
   */
  likes?: number;

  /**
   * 진행률 (0-100, optional)
   */
  progress?: number;

  /**
   * 진행률 게이지 표시 여부
   * @default true
   */
  showProgress?: boolean;

  /**
   * 상태 배지 목록
   */
  badges: Array<{
    type: StatusBadgeType;
    label: string;
  }>;

  /**
   * 카드 클릭 핸들러
   */
  onPress: () => void;

  /**
   * 좋아요 클릭 핸들러
   */
  onLikePress: () => void;

  /**
   * 카드 너비 (optional)
   * 미지정 시 기본값 163px (일반 세로형 카드)
   * 3열 그리드 등 특수한 레이아웃에서 동적으로 지정 가능
   * @default 163
   */
  width?: number;

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

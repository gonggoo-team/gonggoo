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
   * 카드 variant
   * - default: 일반 상품 리스트 (이미지 136px, 진행률 바 표시)
   * - recent: 최근 본 상품/취소 내역 (이미지 106px, 진행률 바 없음)
   * - profile: 프로필 상품 리스트 (이미지 62px, 진행률 바/배지 없음, 더 좁은 간격)
   * @default 'default'
   */
  variant?: 'default' | 'recent' | 'profile';

  /**
   * 모집 완료 상태 (recent variant 전용)
   * true일 경우 반투명 오버레이 + "모집 완료" 텍스트 표시
   * @default false
   */
  completed?: boolean;

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

  /**
   * 구분선(divider) 표시 여부
   * @default true
   */
  showDivider?: boolean;

  /**
   * 텍스트 영역 상하 중앙 정렬 여부
   * true일 경우 텍스트 컨테이너를 이미지 높이 기준으로 상하 중앙에 배치
   * @default false
   */
  centerTextVertically?: boolean;
}

/**
 * Note: Figma 디자인(445-6497)에는 좋아요 기능이 없습니다.
 * likes, onLikePress props는 제거되었습니다.
 */

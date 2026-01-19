/**
 * ProductCardCompact Types
 *
 * 컴팩트 가로형 상품 카드 컴포넌트의 타입 정의입니다.
 */

import type { StatusBadgeType } from '../../../primitives/StatusBadge';

/**
 * ProductCardCompact Props
 */
export interface ProductCardCompactProps {
  /**
   * 상품 ID
   */
  id: string;

  /**
   * 이미지 URI
   */
  imageUri: string;

  /**
   * 상품 제목
   */
  title: string;

  /**
   * 총 가격
   */
  price: number;

  /**
   * 슬롯당 가격
   */
  pricePerSlot: number;

  /**
   * 상태 배지 목록
   */
  badges?: Array<{
    type: StatusBadgeType;
    label: string;
  }>;

  /**
   * 모집 완료 여부
   * @default false
   */
  isClosed?: boolean;

  /**
   * 카드 클릭 핸들러
   */
  onPress?: () => void;

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
   * 제목 최대 라인 수
   * @default 2
   */
  titleLines?: number;

  /**
   * 이미지 크기 (정사각형)
   * @default 106
   */
  imageSize?: number;

  /**
   * 콘텐츠 영역 내부 간격
   * @default 4
   */
  contentGap?: number;

  /**
   * 가격 라벨 텍스트 (예: "1슬롯", "2슬롯")
   * @default "1슬롯"
   */
  priceLabel?: string;

  /**
   * 카드 전체 터치 비활성화 여부 (정적 표시용)
   * @default false
   */
  disablePress?: boolean;
}

/**
 * FloatingActionBar Types
 */

export interface FloatingActionBarProps {
  /** 좋아요 버튼 클릭 핸들러 */
  onLikePress?: () => void;
  /** 채팅 버튼 클릭 핸들러 */
  onChatPress?: () => void;
  /** 참여하기 버튼 클릭 핸들러 */
  onJoinPress?: () => void;
  /** 좋아요 활성화 여부 */
  isLiked?: boolean;
  /** 참여하기 버튼 비활성화 여부 */
  joinDisabled?: boolean;
  /** 참여하기 버튼 텍스트 */
  joinButtonText?: string;

  /** 상품명 (펼쳐진 상태에서 표시) */
  productTitle?: string;
  /** 슬롯당 가격 (펼쳐진 상태에서 표시) */
  pricePerSlot?: number;
  /** 초기 수량 (기본값: 1) */
  initialQuantity?: number;
  /** 수량 변경 핸들러 */
  onQuantityChange?: (quantity: number) => void;
}

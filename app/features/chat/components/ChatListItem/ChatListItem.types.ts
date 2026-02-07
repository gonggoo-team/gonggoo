/**
 * ChatListItem Component Types
 */

import type { ChatRoomItem } from '@/app/shared/types';

/**
 * ChatListItem 컴포넌트 Props
 */
export interface ChatListItemProps extends ChatRoomItem {
  /**
   * 아이템 클릭 핸들러
   */
  onPress: () => void;

  /**
   * 선택 여부 (거래 완료 요청 모드에서 사용)
   */
  selected?: boolean;

  /**
   * 선택 핸들러 (거래 완료 요청 모드에서 사용)
   */
  onSelect?: () => void;

  /**
   * 상품 썸네일 표시 여부
   * - true (기본값): 원형 프로필 + 네모 상품 썸네일 오버레이
   * - false: 원형 프로필만 표시
   */
  showProductThumbnail?: boolean;
}

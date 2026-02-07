/**
 * MessageGroup Types
 */

import type { MessageGroup } from '@/app/shared/types';

export interface MessageGroupProps {
  /** 메시지 그룹 데이터 */
  group: MessageGroup;
  /** 프로필 이미지 URI */
  profileImageUri?: string;
  /** 프로필 이미지 표시 여부 (상대방 메시지의 첫 그룹만 true) */
  showProfileImage: boolean;
}

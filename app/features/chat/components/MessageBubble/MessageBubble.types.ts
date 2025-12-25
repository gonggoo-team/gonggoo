/**
 * MessageBubble Types
 */

import type { MessageSender, BorderRadiusPosition } from '@/app/shared/types';

export interface MessageBubbleProps {
  /** 메시지 내용 */
  content: string;
  /** 발신자 (me/other) */
  sender: MessageSender;
  /** 그룹 내 위치 (single/first/middle/last) */
  position: BorderRadiusPosition;
}

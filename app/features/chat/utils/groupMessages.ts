/**
 * Message Grouping Utility
 *
 * 메시지를 5분 윈도우 + 같은 발신자 기준으로 그룹화합니다.
 * Instagram DM 스타일의 메시지 그룹화를 구현합니다.
 */

import type { ChatMessage, MessageGroup, BorderRadiusPosition, MessageSender } from '@/app/shared/types';

/** 메시지 그룹화 시간 윈도우 (5분) */
const TIME_WINDOW = 5 * 60 * 1000;

/**
 * 메시지를 5분 윈도우 + 같은 발신자 기준으로 그룹화
 * @param messages 메시지 배열 (시간순 정렬되어 있어야 함)
 * @returns 그룹화된 메시지 배열
 */
export function groupMessages(messages: ChatMessage[]): MessageGroup[] {
  if (messages.length === 0) {
    return [];
  }

  const groups: MessageGroup[] = [];
  let currentGroup: ChatMessage[] = [];
  let currentSender: MessageSender | null = null;
  let lastTimestamp = 0;

  messages.forEach((message) => {
    // 시스템 메시지는 항상 독립적인 그룹으로 처리
    const isSystemMessage = message.type === 'system';
    const shouldStartNewGroup =
      isSystemMessage ||
      currentSender !== message.sender ||
      message.timestamp - lastTimestamp > TIME_WINDOW;

    if (shouldStartNewGroup && currentGroup.length > 0) {
      // 현재 그룹을 완성하고 추가
      groups.push(createGroup(currentGroup, currentSender!));
      currentGroup = [];
    }

    currentGroup.push(message);
    currentSender = message.sender;
    lastTimestamp = message.timestamp;

    // 시스템 메시지는 즉시 그룹 완성
    if (isSystemMessage) {
      groups.push(createGroup(currentGroup, currentSender));
      currentGroup = [];
      currentSender = null;
    }
  });

  // 마지막 그룹 추가
  if (currentGroup.length > 0) {
    groups.push(createGroup(currentGroup, currentSender!));
  }

  return groups;
}

/**
 * 메시지 배열로부터 MessageGroup 생성
 */
function createGroup(messages: ChatMessage[], sender: MessageSender): MessageGroup {
  const messagesWithPosition = messages.map((msg, index) => ({
    message: msg,
    position: getPositionInGroup(index, messages.length),
  }));

  return {
    id: messages[0].id + '-group',
    sender,
    messages: messagesWithPosition,
    timestamp: messages[messages.length - 1].timestamp,
  };
}

/**
 * 그룹 내 메시지의 위치 결정
 * @param index 메시지 인덱스
 * @param total 그룹 내 총 메시지 개수
 */
function getPositionInGroup(index: number, total: number): BorderRadiusPosition {
  if (total === 1) return 'single';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
}

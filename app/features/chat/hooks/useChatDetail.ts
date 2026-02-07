/**
 * useChatDetail Hook
 *
 * 채팅 상세 화면의 상태 관리 및 로직을 담당합니다.
 * - 메시지 로드 및 그룹화
 * - 날짜별 섹션 생성
 * - 메시지 전송
 */

import { useState, useEffect, useMemo } from 'react';
import type { ChatRoomItem, ChatMessage, MessageSection } from '@/app/shared/types';
import { getChatRoomById, getMockChatMessages, sendMockChatMessage, markChatAsRead } from '@/app/shared/services/mock';
import { groupMessages, formatDateSeparator } from '@/app/features/chat/utils';

export function useChatDetail(chatId: string) {
  const [chatRoom, setChatRoom] = useState<ChatRoomItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  /**
   * 메시지 그룹화 + 날짜별 섹션 생성
   */
  const messageSections = useMemo<MessageSection[]>(() => {
    if (messages.length === 0) {
      return [];
    }

    // 중복 메시지 제거: 같은 ID를 가진 메시지는 하나만 유지
    const uniqueMessages = messages.filter(
      (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
    );

    const groups = groupMessages(uniqueMessages);
    const sections: MessageSection[] = [];

    groups.forEach((group) => {
      const date = formatDateSeparator(group.timestamp);
      const lastSection = sections[sections.length - 1];

      if (lastSection && lastSection.date === date) {
        // 같은 날짜면 기존 섹션에 추가
        lastSection.groups.push(group);
      } else {
        // 새로운 날짜면 새 섹션 생성
        sections.push({ date, groups: [group] });
      }
    });

    return sections;
  }, [messages]);

  /**
   * 초기 데이터 로드
   */
  useEffect(() => {
    loadChatData();
  }, [chatId]);

  /**
   * 채팅방 및 메시지 데이터 로드
   */
  const loadChatData = async () => {
    setLoading(true);
    try {
      // Mock 채팅방 데이터 로드 (원본 데이터에서 직접 조회)
      const room = getChatRoomById(chatId);
      setChatRoom(room);

      // Mock 메시지 데이터 로드
      const msgs = getMockChatMessages(chatId);

      // 중복 메시지 제거: 같은 ID를 가진 메시지는 하나만 유지
      const uniqueMsgs = msgs.filter(
        (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
      );

      setMessages(uniqueMsgs);

      // 채팅방 진입 시 읽음 처리
      markChatAsRead(chatId);
    } catch (error) {
      console.error('Failed to load chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 메시지 전송
   */
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setSending(true);
    try {
      const newMessage = sendMockChatMessage(chatId, content);
      // 중복 메시지 추가 방지: 같은 ID가 이미 있으면 추가하지 않음
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        if (existingIds.has(newMessage.id)) {
          console.warn('Duplicate message detected, skipping:', newMessage.id);
          return prev;
        }
        return [...prev, newMessage];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  /**
   * 이미지 첨부 핸들러
   */
  const handleAttach = () => {
    // TODO: 이미지 첨부 기능 구현
  };

  return {
    chatRoom,
    messageSections,
    loading,
    sending,
    sendMessage,
    handleAttach,
    refresh: loadChatData,
  };
}

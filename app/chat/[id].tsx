/**
 * Chat Detail Route
 *
 * 동적 라우트: /chat/[id]
 * - id가 productId면 GroupBuyerChatListScreen (공구장 시점)
 * - id가 chatId면 ChatDetailScreen (1:1 채팅)
 */

import React, { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ThemeProvider } from '@/design-system';
import { ChatDetailScreen, GroupBuyerChatListScreen } from '@/app/features/chat';
import { getMockGroupBuyerChats } from '@/app/shared/services/mock';

export default function ChatDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    throw new Error('Chat ID is required');
  }

  /**
   * id가 공구 상품 ID인지 확인
   * - getMockGroupBuyerChats(id)로 조회했을 때 채팅방이 있으면 공구장 시점
   */
  const isGroupBuyerChat = useMemo(() => {
    const groupBuyerChats = getMockGroupBuyerChats(id);
    return groupBuyerChats.length > 0;
  }, [id]);

  return (
    <ThemeProvider>
      {isGroupBuyerChat ? (
        <GroupBuyerChatListScreen productId={id} />
      ) : (
        <ChatDetailScreen chatId={id} />
      )}
    </ThemeProvider>
  );
}

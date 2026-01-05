/**
 * Chat Product Screen
 *
 * 특정 공구 상품의 공구원들과의 채팅 목록 화면 (공구장 시점)
 * 라우트: /chat/[productId]
 */

import React from 'react';
import { ThemeProvider } from '@/design-system';
import { GroupBuyerChatListScreen } from '@/app/features/chat';
import { useLocalSearchParams } from 'expo-router';

/**
 * ChatProductScreen Component
 */
export default function ChatProductScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();

  return (
    <ThemeProvider>
      <GroupBuyerChatListScreen productId={productId || 'product2'} />
    </ThemeProvider>
  );
}

/**
 * Chat Screen
 *
 * 채팅 탭 화면입니다.
 */

import React from 'react';
import { ThemeProvider } from '@/design-system';
import { ChatListScreen } from '@/app/features/chat';

/**
 * ChatScreen Component
 */
export default function ChatScreen() {
  return (
    <ThemeProvider>
      <ChatListScreen />
    </ThemeProvider>
  );
}

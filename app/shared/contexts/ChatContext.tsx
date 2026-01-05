/**
 * ChatContext
 *
 * 채팅 관련 전역 상태를 관리하기 위한 Context입니다.
 * - 전체 안 읽은 메시지 개수 관리
 * - 하단 탭바 배지 표시용
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { getTotalUnreadCount } from '../services/mock';

/**
 * Context 타입 정의
 */
interface ChatContextValue {
  /** 전체 안 읽은 메시지 개수 */
  totalUnreadCount: number;
  /** 안 읽은 메시지 개수 갱신 */
  refreshUnreadCount: () => void;
}

/**
 * Context 생성
 */
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface ChatProviderProps {
  children: ReactNode;
}

/**
 * ChatProvider Component
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  /**
   * 안 읽은 메시지 개수 갱신
   */
  const refreshUnreadCount = useCallback(() => {
    const count = getTotalUnreadCount();
    setTotalUnreadCount(count);
  }, []);

  /**
   * 초기 로드 시 안 읽은 메시지 개수 계산
   */
  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  const value: ChatContextValue = {
    totalUnreadCount,
    refreshUnreadCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * useChat Hook
 * ChatContext를 사용하기 위한 hook
 */
export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

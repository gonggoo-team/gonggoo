/**
 * useChatList Hook
 *
 * 채팅 목록 데이터를 관리하는 hook입니다.
 * - 필터 타입별 채팅방 목록 조회
 * - 전체 안 읽은 메시지 개수 계산
 * - 새로고침 지원
 */

import { useCallback, useEffect, useState, useMemo } from 'react';
import type { ChatRoomItem, ChatFilterType } from '@/app/shared/types';
import { getMockChatRooms, getTotalUnreadCount } from '@/app/shared/services/mock';

export function useChatList() {
  const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<ChatFilterType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 채팅방 목록 로드 및 검색 필터링
   */
  const loadChatRooms = useCallback(async () => {
    try {
      // Mock 데이터에서 필터링된 채팅방 조회
      // 실제 구현 시 API 호출로 대체
      let rooms = getMockChatRooms(selectedFilter);

      // 검색어가 있으면 추가 필터링
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        rooms = rooms.filter((room) => {
          const nicknameMatch = room.participant.nickname.toLowerCase().includes(query);
          const messageMatch = room.lastMessage.content.toLowerCase().includes(query);
          return nicknameMatch || messageMatch;
        });
      }

      setChatRooms(rooms);
    } catch (error) {
      console.error('[ChatList] Failed to load chat rooms:', error);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, searchQuery]);

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  /**
   * 새로고침
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChatRooms();
    setRefreshing(false);
  }, [loadChatRooms]);

  /**
   * 필터 변경
   */
  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter as ChatFilterType);
  }, []);

  /**
   * 알림 on/off 토글
   */
  const toggleNotification = useCallback(() => {
    setNotificationEnabled((prev) => !prev);
  }, []);

  /**
   * 검색어 변경
   */
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * 검색 초기화
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * 전체 안 읽은 메시지 개수 (GNB 알림 배지용)
   * - 필터와 무관하게 전체 채팅방의 안 읽은 메시지 총합
   * - useMemo로 성능 최적화
   */
  const totalUnreadCount = useMemo(() => {
    return getTotalUnreadCount();
  }, [chatRooms]); // chatRooms가 변경될 때마다 재계산

  return {
    chatRooms,
    selectedFilter,
    loading,
    refreshing,
    totalUnreadCount,
    notificationEnabled,
    searchQuery,
    handleRefresh,
    handleFilterChange,
    toggleNotification,
    handleSearchQueryChange,
    clearSearch,
  };
}

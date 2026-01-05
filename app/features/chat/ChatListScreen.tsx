/**
 * ChatListScreen
 *
 * 채팅 목록 화면입니다.
 * - GNB: 제목 + 검색/알림/설정 아이콘
 * - 필터 탭: 전체, 공구장, 공구원, 안 읽은 메시지
 * - 채팅 목록: FlatList로 구현
 * - 빈 상태: EmptyState 컴포넌트
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { GNB, useTheme, CategoryFilterBar, Divider } from '@/design-system';
import { EmptyState } from '@/app/shared/components';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { useChat } from '@/app/shared/contexts';
import { useChatList } from './hooks';
import { ChatListItem } from './components';

/**
 * 필터 카테고리 목록
 */
const CHAT_FILTERS = ['전체', '공구장', '공구원', '안 읽은 메시지'];

/**
 * 필터 레이블 -> ChatFilterType 매핑
 */
const FILTER_TYPE_MAP: Record<string, string> = {
  전체: 'all',
  공구장: 'host',
  공구원: 'participant',
  '안 읽은 메시지': 'unread',
};

/**
 * ChatFilterType -> 필터 레이블 매핑
 */
const FILTER_LABEL_MAP: Record<string, string> = {
  all: '전체',
  host: '공구장',
  participant: '공구원',
  unread: '안 읽은 메시지',
};

export default function ChatListScreen() {
  const { theme } = useTheme();
  const { push } = useThrottledNavigation();
  const { refreshUnreadCount } = useChat();
  const {
    chatRooms,
    selectedFilter,
    loading,
    refreshing,
    notificationEnabled,
    searchQuery,
    handleRefresh,
    handleFilterChange,
    toggleNotification,
    handleSearchQueryChange,
    clearSearch,
  } = useChatList();
  const [isSearchMode, setIsSearchMode] = React.useState(false);

  /**
   * 화면 포커스 시 안 읽은 메시지 개수 갱신 및 채팅 목록 새로고침
   */
  useFocusEffect(
    useCallback(() => {
      refreshUnreadCount();
      handleRefresh();
    }, [refreshUnreadCount, handleRefresh])
  );

  /**
   * 채팅 아이템 클릭 핸들러
   */
  const handleChatPress = useCallback(
    (chatId: string, userRole: 'host' | 'participant', productId?: string) => {
      if (userRole === 'host' && productId) {
        // 공구장일 경우: 해당 공구의 공구원 채팅 목록으로 이동
        push(`/chat/${productId}`);
      } else {
        // 공구원일 경우: 1:1 채팅으로 이동
        push(`/chat/${chatId}`);
      }
    },
    [push]
  );

  /**
   * GNB 아이콘 핸들러
   */
  const handleSearchPress = useCallback(() => {
    setIsSearchMode((prev) => {
      if (prev) {
        // 검색 모드 종료 시 검색어 초기화
        clearSearch();
      }
      return !prev;
    });
  }, [clearSearch]);

  const handleNotificationPress = useCallback(() => {
    toggleNotification();
  }, [toggleNotification]);

  const handleSettingsPress = useCallback(() => {
    push('/settings');
  }, [push]);

  /**
   * 필터 변경 핸들러
   */
  const handleFilterSelect = useCallback(
    (label: string) => {
      const filterType = FILTER_TYPE_MAP[label];
      handleFilterChange(filterType);
    },
    [handleFilterChange]
  );

  /**
   * 빈 상태 렌더링
   */
  const renderEmptyState = useCallback(
    () => (
      <EmptyState
        message="채팅 내역이 없습니다"
        description="공구에 참여하고 채팅을 시작해보세요"
      />
    ),
    []
  );

  /**
   * 리스트 아이템 구분선
   */
  const renderSeparator = useCallback(
    () => (
      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.border.lowEmp,
          marginHorizontal: theme.spacing.lg,
        }}
      />
    ),
    [theme]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
      edges={['bottom']}
    >
      {/* GNB */}
      <GNB
        leftSection={
          isSearchMode
            ? {
                type: 'back',
                onPress: () => {
                  setIsSearchMode(false);
                  clearSearch();
                },
              }
            : {
                type: 'logo-text',
                text: '채팅',
              }
        }
        centerSection={
          isSearchMode
            ? {
                type: 'search-bar',
                value: searchQuery,
                onChangeText: handleSearchQueryChange,
                placeholder: '닉네임 또는 메시지 검색',
                onSubmit: () => {},
              }
            : undefined
        }
        rightIcons={[
          {
            type: 'search',
            onPress: handleSearchPress,
          },
          {
            type: 'notification',
            badge: { dot: notificationEnabled },
            onPress: handleNotificationPress,
          },
          {
            type: 'settings',
            onPress: handleSettingsPress,
          },
        ]}
      />
      <Divider />
      {/* 필터 탭 */}
      <CategoryFilterBar
        categories={CHAT_FILTERS}
        selectedCategory={FILTER_LABEL_MAP[selectedFilter]}
        onSelect={handleFilterSelect}
      />

      {/* 로딩 상태 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
        </View>
      ) : (
        /* 채팅 목록 */
        <FlatList
          data={chatRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              {...item}
              userRole={item.userRole}
              onPress={() => handleChatPress(item.id, item.userRole, item.product.id)}
            />
          )}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={chatRooms.length === 0 ? styles.emptyList : undefined}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flex: 1,
  },
});

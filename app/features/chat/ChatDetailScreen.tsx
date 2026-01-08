/**
 * ChatDetailScreen
 *
 * 채팅 상세 화면 (1:1 메시징)입니다.
 * - GNB 타이틀: 상대방 닉네임
 * - 메시지 그룹화: 5분 이내 같은 발신자
 * - Instagram DM 스타일 border radius
 * - Inverted FlatList로 최신 메시지가 아래
 */

import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, GNB, useTheme } from '@/design-system';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { useChat } from '@/app/shared/contexts';
import type { MessageSection } from '@/app/shared/types';
import { useChatDetail } from './hooks';
import { DateSeparator, MessageGroup, ChatInput, TransactionCompleteRequestMessage } from './components';

export interface ChatDetailScreenProps {
  chatId: string;
}

export default function ChatDetailScreen({ chatId }: ChatDetailScreenProps) {
  const { theme } = useTheme();
  const { back } = useThrottledNavigation();
  const { refreshUnreadCount } = useChat();
  const { chatRoom, messageSections, loading, sending, sendMessage, handleAttach, refresh } = useChatDetail(chatId);
  /**
   * 컴포넌트 unmount 시 안 읽은 메시지 개수 갱신
   * (채팅을 읽었으므로 탭바 배지를 업데이트)
   */
  useEffect(() => {
    return () => {
      refreshUnreadCount();
    };
  }, [refreshUnreadCount]);

  const handleOptionsPress = () => {
    // TODO: 채팅 옵션 메뉴 (신고, 차단, 나가기 등)
    Alert.alert('채팅 옵션', '추후 구현 예정입니다.');
  };

  /**
   * 거래 완료 처리
   */
  const handleCompleteTransaction = () => {
    // TODO: 백엔드 API 호출하여 거래 완료 처리
    Alert.alert('거래 완료', '거래가 완료되었습니다.');
  };

  /**
   * 날짜별 섹션 렌더링
   */
  const renderSection = ({ item, index }: { item: MessageSection; index: number }) => (
    <View>
      {/* 날짜 구분선 */}
      <DateSeparator date={item.date} />

      {/* 메시지 그룹들 */}
      {item.groups.map((group, groupIndex) => {
        // 시스템 메시지 그룹 체크 (그룹 내 모든 메시지가 시스템 메시지인 경우)
        const isSystemMessageGroup =
          group.sender === 'system' && group.messages.every((m) => m.message.type === 'system');

        if (isSystemMessageGroup) {
          // 시스템 메시지 렌더링
          return group.messages.map(({ message }) => {
            if (message.type === 'system' && message.systemMessageType === 'transaction_complete_request') {
              return (
                <TransactionCompleteRequestMessage
                  key={message.id}
                  onCompleteTransaction={handleCompleteTransaction}
                />
              );
            }
            return null;
          });
        }

        // 일반 메시지 그룹 렌더링
        // 상대방 메시지의 경우, 이전 그룹과 발신자가 다르면 프로필 이미지 표시
        const showProfileImage =
          group.sender === 'other' &&
          (groupIndex === 0 || item.groups[groupIndex - 1].sender !== 'other');

        return (
          <MessageGroup
            key={group.id}
            group={group}
            profileImageUri={chatRoom?.participant.profileImageUri}
            showProfileImage={showProfileImage}
          />
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
      </SafeAreaView>
    );
  }

  if (!chatRoom) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top', 'bottom']}>
        <GNB
          leftSection={{
            type: 'back',
            onPress: back,
          }}
          centerSection={{
            type: 'title',
            text: '채팅',
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]} edges={['top']}>
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back',
          onPress: back,
        }}
        centerSection={{
          type: 'title',
          text: chatRoom.participant.nickname.length > 15 ? chatRoom.participant.nickname.substring(0, 15) + '...' : chatRoom.participant.nickname,
        }}
        rightIcons={[
          {
            type: 'menu',
            onPress: handleOptionsPress,
          },
        ]}
      />
      <Divider />

      {/* 키보드 처리 래퍼 */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* 메시지 리스트 (inverted) */}
        <FlatList
          data={messageSections.slice().reverse()} // 최신 메시지가 아래로 (inverted 모드)
          renderItem={renderSection}
          keyExtractor={(item) => item.date}
          inverted // 스크롤 방향 반전 (최신 메시지가 아래)
          contentContainerStyle={styles.messageList}
          onRefresh={refresh}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.flatList}
        />

        {/* 입력창 */}
        <ChatInput onSend={sendMessage} onAttach={handleAttach} disabled={sending} />
      </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 8,
  },
});

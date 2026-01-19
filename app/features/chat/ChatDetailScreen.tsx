import React, { useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import { KeyboardProvider, KeyboardStickyView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider, GNB, ScreenWrapper, useTheme } from '@/design-system';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { useChat } from '@/app/shared/contexts';
import type { MessageSection } from '@/app/shared/types';
import { useChatDetail } from './hooks';
import { DateSeparator, MessageGroup, ChatInput, TransactionCompleteRequestMessage } from './components';

export interface ChatDetailScreenProps {
  chatId: string;
}

// 채팅 입력창 기본 높이 (패딩 포함)
const INPUT_MIN_HEIGHT = 60;

/**
 * 키보드 높이에 반응하는 스페이서 컴포넌트
 * inverted FlatList에서 ListHeaderComponent는 화면 하단에 표시됨
 * 키보드가 올라오면 스페이서 높이가 증가하여 메시지들이 위로 밀려남
 */
function KeyboardSpacer() {
  const { height } = useReanimatedKeyboardAnimation();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    // 기본: 입력창 높이 + safe area bottom (키보드 없을 때)
    // 키보드 올라올 때: 입력창 높이 + 키보드 높이
    const baseHeight = 0;//INPUT_MIN_HEIGHT;
    const keyboardOffset = Math.abs(height.value) > 0 ? Math.abs(height.value) : insets.bottom;
    return {
      height: keyboardOffset - 44,      
    };
  });

  return <Animated.View style={animatedStyle} />;
}

/**
 * 채팅 상세 화면의 내부 컴포넌트
 * KeyboardProvider 내부에서 useReanimatedKeyboardAnimation 훅 사용
 */
function ChatDetailContent({ chatId }: ChatDetailScreenProps) {
  const { theme } = useTheme();
  const { back } = useThrottledNavigation();
  const { refreshUnreadCount } = useChat();
  const { chatRoom, messageSections, loading, sending, sendMessage, handleAttach, refresh } = useChatDetail(chatId);

  useEffect(() => {
    return () => {
      refreshUnreadCount();
    };
  }, [refreshUnreadCount]);

  const handleOptionsPress = () => {
    Alert.alert('채팅 옵션', '추후 구현 예정입니다.');
  };

  const handleCompleteTransaction = () => {
    Alert.alert('거래 완료', '거래가 완료되었습니다.');
  };

  const renderSection = useCallback(({ item, index }: { item: MessageSection; index: number }) => (
    <View>
      <DateSeparator date={item.date} />
      {item.groups.map((group, groupIndex) => {
        const isSystemMessageGroup =
          group.sender === 'system' && group.messages.every((m) => m.message.type === 'system');

        if (isSystemMessageGroup) {
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
  ), [chatRoom?.participant.profileImageUri]);

  // 키보드 스페이서 컴포넌트 메모이제이션
  const renderListHeader = useCallback(() => <KeyboardSpacer />, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
      </View>
    );
  }

  if (!chatRoom) {
    return (
      <View style={styles.errorContainer}>
        <GNB
          leftSection={{ type: 'back', onPress: back }}
          centerSection={{ type: 'title', text: '채팅' }}
        />
      </View>
    );
  }

  return (
    <ScreenWrapper preset="fullscreen" style={styles.container}>
      <GNB
        leftSection={{ type: 'back', onPress: back }}
        centerSection={{
          type: 'title',
          text: chatRoom.participant.nickname.length > 15
            ? chatRoom.participant.nickname.substring(0, 15) + '...'
            : chatRoom.participant.nickname,
        }}
        rightIcons={[{ type: 'menu', onPress: handleOptionsPress }]}
      />
      <Divider />

      <View style={styles.contentContainer}>
        <FlatList
          data={messageSections.slice().reverse()}
          renderItem={renderSection}
          keyExtractor={(item) => item.date}
          inverted
          // inverted FlatList에서 ListHeaderComponent는 하단에 표시됨
          // 키보드 높이에 반응하는 스페이서로 메시지가 가려지지 않도록 함
          ListHeaderComponent={renderListHeader}
          onRefresh={refresh}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.flatList}
          // 인스타그램 스타일: 드래그로 키보드 내리기
          keyboardDismissMode="interactive"
        />

        {/* 키보드와 함께 움직이는 입력창 */}
        <KeyboardStickyView offset={{ closed: 0, opened: 50 }}>
          <ChatInput onSend={sendMessage} onAttach={handleAttach} disabled={sending} />
        </KeyboardStickyView>
      </View>
    </ScreenWrapper>
  );
}

export default function ChatDetailScreen({ chatId }: ChatDetailScreenProps) {
  return (
    <KeyboardProvider statusBarTranslucent>
      <ChatDetailContent chatId={chatId} />
    </KeyboardProvider>
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
  flatList: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
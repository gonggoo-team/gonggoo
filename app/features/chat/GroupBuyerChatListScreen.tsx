/**
 * GroupBuyerChatListScreen
 *
 * 공구장 시점: 특정 공구 상품의 공구원들과의 채팅 목록 화면입니다.
 * - GNB: 뒤로가기 + 상품명
 * - 상품 정보 헤더: 상품 이미지, 타이틀, 진행률
 * - 채팅 목록: 공구원들과의 1:1 채팅
 * - 하단 버튼: 거래완료 요청
 * - 거래완료 요청 모드: 체크박스 + 전체 선택 + 전송
 */

import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GNB, useTheme, Divider, Button, StatusBadge, ProgressBar, ScreenWrapper } from '@/design-system';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { getMockGroupBuyerChats, sendMockSystemMessage } from '@/app/shared/services/mock';
import type { ChatRoomItem } from '@/app/shared/types';
import { ChatListItem } from './components';
import { TransactionCompleteModal } from './components/TransactionCompleteModal';

export interface GroupBuyerChatListScreenProps {
  productId: string;
}

export default function GroupBuyerChatListScreen({ productId }: GroupBuyerChatListScreenProps) {
  const { theme } = useTheme();
  const { back, push } = useThrottledNavigation();

  // 채팅 목록 로드
  const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 거래 완료 요청 모드
  const [isRequestMode, setIsRequestMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * 채팅 목록 로드 함수
   */
  const loadChatRooms = useCallback(() => {
    setLoading(true);
    const rooms = getMockGroupBuyerChats(productId);
    setChatRooms(rooms);
    setLoading(false);
  }, [productId]);

  /**
   * productId가 변경될 때마다 채팅 목록 재로드
   */
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  /**
   * 화면 포커스 시 채팅 목록 새로고침
   * (채팅 상세에서 돌아왔을 때 안 읽은 메시지 카운트 업데이트)
   */
  useFocusEffect(
    useCallback(() => {
      loadChatRooms();
    }, [loadChatRooms])
  );

  // 공구 상품 정보 (첫 번째 채팅방에서 가져옴)
  const productInfo = chatRooms[0]?.product;
  const groupBuyInfo = productInfo?.groupBuyProgress;

  /**
   * 채팅 아이템 클릭 핸들러
   */
  const handleChatPress = useCallback(
    (chatId: string) => {
      if (isRequestMode) {
        // 거래 완료 요청 모드일 때는 선택 토글
        handleToggleSelect(chatId);
      } else {
        // 일반 모드일 때는 채팅 상세로 이동
        push(`/chat/${chatId}`);
      }
    },
    [isRequestMode, push]
  );

  /**
   * 선택 토글
   */
  const handleToggleSelect = useCallback((chatId: string) => {
    setSelectedChats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chatId)) {
        newSet.delete(chatId);
      } else {
        newSet.add(chatId);
      }
      return newSet;
    });
  }, []);

  /**
   * 전체 선택
   */
  const handleSelectAll = useCallback(() => {
    if (selectedChats.size === chatRooms.length) {
      setSelectedChats(new Set());
    } else {
      setSelectedChats(new Set(chatRooms.map((room) => room.id)));
    }
  }, [chatRooms, selectedChats]);

  /**
   * 거래 완료 요청 모드 토글
   */
  const handleToggleRequestMode = useCallback(() => {
    setIsRequestMode((prev) => !prev);
    setSelectedChats(new Set());
  }, []);

  /**
   * 거래 완료 요청 전송
   */
  const handleSendRequest = useCallback(() => {
    if (selectedChats.size === 0) {
      return;
    }
    setShowConfirmModal(true);
  }, [selectedChats]);

  /**
   * 거래 완료 요청 확인
   */
  const handleConfirmRequest = useCallback(() => {
    // 선택된 채팅방들에 거래 완료 요청 시스템 메시지 전송
    Array.from(selectedChats).forEach((chatId) => {
      sendMockSystemMessage(chatId, 'transaction_complete_request');
    });

    if (__DEV__) console.log('거래 완료 요청 전송:', Array.from(selectedChats));
    setShowConfirmModal(false);
    setIsRequestMode(false);
    setSelectedChats(new Set());

    // 채팅 목록 새로고침
    loadChatRooms();
  }, [selectedChats, loadChatRooms]);

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

  /**
   * 빈 상태 렌더링
   */
  const renderEmptyState = useCallback(
    () => (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
        <Text style={[styles.emptyText, { color: theme.colors.surface.texticon.onnormal.text.midEmp }]}>
          공구원과의 채팅이 없습니다
        </Text>
      </View>
    ),
    [theme]
  );

  /**
   * 상품 정보 헤더
   */
  const renderHeader = useCallback(
    () =>
      productInfo && groupBuyInfo ? (
        <View style={[styles.headerContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          <View style={styles.headerContent}>
            {/* 상품 이미지 */}
            <Image source={{ uri: productInfo.thumbnailUri }} style={styles.productImage} resizeMode="cover" />

            {/* 상품 정보 */}
            <View style={styles.productInfo}>
              {/* 상태 배지 - 공구 상태에 따라 동적 표시 */}
              <View style={styles.badgeRow}>
                {/* 모집 상태 배지 */}
                {groupBuyInfo.status === '모집 중' ? (
                  <StatusBadge
                    type="recruiting"
                    label={groupBuyInfo.status}
                    variant="card"
                    customPadding={{ vertical: 3, horizontal: 6 }}
                  />
                ) : groupBuyInfo.status === '모집 마감' ? (
                  <StatusBadge
                    type="closed"
                    label={groupBuyInfo.status}
                    variant="card"
                    customPadding={{ vertical: 3, horizontal: 6 }}
                  />
                ) : (
                  <StatusBadge
                    type="recruiting"
                    label={groupBuyInfo.status}
                    variant="card"
                    customPadding={{ vertical: 3, horizontal: 6 }}
                  />
                )}

                {/* 기한 배지 */}
                <StatusBadge
                  type="deadline"
                  label={groupBuyInfo.deadline + ' 마감'}
                  variant="card"
                  customBackgroundColor={theme.colors.border.highEmp}
                  customTextColor={theme.colors.surface.texticon.onnormal.text.white}
                  customPadding={{ vertical: 3, horizontal: 6 }}
                />
              </View>

              {/* 상품명 */}
              <Text
                style={[
                  styles.productTitle,
                  {
                    fontFamily: theme.typography.fontFamily.primary,
                    color: theme.colors.surface.texticon.onnormal.text.black,
                  },
                ]}
                numberOfLines={1}
              >
                {productInfo.title}
              </Text>

              {/* 진행률 */}
              <ProgressBar percentage={groupBuyInfo.progressPercentage} variant="dark" />
            </View>
          </View>
          <Divider />
        </View>
      ) : null,
    [productInfo, groupBuyInfo, theme]
  );

  if (loading) {
    return (
      <ScreenWrapper preset="fullscreen" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper preset="fullscreen" style={styles.container}>
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back',
          onPress: back,
        }}
        centerSection={{
          type: 'title',
          text: isRequestMode ? '거래완료 요청' : (productInfo?.title ? productInfo.title : '채팅'),
        }}
        rightTextButton={
          isRequestMode
            ? {
                type: 'text-button',
                text: '선택 취소',
                onPress: handleToggleRequestMode,
                variant: 'secondary',
              }
            : undefined
        }
        rightIcons={
          !isRequestMode
            ? [
                {
                  type: 'menu',
                  onPress: () => {
                    // TODO: 메뉴 액션 구현
                  },
                },
              ]
            : undefined
        }
      />
      <Divider />

      {/* 상품 정보 헤더 */}
      {renderHeader()}

      {/* 채팅 목록 */}
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            {...item}
            userRole="participant"
            showProductThumbnail={false}
            selected={selectedChats.has(item.id)}
            onPress={() => handleChatPress(item.id)}
            onSelect={isRequestMode ? () => handleToggleSelect(item.id) : undefined}
          />
        )}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={chatRooms.length === 0 ? styles.emptyList : undefined}
      />

      {/* 하단 버튼 영역 */}
      {isRequestMode ? (
        // 거래 완료 요청 모드: 전체 선택 + 전송
        <View style={[styles.bottomButtonContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          <View style={styles.bottomButtonRow}>
            <Button
              variant="square-unselected"
              onPress={handleSelectAll}
              style={styles.selectAllButton}
            >
              전체 선택
            </Button>
            <Button
              variant="square-unselected"
              onPress={handleSendRequest}
              disabled={selectedChats.size === 0}
              style={styles.sendButton}
              textStyle={
                selectedChats.size > 0
                  ? { color: theme.colors.surface.brand.primary }
                  : undefined
              }
            >
              전송
            </Button>
          </View>
        </View>
      ) : (
        // 일반 모드: 거래완료 요청 버튼
        <View style={[styles.bottomButtonContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          <Button variant="full-secondary-rounded" onPress={handleToggleRequestMode}>
            거래완료 요청
          </Button>
        </View>
      )}

      {/* 거래 완료 확인 모달 */}
      <TransactionCompleteModal
        visible={showConfirmModal}
        selectedCount={selectedChats.size}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRequest}
      />
    </ScreenWrapper>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },

  // 상품 정보 헤더
  headerContainer: {
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    gap: 16,
    padding: 10,
    paddingHorizontal: 20,
  },
  productImage: {
    width: 144,
    height: 150,
    borderRadius: 4,
    flexShrink: 0, // 이미지 크기 고정
  },
  productInfo: {
    flex: 1,
    gap: 18,
    minWidth: 0, // flex 자식의 텍스트 오버플로우 방지
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap', // 배지가 많을 경우 줄바꿈
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 15.6, // 1.2em
  },

  // 하단 버튼
  bottomButtonContainer: {
    padding: 15,
    paddingTop: 13,
  },
  bottomButtonRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 5,
  },
  selectAllButton: {
    flex: 1,
  },
  sendButton: {
    flex: 2,
  },
});

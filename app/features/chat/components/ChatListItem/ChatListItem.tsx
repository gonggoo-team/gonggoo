/**
 * ChatListItem Component
 *
 * 채팅 목록의 개별 아이템 컴포넌트입니다.
 * - 공구원 시점: 유저 아바타(원형) + 상품 썸네일(네모)  오버레이
 * - 공구장 시점: 상품 썸네일(네모)만
 * - 닉네임, 타임스탬프, 메시지 미리보기
 * - 안 읽은 메시지 배지
 *
 * Figma 참고:
 * - 공구원: 원 + 네모 형태
 * - 공구장: 네모만
 */

import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme, CountBadge, Icon } from '@/design-system';
import { formatChatTimestamp } from '../../utils';
import { createChatListItemStyles } from './ChatListItem.styles';
import type { ChatListItemProps } from './ChatListItem.types';

/**
 * ChatListItem Component
 *
 * React.memo로 감싸서 불필요한 리렌더링 방지
 * - props가 변경되지 않으면 리렌더링하지 않음
 * - 성능 최적화를 위해 적용
 */
export const ChatListItem = React.memo<ChatListItemProps>(({
  participant,
  product,
  lastMessage,
  unreadCount,
  userRole,
  onPress,
  selected,
  onSelect,
  showProductThumbnail = true,
}) => {
  const { theme } = useTheme();
  const styles = createChatListItemStyles(theme);

  // 타임스탬프 포맷팅
  const formattedTime = formatChatTimestamp(lastMessage.timestamp);

  // 닉네임의 첫 글자 (프로필 이미지가 없을 때 표시)
  const firstLetter = participant.nickname.charAt(0);

  // 공구원 시점: 원(공구장 프로필) + 네모(상품 이미지)
  // 공구장 시점: 네모(상품 이미지)만
  const isParticipantView = userRole === 'participant';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${participant.nickname}와의 채팅, ${formattedTime}, ${
        unreadCount > 0 ? `안 읽은 메시지 ${unreadCount}개` : '읽음'
      }`}
    >
      {/* 체크박스 (거래 완료 요청 모드일 때만 표시) */}
      {onSelect && (
        <TouchableOpacity onPress={onSelect} activeOpacity={0.7} style={styles.checkboxContainer}>
          <Icon
            name={selected ? 'check-box-fill' : 'check-box-empty'}
            size={24}
            color={selected ? theme.colors.surface.brand.primary : theme.colors.border.midEmp}
          />
        </TouchableOpacity>
      )}

      {/* 아바타 섹션 */}
      <View style={styles.avatarSection}>
        {isParticipantView ? (
          // 공구원 시점: 원형 프로필 (+ 옵션: 네모 상품 이미지)
          <>
            {/* 유저 아바타 (공구장 프로필) */}
            {participant.profileImageUri ? (
              <Image
                source={{ uri: participant.profileImageUri }}
                style={styles.userAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
                <Text style={styles.placeholderText}>{firstLetter}</Text>
              </View>
            )}

            {/* 상품 썸네일 (오버레이) - showProductThumbnail이 true일 때만 표시 */}
            {showProductThumbnail && (
              <Image
                source={{ uri: product.thumbnailUri }}
                style={styles.productThumbnail}
                resizeMode="cover"
              />
            )}
          </>
        ) : (
          // 공구장 시점: 네모 상품 이미지만
          <Image
            source={{ uri: product.thumbnailUri }}
            style={styles.productThumbnailOnly}
            resizeMode="cover"
          />
        )}
      </View>

      {/* 콘텐츠 섹션 */}
      <View style={styles.contentSection}>
        {/* Row 1: 타이틀 (공구원: 닉네임, 공구장: 상품명) + 타임스탬프 */}
        <View style={styles.topRow}>
          <Text style={styles.nickname} numberOfLines={1}>
            {isParticipantView ? participant.nickname : product.title}
          </Text>
          <Text style={styles.timestamp}>{formattedTime}</Text>
        </View>

        {/* Row 2: 메시지 미리보기 + CountBadge */}
        {isParticipantView ? (
          // 공구원 시점: 메시지 미리보기 + CountBadge
          <View style={styles.bottomRow}>
            <Text style={styles.messagePreview} numberOfLines={1} ellipsizeMode="tail">
              {lastMessage.content}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <CountBadge count={unreadCount} variant="tabbar" />
              </View>
            )}
          </View>
        ) : (
          // 공구장 시점: CountBadge만 표시 (우측 정렬)
          unreadCount > 0 && (
            <View style={[styles.bottomRow, { justifyContent: 'flex-end' }]}>
              <View style={styles.badgeContainer}>
                <CountBadge count={unreadCount} variant="tabbar" />
              </View>
            </View>
          )
        )}
      </View>
    </TouchableOpacity>
  );
});

ChatListItem.displayName = 'ChatListItem';

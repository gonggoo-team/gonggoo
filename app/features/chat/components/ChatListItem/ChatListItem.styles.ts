/**
 * ChatListItem Component Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '@/design-system';

/**
 * ChatListItem 스타일 생성 함수
 */
export const createChatListItemStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: theme.spacing.lg, // 20px
      backgroundColor: theme.colors.surface.normal.bg1,
    },

    // 체크박스 (거래 완료 요청 모드)
    checkboxContainer: {
      padding: 0,
      marginRight: 0,
    },

    // 아바타 섹션 (52px 너비)
    avatarSection: {
      width: 52,
      height: 48,
      position: 'relative',
    },

    // 유저 아바타 (36x36px 원형)
    userAvatar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 36,
      height: 36,
      borderRadius: 18, // 완전한 원
      backgroundColor: theme.colors.surface.normal.bg2, // #F5F5F5
      borderWidth: 1,
      borderColor: theme.colors.border.lowEmp, // #E1E1E1
    },

    // 유저 아바타 - 프로필 이미지가 없을 때 기본 색상
    userAvatarPlaceholder: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    // 프로필 이미지가 없을 때 표시할 텍스트
    placeholderText: {
      fontSize: theme.typography.fontSize.sm, // 12px
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.surface.texticon.onnormal.text.midEmp,
    },

    // 상품 썸네일 (32x32px 둥근 사각형, 우측 하단 오버레이)
    productThumbnail: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundColor: theme.colors.surface.normal.bg2,
      borderWidth: 1,
      borderColor: theme.colors.surface.normal.bg1, // 흰색 테두리
    },

    // 상품 썸네일만 (공구장 시점, 48x48px 둥근 사각형)
    productThumbnailOnly: {
      width: 48,
      height: 48,
      borderRadius: 6,
      backgroundColor: theme.colors.surface.normal.bg2,
      borderWidth: 1,
      borderColor: theme.colors.border.lowEmp, // #E1E1E1
    },

    // 콘텐츠 섹션
    contentSection: {
      flex: 1,
      justifyContent: 'center',
      gap: 2,
      paddingVertical: theme.spacing.xxs7, // 7px (5px in figma + adjustment)
    },

    // Row 1: 닉네임 + 타임스탬프
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 15,
    },

    nickname: {
      fontSize: theme.typography.fontSize.sm, // 12px
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: 14.4, // 12 * 1.2
      color: theme.colors.surface.texticon.onnormal.text.black,
    },

    timestamp: {
      fontSize: theme.typography.fontSize.xxs, // 10px
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: 12, // 10 * 1.2
      color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
      textAlign: 'right',
    },

    // Row 2: 메시지 미리보기 + CountBadge
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 15,
    },

    messagePreview: {
      flex: 1,
      fontSize: theme.typography.fontSize.xxs, // 10px
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: 12, // 10 * 1.2
      color: theme.colors.surface.texticon.onnormal.text.black,
      paddingTop: 4,
    },

    // 안 읽은 배지 위치
    badgeContainer: {
      flexShrink: 0,
    },
  });

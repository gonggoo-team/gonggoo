/**
 * FloatingActionBar Component
 *
 * 하단에 고정된 플로팅 액션 바 컴포넌트입니다.
 * - 좋아요, 채팅 아이콘 버튼
 * - 참여하기 메인 버튼
 * - 상단 화살표 (선택적)
 *
 * Figma: Frame 6117
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
import type { FloatingActionBarProps } from './FloatingActionBar.types';

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  onLikePress,
  onChatPress,
  onJoinPress,
  isLiked = false,
  joinDisabled = false,
  joinButtonText = '참여하기',
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
        },
      ]}
    >
      {/* 상단 화살표 (선택적) */}
      {/* <View style={styles.arrowSection}>
        <Icon name="arrow-up" size={44} color="#E1E1E1" />
      </View> */}

      {/* 메인 액션 영역 */}
      <View style={styles.actionSection}>
        {/* 좌측 아이콘 버튼들 */}
        <View style={styles.iconButtons}>
          {/* 좋아요 버튼 */}
          <TouchableOpacity
            onPress={onLikePress}
            activeOpacity={0.7}
            accessibilityLabel="좋아요"
          >
            <Icon
              name={isLiked ? 'heart-fill' : 'heart-line'}
              size={24}
              color={theme.colors.surface.texticon.onnormal.icon.tabBar} // #9C9DA4
            />
          </TouchableOpacity>

          {/* 채팅 버튼 */}
          <TouchableOpacity
            onPress={onChatPress}
            activeOpacity={0.7}
            accessibilityLabel="채팅"
          >
            <Icon
              name="chat-line"
              size={24}
              color={theme.colors.surface.texticon.onnormal.icon.highEmp} // #A6A6A6
            />
          </TouchableOpacity>
        </View>

        {/* 참여하기 버튼 */}
        <TouchableOpacity
          style={[
            styles.joinButton,
            {
              backgroundColor: joinDisabled
                ? theme.colors.surface.env.disabled
                : theme.colors.surface.brand.primary, // #006242
            },
          ]}
          onPress={onJoinPress}
          activeOpacity={0.8}
          disabled={joinDisabled}
          accessibilityLabel={joinButtonText}
        >
          <Text
            style={{
              fontSize: theme.typography.fontSize.md, // 16px
              fontWeight: theme.typography.fontWeight.semiBold, // 600
              lineHeight: theme.typography.fontSize.md * 1.4,
              letterSpacing: theme.typography.getLetterSpacing(16),
              color: theme.colors.surface.normal.bg1, // #FFFFFF
            }}
          >
            {joinButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 34, // bottom bar 공간 (iOS safe area 고려)
  },
  arrowSection: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6, // Figma 기준
    gap: 10,
  },
  iconButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  joinButton: {
    width: 230,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * FloatingActionButton Component
 *
 * 화면 우하단에 고정되는 플로팅 액션 버튼 컴포넌트입니다.
 * Expo Router가 Safe Area를 자동 처리하므로 일관된 위치를 보장합니다.
 *
 * 위치 계산:
 * - Figma 기준: 화면 하단에서 109.5px
 * - 탭바 높이(84px) + 버튼 간격(25px) = 109px
 *
 * 사용 예시:
 * ```tsx
 * <FloatingActionButton
 *   onPress={() => console.log('Pressed')}
 *   icon="plus"
 *   accessibilityLabel="상품 등록"
 * />
 * ```
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
import type { FloatingActionButtonProps } from './FloatingActionButton.types';

/**
 * 기본 탭바 높이 (84px, Figma 기준)
 * Expo Router Tabs는 safe area를 자동 처리하므로 별도 계산 불필요
 */
const TAB_BAR_HEIGHT = 84;

/**
 * 탭바와 플로팅 버튼 사이 간격 (25px, Figma 기준 25.5px)
 *
 * Figma 측정값 (iPhone X 기준 375×812):
 * - 화면 하단에서 버튼까지: 812 - 646.5 - 56 = 109.5px
 * - 화면 하단에서 탭바까지: 812 - 728 = 84px
 * - 버튼과 탭바 간격: 109.5 - 84 = 25.5px
 *
 * 구현값: TAB_BAR_HEIGHT(84) + BUTTON_SPACING(25) = 109px
 * 차이: 0.5px (시각적으로 무시 가능)
 */
const BUTTON_SPACING = 25;

/**
 * FloatingActionButton Component
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  bottom,
  right = 20,
  icon = 'plus',
  accessibilityLabel = '플로팅 액션 버튼',
}) => {
  const { theme } = useTheme();

  // bottom 위치 계산: 탭바 높이 + 버튼 간격
  // Expo Router가 safe area를 자동 처리하므로 insets 불필요
  const calculatedBottom = bottom ?? TAB_BAR_HEIGHT + BUTTON_SPACING;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          bottom: calculatedBottom,
          right: right,
          backgroundColor: theme.colors.surface.brand.primary,
          shadowColor: theme.shadows.xl.shadowColor,
          shadowOffset: theme.shadows.xl.shadowOffset,
          shadowOpacity: theme.shadows.xl.shadowOpacity,
          shadowRadius: theme.shadows.xl.shadowRadius,
          elevation: theme.shadows.xl.elevation,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      android_ripple={{
        color: 'rgba(255, 255, 255, 0.3)',
      }}
    >
      <Icon
        name={icon}
        size={24}
        color={theme.colors.surface.texticon.onnormal.text.white}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

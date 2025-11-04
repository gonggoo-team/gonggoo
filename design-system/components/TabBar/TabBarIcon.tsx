/**
 * TabBarIcon Component
 *
 * 하단 탭바에서 사용되는 아이콘 컴포넌트입니다.
 * - 선택 시 fill 아이콘, 비선택 시 line 아이콘 표시
 * - 선택 시 green 색상, 비선택 시 tabBar 색상
 * - 반응형 레이아웃 (flex: 1, minWidth, maxWidth)
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=249-1477&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <TabBarIcon
 *   name="home"
 *   focused={true}
 *   label="홈"
 * />
 * ```
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
import { createTabBarIconStyles } from './TabBarIcon.styles';
import type { TabBarIconProps } from './TabBarIcon.types';
import { TAB_ICON_MAP } from './TabBarIcon.types';

/**
 * TabBarIcon Component
 */
export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused, label }) => {
  const { theme } = useTheme();
  const styles = createTabBarIconStyles(theme, focused);

  // 선택 상태에 따라 fill 또는 line 아이콘 선택
  const iconName = focused ? TAB_ICON_MAP[name].fill : TAB_ICON_MAP[name].line;

  // 선택 상태에 따라 색상 선택
  const iconColor = focused
    ? theme.colors.surface.texticon.onnormal.text.green // #006242 (선택됨)
    : theme.colors.surface.texticon.onnormal.icon.tabBar; // #9C9DA4 (선택 안됨)

  return (
    <View style={styles.container}>
      <Icon name={iconName} size={24} color={iconColor} />
      {/* <Text style={styles.label}>{label}</Text> */}
    </View>
  );
};

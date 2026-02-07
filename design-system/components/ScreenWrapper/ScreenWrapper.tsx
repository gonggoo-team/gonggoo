/**
 * ScreenWrapper Component
 *
 * Safe Area를 통합 관리하는 화면 래퍼 컴포넌트입니다.
 * 각 화면에서 개별적으로 SafeAreaView를 설정하는 대신,
 * 이 컴포넌트를 사용하여 일관된 Safe Area 처리를 합니다.
 *
 * @example
 * // 기본 사용 (상단 safe area)
 * <ScreenWrapper>
 *   <Content />
 * </ScreenWrapper>
 *
 * @example
 * // 탭 화면 (safe area 없음, 탭바가 처리)
 * <ScreenWrapper preset="tab">
 *   <Content />
 * </ScreenWrapper>
 *
 * @example
 * // 커스텀 edges
 * <ScreenWrapper edges={['top', 'bottom']}>
 *   <Content />
 * </ScreenWrapper>
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks';
import type { ScreenWrapperProps, SafeAreaEdge } from './ScreenWrapper.types';
import { SCREEN_PRESETS } from './ScreenWrapper.types';

export function ScreenWrapper({
  children,
  preset = 'default',
  edges,
  style,
  backgroundColor,
  testID,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // edges가 명시적으로 제공되면 사용, 아니면 preset의 기본값 사용
  const activeEdges: SafeAreaEdge[] = edges ?? SCREEN_PRESETS[preset];

  // 동적 스타일 계산 (메모이제이션)
  const containerStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: backgroundColor ?? theme.colors.surface.normal.bg1,
      paddingTop: activeEdges.includes('top') ? insets.top : 0,
      paddingBottom: activeEdges.includes('bottom') ? insets.bottom : 0,
      paddingLeft: activeEdges.includes('left') ? insets.left : 0,
      paddingRight: activeEdges.includes('right') ? insets.right : 0,
    }),
    [activeEdges, insets, backgroundColor, theme.colors.surface.normal.bg1]
  );

  return (
    <View style={[containerStyle, style]} testID={testID}>
      {children}
    </View>
  );
}

/**
 * 스타일시트 (현재는 사용하지 않지만 확장성을 위해 유지)
 */
const styles = StyleSheet.create({
  // 향후 추가 스타일을 위한 placeholder
});

export default ScreenWrapper;

/**
 * useHeaderScrollAnimation Hook
 *
 * 스크롤 위치에 따른 헤더 애니메이션을 관리합니다.
 */

import { useRef, useMemo } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '@/design-system';

const IMAGE_HEIGHT = 390;
const HEADER_THRESHOLD = IMAGE_HEIGHT - 60;

export function useHeaderScrollAnimation() {
  const { theme } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerBackgroundColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [HEADER_THRESHOLD - 50, HEADER_THRESHOLD],
        outputRange: ['transparent', theme.colors.surface.normal.bg1],
        extrapolate: 'clamp',
      }),
    [scrollY, theme.colors.surface.normal.bg1]
  );

  const whiteIconOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [HEADER_THRESHOLD - 50, HEADER_THRESHOLD],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
    [scrollY]
  );

  const blackIconOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [HEADER_THRESHOLD - 50, HEADER_THRESHOLD],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY]
  );

  return {
    scrollY,
    headerBackgroundColor,
    whiteIconOpacity,
    blackIconOpacity,
  };
}

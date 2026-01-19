/**
 * CategoryTabItem Component
 *
 * 카테고리 탭 바의 개별 항목입니다.
 * - 선택 시: 16px semiBold green, 하단 2px border
 * - 비선택 시: 15px medium midEmp
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=545-9534&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <CategoryTabItem
 *   category="home"
 *   isSelected={true}
 *   onPress={(category) => handlePress(category)}
 * />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks';
import type { CategoryTabItemProps } from '../CategoryTabBar.types';
import { CATEGORY_LABELS } from '../CategoryTabBar.types';

/** 터치 영역 확대를 위한 hitSlop */
const HIT_SLOP = { top: 4, right: 4, bottom: 4, left: 4 };

/**
 * CategoryTabItem Component (React.memo로 최적화)
 */
export const CategoryTabItem = React.memo<CategoryTabItemProps>(({
  category,
  isSelected,
  onPress,
}) => {
  const { theme } = useTheme();

  // 스타일 메모이제이션
  const textStyle = useMemo(() => ({
    fontSize: isSelected ? theme.typography.fontSize.md : 15,
    fontWeight: isSelected
      ? theme.typography.fontWeight.semiBold
      : theme.typography.fontWeight.medium,
    color: isSelected
      ? theme.colors.surface.texticon.onnormal.text.green
      : theme.colors.surface.texticon.onnormal.text.midEmp,
    lineHeight: 18,
    letterSpacing: theme.typography.getLetterSpacing(isSelected ? 16 : 15),
  }), [isSelected, theme]);

  const containerStyle = useMemo(() => [
    styles.container,
    {
      borderBottomWidth: isSelected ? 2 : 0,
      borderBottomColor: theme.colors.border.brand.primary,
    },
  ], [isSelected, theme.colors.border.brand.primary]);

  // Pressable 스타일 헬퍼
  const getPressedStyle = useCallback(
    ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
      containerStyle,
      pressed && { opacity: 0.7 },
    ],
    [containerStyle]
  );

  // 핸들러 메모이제이션
  const handlePress = useCallback(() => {
    onPress(category);
  }, [onPress, category]);

  return (
    <Pressable
      style={getPressedStyle}
      onPress={handlePress}
      delayPressIn={0}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`${CATEGORY_LABELS[category]} 카테고리`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={textStyle}>{CATEGORY_LABELS[category]}</Text>
    </Pressable>
  );
});

CategoryTabItem.displayName = 'CategoryTabItem';

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

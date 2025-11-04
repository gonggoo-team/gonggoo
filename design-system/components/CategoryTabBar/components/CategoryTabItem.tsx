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
 *   onPress={() => handlePress('home')}
 * />
 * ```
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks';
import type { CategoryTabItemProps } from '../CategoryTabBar.types';
import { CATEGORY_LABELS } from '../CategoryTabBar.types';

/**
 * CategoryTabItem Component
 */
export const CategoryTabItem: React.FC<CategoryTabItemProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  const { theme } = useTheme();

  // 선택 상태에 따른 스타일
  const textStyle = {
    fontSize: isSelected ? theme.typography.fontSize.md : 15, // 16px : 15px
    fontWeight: isSelected
      ? theme.typography.fontWeight.semiBold // 600
      : theme.typography.fontWeight.medium, // 500
    color: isSelected
      ? theme.colors.surface.texticon.onnormal.text.green // #006242
      : theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
    lineHeight: 18, // Figma 기준 (16 * 1.193359375 ≈ 19.09, 하지만 Figma에서 실제로는 18로 보임)
    letterSpacing: theme.typography.getLetterSpacing(isSelected ? 16 : 15),
  };

  // 하단 border 스타일
  const borderBottomWidth = isSelected ? 2 : 0;
  const borderBottomColor = theme.colors.border.brand.primary; // #006242

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderBottomWidth,
          borderBottomColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${CATEGORY_LABELS[category]} 카테고리`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={textStyle}>{CATEGORY_LABELS[category]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70, // Figma 기준 고정 너비
    height: 43, // Figma 기준 고정 높이
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10, // Figma 기준
  },
});

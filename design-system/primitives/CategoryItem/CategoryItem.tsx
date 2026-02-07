/**
 * CategoryItem Component
 *
 * 카테고리 선택을 위한 개별 아이템 컴포넌트입니다.
 * - 라벨 + 우측 화살표 아이콘
 * - 하단 테두리 (선택적)
 * - 접근성 지원
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=796-11940
 * 마지막 동기화: 2025-10-27
 *
 * 사용 예시:
 * ```tsx
 * <CategoryItem
 *   label="식품"
 *   onPress={() => handleCategoryPress('food')}
 *   showBorder={true}
 * />
 * ```
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import type { CategoryItemProps } from './CategoryItem.types';

/**
 * CategoryItem Component
 */
export const CategoryItem: React.FC<CategoryItemProps> = ({
  label,
  onPress,
  showBorder = true,
}) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      delayLongPress={300}
      android_ripple={{
        color: theme.colors.surface.normal.container10,
        borderless: false,
      }}
      accessibilityRole="button"
      accessibilityLabel={`${label} 카테고리`}
      style={({ pressed }) => [
        styles.container,
        {
          paddingVertical: theme.spacing.md,
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: theme.colors.border.lowEmp, // #E1E1E1
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {/* 카테고리 라벨 */}
      <Text
        style={{
          fontFamily: theme.typography.fontFamily.primary,
          fontSize: theme.typography.fontSize.md15, // 15px
          fontWeight: theme.typography.fontWeight.medium, // 500
          letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.md15),
          lineHeight:
            theme.typography.fontSize.md15 * theme.typography.lineHeight.tight, // 1.2
          color: theme.colors.surface.texticon.onnormal.text.black,
        }}
        numberOfLines={1}
      >{label}</Text>

      {/* 우측 화살표 아이콘 (View로 래핑하여 회전) */}
      <View style={{paddingRight: 6}}>
        <Icon
          name="back-mini"
          size={12}
          color={theme.colors.surface.texticon.onnormal.icon.lowEmp} // #D1D6DA
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

/**
 * ProductLike Component
 *
 * 좋아요 버튼 컴포넌트입니다.
 * 하트 아이콘과 개수를 표시합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 */

import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { useTheme } from '../../../hooks';
import { Icon } from '../../../primitives/Icon';

/**
 * ProductLike Props
 */
export interface ProductLikeProps {
  /**
   * 좋아요 개수
   */
  count?: number;

  /**
   * 클릭 핸들러
   */
  onPress: () => void;

  /**
   * 위치 (absolute 또는 relative)
   * @default 'relative'
   */
  position?: 'absolute' | 'relative';
}

/**
 * ProductLike Component
 */
export const ProductLike = React.memo<ProductLikeProps>(({
  count,
  onPress,
  position = 'relative',
}) => {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        // position === 'absolute' && {
        //   position: 'absolute' as const,
        //   top: theme.spacing.xs, // 8px → 10px (Figma)
        //   right: theme.spacing.xs, // 8px → 10px (Figma)
        // },
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      delayPressIn={0}
      delayLongPress={300}
      android_ripple={{
        color: theme.colors.surface.normal.container10,
        borderless: true,
      }}
      accessibilityRole="button"
      accessibilityLabel={`좋아요 ${count}개`}
    >
      <Icon
        name="heart-fill"
        size={theme.typography.fontSize.xs}
        color={theme.colors.surface.texticon.onnormal.icon.lowEmp} // #D1D6DA
      />
      <Text
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium, // 500
          lineHeight: theme.typography.fontSize.xs,
          letterSpacing: theme.typography.getLetterSpacing(10),
          color: theme.colors.surface.texticon.onnormal.icon.lowEmp, // #D1D6DA
        }}
      >
        {count}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3, // Figma 기준 특수값    
  },
});

/**
 * SortButton Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 정렬 버튼 컴포넌트 기준 (gap: 4px)
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createSortButtonStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container (Figma: gap 4px, transparent background)
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'transparent',
      paddingVertical: theme.spacing.xxs, // 4px
      paddingHorizontal: 0,
    },

    // Label Text (Figma: fontSize 13, fontWeight 500, textAlign right, color #000)
    label: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #000000
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs13), // -0.325
      textAlign: 'right',
    },
  });

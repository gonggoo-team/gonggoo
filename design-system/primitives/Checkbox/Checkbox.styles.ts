/**
 * Checkbox Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createCheckboxStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44, // 터치 타겟 최소 크기 보장           
    },

    // Container Reverse (체크박스 우측)
    containerReverse: {
      justifyContent: 'space-between',
    },

    // Icon Container
    iconContainer: {
      width: 24,
      height: 24,
      marginRight: theme.spacing.xs, // 8px
    },

    // Label Text
    label: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm, // 14px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm), // -0.35
      // flex: 1, // 텍스트 길이에 따라 유연하게 조정
    },

    // Disabled State
    disabled: {
      opacity: theme.dimensions.opacity.disabled, // 0.6
    },

    disabledText: {
      color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
    },
  });

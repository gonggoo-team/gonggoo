/**
 * Divider Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma에서 Line 3 (stroke: #E1E1E1, strokeWeight: 2px)를 기반으로 합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createDividerStyles = (theme: Theme) =>
  StyleSheet.create({
    // Base styles
    base: {},

    // ===== Orientation =====

    horizontal: {
      height: theme.dimensions.borderWidth.medium, // 2px (Figma 기준)
      // width: '100%',
      alignSelf: 'stretch',
    },

    vertical: {
      width: theme.dimensions.borderWidth.medium, // 2px
      height: '100%',
      alignSelf: 'stretch',
    },

    // ===== Color Variants =====

    lowEmp: {
      backgroundColor: theme.colors.border.lowEmp, // #E1E1E1 (Figma 기준)
    },

    midEmp: {
      backgroundColor: theme.colors.border.midEmp, // #CACACA
    },

    highEmp: {
      backgroundColor: theme.colors.border.highEmp, // #A6A6A6
    },
  });

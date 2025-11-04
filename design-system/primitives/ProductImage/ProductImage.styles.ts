/**
 * ProductImage Styles
 *
 * 디자인 토큰을 최대한 활용한 스타일입니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';

export const createProductImageStyles = (theme: Theme, showBorder: boolean) =>
  StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: theme.radius.md, // 12px
      backgroundColor: theme.colors.surface.normal.container10, // #F5F5F5 (placeholder)
      overflow: 'hidden',
      ...(showBorder && {
        borderWidth: theme.dimensions.borderWidth.thin, // 1px
        borderColor: theme.colors.border.lowEmp, // #E1E1E1
      }),
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

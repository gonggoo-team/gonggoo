/**
 * ProgressBar Styles
 *
 * 디자인 토큰을 최대한 활용한 스타일입니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';

export const createProgressBarStyles = (theme: Theme, variant: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      height: 13, // Figma 기준 (특수값)
      borderRadius: theme.radius.md, // 12px
      backgroundColor: theme.colors.surface.texticon.onnormal.icon.lowEmp, // #D1D6DA
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface.texticon.onnormal.text.green, // #006242
      borderRadius: theme.radius.md, // 12px (좌측만)
    },
    text: {
      fontSize: theme.typography.fontSize.xxs, // 10px
      fontWeight: theme.typography.fontWeight.medium, // 500
      lineHeight: 12, // 10 * 1.2
      letterSpacing: theme.typography.getLetterSpacing(10), // -2.5%
      textAlign: 'center',
      color:
        variant === 'light'
          ? theme.colors.surface.texticon.onnormal.text.white // #FFFFFF
          : theme.colors.surface.texticon.onnormal.text.highEmp, // #181A1A
      zIndex: 1, // 진행 바 위에 표시
    },
  });

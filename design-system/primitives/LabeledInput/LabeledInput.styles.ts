/**
 * LabeledInput Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 회원가입/번호 입력 컴포넌트 기준
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createLabeledInputStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container
    container: {
      width: '100%',
      alignSelf: 'stretch',
    },

    // Label Container (padding: 10px 20px 6px)
    labelContainer: {
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 6,
    },

    // Label Text (Figma: fontSize 13, fontWeight 500, color #9FA7B1)
    label: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.lowEmp, // #9FA7B1
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs13), // -0.325
    },

    // Input Container (padding: 0px 20px, gap: 11px)
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      gap: 11,
    },

    // Input Text (Figma: fontSize 22, fontWeight 500, color #181A1A)
    input: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xl, // 20px (Figma는 22px이지만 토큰에 없으므로 가장 가까운 20px 사용)
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(20), // -0.5
      height: theme.dimensions.inputHeight.text, // 22px
      padding: 0, // React Native 기본 padding 제거
    },

    // Divider Container (padding: 10px 20px)
    dividerContainer: {
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
  });

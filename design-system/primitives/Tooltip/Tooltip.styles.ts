/**
 * Tooltip Styles (Figma 기반, 디자인 토큰 사용)
 *
 * Figma node-id: 449-8608 (슬롯이란?팝업)
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createTooltipStyles = (theme: Theme) =>
  StyleSheet.create({
    // Backdrop (어두운 배경)
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(24, 26, 26, 0.4)', // Figma: 배경 어둡게
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Container (흰색 카드)
    container: {
      width: 286, // Figma: 286px
      minHeight: 209, // Figma: 209px (최소 높이, 내용에 따라 늘어날 수 있음)
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderRadius: 4, // Figma: 4px
      padding: theme.spacing.lg, // 24px (계산된 여백: 29px from edge)
      paddingTop: 37, // Figma: 제목 위치에서 계산
      paddingHorizontal: 29, // Figma: 좌우 여백
      // 그림자 효과
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8, // Android 그림자
    },

    // Close Button (X 버튼)
    closeButton: {
      position: 'absolute',
      top: 15, // Figma: y: 15
      right: 17, // Figma: x: 245, container width: 286, button: 24 -> 286 - 245 = 41, center offset: 41 - 24/2 = 29, right: 286 - 245 - 24 = 17
      width: 44, // 터치 타겟 최소 크기
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },

    // Title (제목)
    title: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: 20, // Figma: 20px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(20), // -2.5% of 20px = -0.5
      marginBottom: 25, // Figma: 제목 끝(y: 61) -> 설명 시작(y: 86) = 25px
    },

    // Description (주요 설명)
    description: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm, // 14px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm), // -0.35
      lineHeight: 19, // Figma: 34px height / 2 lines ≈ 17px, rounded to 19
      marginBottom: 13, // Figma: 설명 끝(y: 120) -> 예시 시작(y: 133) = 13px
    },

    // Example (예시 설명)
    example: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: 12, // Figma: 12px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.highEmp, // #A6A6A6 (회색)
      letterSpacing: theme.typography.getLetterSpacing(12), // -2.5% of 12px = -0.3
      lineHeight: 17, // Figma: 42px height / 2 lines = 21px, adjusted to 17 for better fit
    },
  });

/**
 * StatusBadge Styles
 *
 * 디자인 토큰을 최대한 활용한 스타일입니다.
 * 반응형 지원: 패딩 증가 및 텍스트 크기 스케일링 (11px → 11-13px)
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';
import type { StatusBadgeType } from './StatusBadge.types';
import { scaleFontSize } from '../../utils/responsive';

export const createStatusBadgeStyles = (theme: Theme, type: StatusBadgeType) => {
  // 반응형 폰트 크기 (11px → 11-13px)
  const fontSize = scaleFontSize(theme.typography.fixedFontSize.statusBadge); // 11px
  const lineHeight = Math.round(fontSize * 1.193); // Figma 비율 유지
  // 타입별 색상 결정
  const getColors = () => {
    switch (type) {
      case 'deadline':
        return {
          backgroundColor: theme.colors.surface.texticon.onnormal.text.red, // #F7514D
          textColor: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
        };
      case 'recruiting':
        return {
          backgroundColor: theme.colors.surface.normal.containerGreen, // #E6EDE9
          textColor: theme.colors.surface.texticon.onnormal.text.green, // #006242
        };
      case 'remaining':
        return {
          backgroundColor: theme.colors.surface.normal.containerRed, // #FFF4F6
          textColor: theme.colors.surface.texticon.onnormal.text.red, // #F7514D
        };
      case 'closed':
        return {
          backgroundColor: theme.colors.border.highEmp, // #A6A6A6
          textColor: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
        };
    }
  };

  const colors = getColors();

  return StyleSheet.create({
    container: {
      paddingVertical: 4, // 반응형: 2px → 4px (여유 공간 확보)
      paddingHorizontal: 8, // 반응형: 4px → 8px (여유 공간 확보)
      borderRadius: theme.radius.xs, // 4px
      backgroundColor: colors.backgroundColor,
      alignSelf: 'flex-start', // 내용 크기만큼만
    },
    text: {
      fontSize, // 반응형: 11px → 11-13px
      fontWeight: theme.typography.fontWeight.medium, // 500
      lineHeight, // 반응형 계산: 11 * 1.193 ≈ 13
      letterSpacing: theme.typography.getLetterSpacing(fontSize), // -2.5%
      color: colors.textColor,
    },
  });
};

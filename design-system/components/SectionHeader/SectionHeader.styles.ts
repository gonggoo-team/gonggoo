/**
 * SectionHeader Styles
 *
 * 섹션 헤더의 스타일을 정의합니다.
 * 반응형: 텍스트 크기 스케일링 적용
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';
import { scaleFontSize } from '../../utils/responsive';

export const createSectionHeaderStyles = (theme: Theme) => {
  // 반응형 폰트 크기
  const titleSize = scaleFontSize(theme.typography.scalableFontSize.md); // 16px → 16-18px
  const subtitleSize = scaleFontSize(theme.typography.scalableFontSize.xs13); // 13px → 13-15px

  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      gap: 5,
    },
    title: {
      fontSize: titleSize, // 반응형: 16px → 16-18px
      fontWeight: '600',
      lineHeight: titleSize * 1.19, // Figma 비율 유지
      color: theme.colors.surface.texticon.onnormal.text.black,
    },
    subtitle: {
      fontSize: subtitleSize, // 반응형: 13px → 13-15px
      fontWeight: '500',
      lineHeight: subtitleSize * 1.193, // Figma 비율 유지
      color: theme.colors.surface.texticon.onnormal.text.midEmp,
    },
  });
};

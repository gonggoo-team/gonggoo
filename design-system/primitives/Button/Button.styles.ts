/**
 * Button Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * 반응형 지원: minHeight 제거, 텍스트 크기 스케일링 적용
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';
import { scaleFontSize } from '../../utils/responsive';

export const createButtonStyles = (theme: Theme) => {
  // 반응형 폰트 크기 계산
  const fontSize10 = scaleFontSize(10); // Small button
  const fontSize13 = scaleFontSize(theme.typography.scalableFontSize.xs13); // Search button
  const fontSize14 = scaleFontSize(theme.typography.scalableFontSize.sm); // Category, price button
  const fontSize16 = scaleFontSize(theme.typography.scalableFontSize.md); // Square, full button

  return StyleSheet.create({
    // Base styles
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ===== Category Button Variants (라운드 칩) =====

    'category-selected': {
      backgroundColor: theme.colors.surface.brand.primary, // #006242
      borderRadius: theme.radius.xl40, // 40px
      paddingVertical: 8.5, // 반응형: minHeight 제거, padding으로 높이 조정
      paddingHorizontal: theme.spacing.md, // 16px
      // minHeight 제거: 텍스트 크기에 따라 자동 조정
    },

    'category-unselected': {
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderRadius: theme.radius.xl40, // 40px
      borderWidth: theme.dimensions.borderWidth.thin, // 1px
      borderColor: theme.colors.border.midEmp, // #CACACA
      paddingVertical: 8.5, // 반응형: minHeight 제거, padding으로 높이 조정
      paddingHorizontal: theme.spacing.md, // 16px
      gap: 4, // Figma 기준: 텍스트-아이콘 간격 4px
    },

    // ===== Price Button Variants (가격 필터 버튼) =====

    'price-selected': {
      backgroundColor: '#E6EDE9', // Figma 디자인
      borderRadius: theme.radius.xl40, // 40px
      borderWidth: theme.dimensions.borderWidth.thin, // 1px
      borderColor: theme.colors.surface.brand.primary, // #006242
      paddingVertical: 8.5, // 반응형: minHeight 제거
      paddingHorizontal: theme.spacing.md, // 16px
    },

    'price-unselected': {
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderRadius: theme.radius.xl40, // 40px
      borderWidth: theme.dimensions.borderWidth.thin, // 1px
      borderColor: theme.colors.border.midEmp, // #CACACA
      paddingVertical: 8.5, // 반응형: minHeight 제거
      paddingHorizontal: theme.spacing.md, // 16px
    },

    // ===== Square Button Variants (사각형) =====

    'square-selected': {
      backgroundColor: theme.colors.surface.brand.primary, // #006242
      borderRadius: theme.radius.md, // 12px
      paddingVertical: theme.spacing.md, // 16px (반응형: minHeight 제거)
    },

    'square-unselected': {
      backgroundColor: theme.colors.surface.env.disabled, // #E1E1E1
      borderRadius: theme.radius.md, // 12px
      paddingVertical: theme.spacing.md, // 16px (반응형: minHeight 제거)
    },

    // ===== Full Width Button Variants (전체 너비) =====

    'full-primary': {
      backgroundColor: theme.colors.surface.brand.primary, // #006242
      borderRadius: theme.radius.none, // 0px
      paddingVertical: theme.spacing.md, // 16px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.lg, // 20px
      width: '100%', // 반응형 대응
    },

    'full-secondary': {
      backgroundColor: theme.colors.surface.env.disabled, // #E1E1E1
      borderRadius: theme.radius.none, // 0px
      paddingVertical: theme.spacing.md, // 16px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.lg, // 20px
      width: '100%', // 반응형 대응
    },

    'full-secondary-rounded': {
      backgroundColor: theme.colors.surface.env.disabled, // #E1E1E1
      borderRadius: theme.radius.md, // 12px
      borderWidth: theme.dimensions.borderWidth.thin, // 1px
      borderColor: theme.colors.border.midEmp, // #CACACA
      paddingVertical: theme.spacing.md, // 16px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.lg, // 20px
      width: '100%', // 반응형 대응
    },

    'full-disabled': {
      backgroundColor: theme.colors.surface.env.disabled, // #E1E1E1
      borderRadius: theme.radius.none, // 0px
      paddingVertical: theme.spacing.md, // 16px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.lg, // 20px
      width: '100%', // 반응형 대응
    },

    // ===== Small Button (작은 버튼) =====

    small: {
      backgroundColor: theme.colors.surface.env.disabled, // #E1E1E1
      borderRadius: theme.radius.xs, // 4px
      paddingVertical: theme.spacing.sm, // 12px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.md, // 16px
    },

    // ===== Search Button Variants (검색) =====

    'search-active': {
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderRadius: theme.radius.xl40, // 40px
      borderWidth: theme.dimensions.borderWidth.thin, // 1px
      borderColor: theme.colors.surface.env.disabled, // #E1E1E1
      paddingVertical: theme.spacing.sm, // 12px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.md, // 16px
      gap: theme.spacing.xs, // 8px
    },

    'search-inactive': {
      backgroundColor: theme.colors.surface.normal.bg2, // #F5F5F5
      borderRadius: theme.radius.xl40, // 40px
      paddingVertical: theme.spacing.sm, // 12px (반응형: minHeight 제거)
      paddingHorizontal: theme.spacing.md, // 16px
      gap: theme.spacing.xs, // 8px
    },

    // ===== Size Variants (square variant 전용) =====

    long: {
      width: '92%', // 345/375 ≈ 92% (반응형 대응)
      maxWidth: theme.dimensions.buttonWidth.long, // 345px
      alignSelf: 'center', // 중앙 정렬
    },

    short: {
      width: '45.9%', // 172/375 ≈ 45.9% (반응형 대응)
      maxWidth: theme.dimensions.buttonWidth.short, // 172px
    },

    // ===== Text Styles =====

    text: {
      fontFamily: theme.typography.fontFamily.primary, // Pretendard
      textAlign: 'center',      
    },

    // Category Button Text (반응형: 14px → 14-16px)
    'category-selected-text': {
      color: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
      fontSize: fontSize14, // 반응형: 14px → 14-16px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize14),
    },

    'category-unselected-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize14, // 반응형: 14px → 14-16px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize14),
    },

    // Price Button Text (반응형: 14px → 14-16px)
    'price-selected-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize14, // 반응형: 14px → 14-16px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize14),
    },

    'price-unselected-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize14, // 반응형: 14px → 14-16px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize14),
    },

    // Square Button Text (반응형: 16px → 16-18px)
    'square-selected-text': {
      color: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
    },

    'square-unselected-text': {
      color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
    },

    // Full Width Button Text (반응형: 16px → 16-18px)
    'full-primary-text': {
      color: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
    },

    'full-secondary-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
    },

    'full-secondary-rounded-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
    },

    'full-disabled-text': {
      color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
      fontSize: fontSize16, // 반응형: 16px → 16-18px
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      letterSpacing: theme.typography.getLetterSpacing(fontSize16),
    },

    // Small Button Text (반응형: 10px → 10-12px)
    'small-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize10, // 반응형: 10px → 10-12px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize10),
    },

    // Search Button Text (반응형: 13px → 13-15px)
    'search-active-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      fontSize: fontSize13, // 반응형: 13px → 13-15px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize13),
    },

    'search-inactive-text': {
      color: theme.colors.surface.texticon.onnormal.text.black, // #000000
      fontSize: fontSize13, // 반응형: 13px → 13-15px
      fontWeight: theme.typography.fontWeight.medium, // 500
      letterSpacing: theme.typography.getLetterSpacing(fontSize13),
    },

    // Disabled State (override)
    disabled: {
      opacity: theme.dimensions.opacity.disabled, // 0.6
    },
  });
};

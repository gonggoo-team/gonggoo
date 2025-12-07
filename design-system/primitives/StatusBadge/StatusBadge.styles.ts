/**
 * StatusBadge Styles
 *
 * Variant 기반 스타일 시스템으로 재작성되었습니다.
 * - Card variant: ProductCard용 (11px, 2px 4px, 반응형)
 * - Detail variant: 상품 상세 페이지용 (14px, 5px 10px, 고정 크기)
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-12-07
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';
import type { StatusBadgeType, StatusBadgeVariant } from './StatusBadge.types';
import { scaleFontSize } from '../../utils/responsive';

/**
 * 배지 구성 설정
 */
interface BadgeConfig {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontWeight: '500' | '600';
}

/**
 * Variant 및 Type에 따른 배지 구성 반환
 *
 * @param theme - 테마 객체
 * @param variant - 배지 variant ('card' | 'detail')
 * @param type - 배지 타입
 * @returns 배지 스타일 구성
 */
const getBadgeConfig = (
  theme: Theme,
  variant: StatusBadgeVariant,
  type: StatusBadgeType
): BadgeConfig => {
  // ===== Card Variant (ProductCards) =====
  // 11px 폰트, 2px 4px 패딩, 반응형 스케일링
  if (variant === 'card') {
    // 반응형 폰트 크기 (11px → 11-13px)
    const fontSize = scaleFontSize(theme.typography.fixedFontSize.statusBadge); // 11px

    switch (type) {
      case 'deadline':
        // "오늘 마감" - 빨간 배경, 흰색 텍스트
        // Figma Node: 268-922
        return {
          backgroundColor: theme.colors.surface.texticon.onnormal.text.red, // #F7514D
          textColor: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
          fontSize,
          paddingVertical: 2,
          paddingHorizontal: 4,
          fontWeight: '500',
        };

      case 'recruiting':
        // "3명 모집" - 연한 초록 배경, 진한 초록 텍스트
        // Figma Node: 268-921
        return {
          backgroundColor: theme.colors.surface.normal.containerGreen, // #E6EDE9
          textColor: theme.colors.surface.texticon.onnormal.text.green, // #006242
          fontSize,
          paddingVertical: 2,
          paddingHorizontal: 4,
          fontWeight: '500',
        };

      case 'remaining':
        // "14일 남음" - 연한 핑크 배경, 빨간 텍스트
        // Figma Node: 268-920
        return {
          backgroundColor: theme.colors.surface.normal.containerRed, // #FFF4F6
          textColor: theme.colors.surface.texticon.onnormal.text.red, // #F7514D
          fontSize,
          paddingVertical: 2,
          paddingHorizontal: 4,
          fontWeight: '500',
        };

      case 'closed':
        // "모집 마감" - 회색 배경, 흰색 텍스트
        // Figma Node: 667-11266
        return {
          backgroundColor: theme.colors.border.highEmp, // #A6A6A6
          textColor: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
          fontSize,
          paddingVertical: 2,
          paddingHorizontal: 4,
          fontWeight: '500',
        };

      case 'recruitment-complete':
      case 'transaction-complete':
        // Card variant에서는 일반적으로 사용되지 않지만 fallback 제공
        return {
          backgroundColor: theme.colors.surface.env.disabled, // #E1E1E1
          textColor: theme.colors.surface.texticon.onnormal.text.highEmp, // #181A1A
          fontSize,
          paddingVertical: 2,
          paddingHorizontal: 4,
          fontWeight: '500',
        };
    }
  }

  // ===== Detail Variant (Product Detail Page) =====
  // 14px 폰트, 5px 10px 패딩, 고정 크기 (반응형 비활성화)
  else {
    const fontSize = 14; // 고정 14px, 반응형 스케일링 없음

    switch (type) {
      case 'recruiting':
        // "모집 중" - 진한 초록 배경, 흰색 텍스트, font weight 600
        // Figma Node: 374-3955
        // NOTE: Card variant의 recruiting과 색상 반전됨 (의도적)
        return {
          backgroundColor: theme.colors.surface.brand.primary, // #006242
          textColor: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
          fontSize,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontWeight: '600', // Detail variant recruiting만 semiBold
        };

      case 'recruitment-complete':
        // "모집 완료" - 연한 회색 배경, 검은색 텍스트
        // Figma Node: 374-3957
        // NOTE: Figma는 #D9D9D9를 사용하지만 theme에는 #E1E1E1만 존재
        // Figma 정확도 우선으로 하드코딩
        return {
          backgroundColor: '#D9D9D9', // Figma exact color (theme에 없음)
          textColor: theme.colors.surface.texticon.onnormal.text.black, // #181A1A (Figma #000000와 거의 동일)
          fontSize,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontWeight: '500',
        };

      case 'transaction-complete':
        // "거래 완료" - 연한 회색 배경, 검은색 텍스트
        // Figma Node: 374-3959
        // recruitment-complete와 동일한 스타일
        return {
          backgroundColor: '#D9D9D9', // Figma exact color
          textColor: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
          fontSize,
          paddingVertical: 5,
          paddingHorizontal: 10,
          fontWeight: '500',
        };

      case 'deadline':
      case 'remaining':
      case 'closed':
        // Detail variant에서는 일반적으로 사용되지 않지만 fallback 제공
        // Card variant 색상 사용하되 크기는 detail variant 적용
        const cardConfig = getBadgeConfig(theme, 'card', type);
        return {
          ...cardConfig,
          fontSize: 14,
          paddingVertical: 5,
          paddingHorizontal: 10,
        };
    }
  }
};

/**
 * StatusBadge 스타일 생성
 *
 * @param theme - 테마 객체
 * @param variant - 배지 variant
 * @param type - 배지 타입
 * @returns StyleSheet 객체
 */
export const createStatusBadgeStyles = (
  theme: Theme,
  variant: StatusBadgeVariant,
  type: StatusBadgeType
) => {
  const config = getBadgeConfig(theme, variant, type);

  // Figma 비율: 1.193359375 (line-height / font-size)
  const lineHeight = Math.round(config.fontSize * 1.193);

  return StyleSheet.create({
    container: {
      paddingVertical: config.paddingVertical,
      paddingHorizontal: config.paddingHorizontal,
      borderRadius: variant == 'card' ? theme.radius.xs : 0,
      backgroundColor: config.backgroundColor,
      alignSelf: 'flex-start', // 내용 크기만큼만 차지
    },
    text: {
      fontSize: config.fontSize,
      fontWeight:
        config.fontWeight === '600'
          ? theme.typography.fontWeight.semiBold // 600
          : theme.typography.fontWeight.medium, // 500
      lineHeight,
      letterSpacing: theme.typography.getLetterSpacing(config.fontSize), // -2.5%
      color: config.textColor,
    },
  });
};

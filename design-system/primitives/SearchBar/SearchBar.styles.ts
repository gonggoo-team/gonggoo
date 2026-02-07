/**
 * SearchBar Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 검색바 컴포넌트 기준 (width: 298px, height: 35px, radius: 40px, padding: 5px 16px)
 * 반응형: height 제거, 텍스트 크기 스케일링 (13px → 13-15px)
 *
 * Variants:
 * - default: 기본 스타일 (회색 배경, 그림자 없음)
 * - map: 지도 검색창 스타일 (흰색 배경, 그림자 있음, 고정 높이)
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';
import { scaleFontSize } from '../../utils/responsive';

export type SearchBarVariant = 'default' | 'map';

export const createSearchBarStyles = (theme: Theme, variant: SearchBarVariant = 'default') => {
  // 반응형 폰트 크기 (13px → 13-15px)
  const fontSize = scaleFontSize(theme.typography.scalableFontSize.xs13);

  // variant에 따른 스타일
  const isMapVariant = variant === 'map';

  return StyleSheet.create({
    // Container (Figma: width 298px → 반응형으로 조정)
    container: {
      width: '100%',
      // maxWidth: theme.dimensions.componentWidth.searchBar, // 298px
      alignSelf: 'stretch',
    },

    // Content Container (Figma: bg #F5F5F5, radius 40px, padding 5px 16px)
    // 반응형: height 제거, paddingVertical로 높이 조정
    // map variant: 흰색 배경 + 그림자 + 고정 높이 46px
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isMapVariant
        ? theme.colors.surface.normal.bg1 // map: 흰색 배경
        : theme.colors.surface.normal.bg2, // default: 회색 배경 #F5F5F5
      borderRadius: theme.radius.xl40, // 40px
      ...(isMapVariant
        ? {
            // map variant: 고정 높이 46px
            height: 46,
            paddingHorizontal: 16,
            // 그림자 효과
            shadowColor: theme.colors.surface.texticon.onnormal.text.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 3,
          }
        : {
            // default variant: paddingVertical로 높이 조정
            paddingVertical: 5,
            paddingHorizontal: 16,
            gap: 10,
          }),
    },

    // Input Wrapper (커서 라인을 위한 컨테이너)
    inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1, // 커서와 텍스트 사이 간격
    },

    // Input Text (Figma: fontSize 13, fontWeight 500)
    // 반응형: fontSize 13px → 13-15px
    input: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.primary,
      fontSize, // 반응형: 13px → 13-15px
      fontWeight: isMapVariant
        ? theme.typography.fontWeight.semiBold // map: 600
        : theme.typography.fontWeight.medium, // default: 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(fontSize),
      padding: 0, // React Native 기본 padding 제거
      height: '100%',
    },

    // Cursor Line (Figma: stroke #006242, strokeWeight 1px, height 14px)
    cursor: {
      width: 1,
      height: 14,
      backgroundColor: theme.colors.surface.brand.primary, // #006242
    },

    // Icon Container (gap: 8px)
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
};

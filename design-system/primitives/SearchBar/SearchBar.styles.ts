/**
 * SearchBar Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 검색바 컴포넌트 기준 (width: 298px, height: 35px, radius: 40px, padding: 5px 16px)
 * 반응형: height 제거, 텍스트 크기 스케일링 (13px → 13-15px)
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';
import { scaleFontSize } from '../../utils/responsive';

export const createSearchBarStyles = (theme: Theme) => {
  // 반응형 폰트 크기 (13px → 13-15px)
  const fontSize = scaleFontSize(theme.typography.scalableFontSize.xs13);

  return StyleSheet.create({
    // Container (Figma: width 298px → 반응형으로 조정)
    container: {
      width: '100%',
      // maxWidth: theme.dimensions.componentWidth.searchBar, // 298px
      alignSelf: 'stretch',
    },

    // Content Container (Figma: bg #F5F5F5, radius 40px, padding 5px 16px)
    // 반응형: height 제거, paddingVertical로 높이 조정
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.normal.bg2, // #F5F5F5
      borderRadius: theme.radius.xl40, // 40px
      paddingVertical: 5, // 반응형: height 제거, padding으로 높이 조정
      paddingHorizontal: 16,
      gap: 10,
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
      fontWeight: theme.typography.fontWeight.medium, // 500
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

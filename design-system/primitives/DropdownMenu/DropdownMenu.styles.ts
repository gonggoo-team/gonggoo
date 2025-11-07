/**
 * DropdownMenu Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 드롭다운 박스 컴포넌트 기준 (width: 102px, shadow: 0px 7px 29px rgba(100, 100, 111, 0.2))
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createDropdownMenuStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container (Figma: width 102px, dropdown shadow)
    container: {
      minWidth: theme.dimensions.componentWidth.dropdown, // 최소 102px                  
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF            
      ...theme.shadows.dropdown, // 커스텀 드롭다운 그림자
      borderTopLeftRadius: theme.radius.xs, // 4px
      borderTopRightRadius: theme.radius.xs, // 4px
      borderBottomLeftRadius: theme.radius.xs, // 4px
      borderBottomRightRadius: theme.radius.xs, // 4px            
    },

    listContainer: {
      flexGrow: 0, // 리스트가 불필요하게 늘어나는 것을 방지
    },

    // Item (Figma: padding 16px, gap 10px)
    item: {
      paddingVertical: 16,
      paddingHorizontal: 16,      
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderRadius: 0, // 중간 아이템은 둥글지 않음                     
    },

    // First Item (Figma: borderRadius 4px 4px 0px 0px)
    firstItem: {
      borderTopLeftRadius: theme.radius.xs, // 4px
      borderTopRightRadius: theme.radius.xs, // 4px
    },

    // Last Item (Figma: borderRadius 0px 0px 4px 4px)
    lastItem: {
      borderBottomLeftRadius: theme.radius.xs, // 4px
      borderBottomRightRadius: theme.radius.xs, // 4px      
    },

    // Item Text (Figma: fontSize 13, fontWeight 500, color #000)
    itemText: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #000000
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs13), // -0.325
    },
  });

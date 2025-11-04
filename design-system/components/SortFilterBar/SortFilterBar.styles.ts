/**
 * SortFilterBar Styles
 *
 * 정렬/필터 버튼 바의 스타일을 정의합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createSortFilterBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 8,
      position: 'relative',
    },
    resultsCountText: {
      position: 'absolute',
      left: 20,
      top: '50%',
      transform: [{ translateY: -8 }], // 수직 중앙 정렬 (텍스트 높이의 절반)
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px (Figma 기준)
      fontWeight: theme.typography.fontWeight.medium, // 500
      lineHeight: theme.typography.fontSize.xs13 * 1.193, // Figma 기준
      letterSpacing: theme.typography.getLetterSpacing(13),
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      marginLeft: 'auto', // 우측으로 정렬
    },
    sortButtonWrapper: {
      position: 'relative',
    },
    dropdownContainer: {
      position: 'absolute',
      top: 100, // 카테고리(14+14) + 정렬/필터(32+8) + 제목(16+8+실제높이) 고려
      right: 60,
      zIndex: 1001,
      minWidth: 150,
    },
  });

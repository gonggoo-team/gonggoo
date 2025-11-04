/**
 * PopularFilterBar Styles
 *
 * 인기 탭 필터 바의 스타일을 정의합니다.
 * 버튼 스타일은 SortButton 컴포넌트에서 처리됩니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createPopularFilterBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end', // Figma: row, flex-end
      paddingHorizontal: 20,
      paddingBottom: 8,
      gap: 13, // Figma 기준: 13px (SortFilterBar와 동일)
    },
  });

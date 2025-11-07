/**
 * AgeFilterBar Styles
 *
 * 연령대 필터 바의 스타일을 정의합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createAgeFilterBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 15,
      paddingBottom: 15,
      backgroundColor: theme.colors.surface.normal.bg1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      gap: 7,
    },
  });

/**
 * CategoryGrid Component Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createCategoryGridStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    columnWrapper: {
      paddingHorizontal: theme.spacing.lg, // 20px (Figma 기준)
      gap: theme.spacing.xs9, // 9px (Figma 기준)
    },
  });
};

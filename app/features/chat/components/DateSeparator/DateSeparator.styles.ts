/**
 * DateSeparator Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '@/design-system';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.lowEmp,
    },
    text: {
      fontSize: 10,
      fontWeight: '500',
      color: theme.colors.surface.texticon.onnormal.text.midEmp,
      marginHorizontal: theme.spacing.sm,
    },
  });

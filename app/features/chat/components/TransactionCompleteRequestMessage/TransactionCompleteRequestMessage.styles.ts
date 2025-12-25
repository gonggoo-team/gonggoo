/**
 * TransactionCompleteRequestMessage Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '@/design-system';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      maxWidth: 327,
      width: '100%',
      backgroundColor: theme.colors.surface.normal.bg2, // #F5F5F5
      borderRadius: 20,
      padding: 16,
      gap: 16,
      marginVertical: 8,
    },
    textContainer: {
      gap: 7,
    },
    title: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.md, // 16px
      fontWeight: theme.typography.fontWeight.semiBold,
      letterSpacing: theme.typography.getLetterSpacing(16),
      color: theme.colors.surface.texticon.onnormal.text.black,
      textAlign: 'center',
    },
    description: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm, // 14px
      fontWeight: theme.typography.fontWeight.medium,
      letterSpacing: theme.typography.getLetterSpacing(14),
      color: theme.colors.surface.texticon.onnormal.text.black,
      textAlign: 'center',
      lineHeight: 16.8, // 1.2em
    },
    notice: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm, // 14px
      fontWeight: theme.typography.fontWeight.medium,
      letterSpacing: theme.typography.getLetterSpacing(14),
      color: theme.colors.surface.brand.primary, // #006242
      textAlign: 'center',
      lineHeight: 16.8,
    },
    button: {
      backgroundColor: theme.colors.surface.brand.primary, // #006242
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
    },
    buttonText: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm, // 14px
      fontWeight: theme.typography.fontWeight.semiBold,
      letterSpacing: theme.typography.getLetterSpacing(14),
      color: theme.colors.surface.normal.white,
    },
  });

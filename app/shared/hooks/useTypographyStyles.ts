/**
 * useTypographyStyles Hook
 *
 * 타이포그래피 스타일을 재사용 가능한 hook으로 제공합니다.
 * 반복되는 typography 스타일 코드를 제거하고 일관성을 유지합니다.
 */

import { useTheme } from '@/design-system';

export function useTypographyStyles() {
  const { theme } = useTheme();

  return {
    xxs: {
      fontSize: theme.typography.fontSize.xxs,
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: theme.typography.fontSize.xxs * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(10),
    },
    xs: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: theme.typography.fontSize.xs * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(13),
    },
    sm: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      lineHeight: theme.typography.fontSize.sm * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(14),
    },
    md: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semiBold,
      lineHeight: theme.typography.fontSize.md * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(16),
    },
    xxl25: {
      fontSize: theme.typography.fontSize.xxl25,
      fontWeight: theme.typography.fontWeight.semiBold,
      lineHeight: theme.typography.fontSize.xxl25 * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xxl25),
    },
    // sm with height 17 (특수 케이스)
    smHeight17: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semiBold,
      height: 17,
      lineHeight: theme.typography.fontSize.sm * 1.2,
      letterSpacing: theme.typography.getLetterSpacing(14),
    },
  };
}

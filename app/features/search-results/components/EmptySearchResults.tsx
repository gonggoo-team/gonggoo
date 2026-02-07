/**
 * EmptySearchResults Component
 *
 * 검색 결과가 없을 때 표시하는 컴포넌트입니다.
 * 기존 EmptyRecentSearches 스타일과 일관성 유지
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design-system';

interface EmptySearchResultsProps {
  /** 검색어 */
  query: string;
}

/**
 * EmptySearchResults Component
 */
export const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({
  query,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.xxl,
        },
      ]}
    >
      <Text
        style={[
          styles.message,
          {
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
            letterSpacing: theme.typography.getLetterSpacing(
              theme.typography.fontSize.md
            ),
            lineHeight:
              theme.typography.fontSize.md * theme.typography.lineHeight.relaxed,
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
          },
        ]}
      >
        "{query}" 검색 결과가 없습니다.
      </Text>
      <Text
        style={[
          styles.hint,
          {
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.regular,
            letterSpacing: theme.typography.getLetterSpacing(
              theme.typography.fontSize.sm
            ),
            lineHeight:
              theme.typography.fontSize.sm * theme.typography.lineHeight.relaxed,
            color: theme.colors.surface.texticon.onnormal.text.lowEmp,
            marginTop: theme.spacing.xs,
          },
        ]}
      >
        다른 검색어를 입력해보세요.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
  },
});

/**
 * EmptyRecentSearches Component
 *
 * 최근 검색어가 없을 때 표시되는 빈 상태 컴포넌트입니다.
 *
 * 특징:
 * - 전체 삭제 시 섹션은 유지하고 메시지만 표시
 * - 심플한 디자인 (텍스트만)
 * - 접근성 라벨 포함
 */

import { useTheme } from '@/design-system';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * EmptyRecentSearches Props
 */
export interface EmptyRecentSearchesProps {
  /** 메시지 텍스트 (기본: "최근 검색한 내역이 없습니다.") */
  message?: string;
}

/**
 * EmptyRecentSearches Component
 */
export const EmptyRecentSearches: React.FC<EmptyRecentSearchesProps> = ({
  message = '최근 검색한 내역이 없습니다.',
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: 68, // 레이아웃 점프 방지 (RecentSearchList와 동일 높이)
          paddingVertical: theme.spacing.md, // 16px (줄임)
          paddingHorizontal: theme.spacing.lg, // 20px
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      <Text
        style={[
          styles.message,
          {
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.sm, // 14px
            fontWeight: theme.typography.fontWeight.regular, // 400
            letterSpacing: theme.typography.getLetterSpacing(
              theme.typography.fontSize.sm
            ),
            lineHeight:
              theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // padding은 동적 설정
  },
  message: {
    textAlign: 'center',
    // 모든 텍스트 스타일은 동적으로 설정
  },
});

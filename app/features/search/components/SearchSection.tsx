/**
 * SearchSection Component
 *
 * 검색 화면의 섹션 공통 컴포넌트입니다.
 * 최근 검색어, 추천 검색어, 인기 검색어 섹션에서 재사용됩니다.
 *
 * 주요 기능:
 * - 섹션 제목
 * - 오른쪽 액션 버튼 (전체 삭제, 기준 시간 등)
 * - 자식 콘텐츠 영역
 * - 일관된 간격 및 패딩
 */

import { useTheme } from '@/design-system';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';

/**
 * SearchSection Props
 */
export interface SearchSectionProps {
  /** 섹션 제목 */
  title: string;

  /** 오른쪽 액션 요소 (전체 삭제 버튼, 시간 등) */
  rightAction?: ReactNode;

  /** 자식 콘텐츠 */
  children: ReactNode;

  /** 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 헤더 없이 콘텐츠만 표시 */
  hideHeader?: boolean;

  /** 접근성 라벨 */
  accessibilityLabel?: string;

  /** 테스트 ID */
  testID?: string;
}

/**
 * SearchSection Component
 */
export const SearchSection: React.FC<SearchSectionProps> = ({
  title,
  rightAction,
  children,
  style,
  hideHeader = false,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          gap: theme.spacing.lg - 2, // 18px (Figma 기준)
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {/* 섹션 헤더 */}
      {!hideHeader && (
        <View
          style={[
            styles.header,
            {
              paddingHorizontal: theme.spacing.lg, // 20px
              gap: 8, // 제목과 액션 간격 줄임 (Figma 기준)
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semiBold,
                letterSpacing: theme.typography.getLetterSpacing(
                  theme.typography.fontSize.md
                ),
                lineHeight:
                  theme.typography.fontSize.md *
                  theme.typography.lineHeight.tight,
                color: theme.colors.surface.texticon.onnormal.text.black,
              },
            ]}
          >
            {title}
          </Text>

          {/* 오른쪽 액션 */}
          {rightAction}
        </View>
      )}

      {/* 자식 콘텐츠 */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // gap은 동적으로 설정
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal은 동적으로 설정
  },
  title: {
    // 모든 텍스트 스타일은 동적으로 설정
  },
});

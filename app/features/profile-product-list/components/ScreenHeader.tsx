/**
 * ScreenHeader Component
 *
 * 프로필 화면 상단 헤더 (타이틀 + 부제목)
 * Figma 사양: 좌우 20px 패딩, 상단 13px, 하단 16px
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';

export interface ScreenHeaderProps {
  /** 헤더 타이틀 */
  title?: string;
  /** 헤더 부제목 (선택적) */
  subtitle?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle }) => {
  const { theme } = useTheme();

  // 타이틀과 부제목이 모두 없으면 렌더링하지 않음
  if (!title && !subtitle) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.semiBold,
              letterSpacing: theme.typography.getLetterSpacing(16),
              color: theme.colors.surface.texticon.onnormal.text.black,
            },
          ]}
        >
          {title}
        </Text>
      )}

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.xs13,
              fontWeight: theme.typography.fontWeight.medium,
              letterSpacing: theme.typography.getLetterSpacing(14),
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
            },
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // Figma 사양
    paddingTop: 13,        // Figma 사양
    paddingBottom: 16,     // Figma 사양 (리스트와의 간격)
    gap: 8,
  },
  title: {
    lineHeight: 19, // 16px × 1.193359375
  },
  subtitle: {
    lineHeight: 17, // 14px × 1.193359375
  },
});

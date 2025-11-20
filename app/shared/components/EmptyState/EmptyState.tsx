/**
 * EmptyState Component
 *
 * 리스트나 화면이 비어있을 때 표시하는 공통 컴포넌트입니다.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/design-system';
import type { EmptyStateProps } from './EmptyState.types';

/**
 * EmptyState Component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  iconName,
  iconSize = 48,
  description,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {iconName && (
        <View
          style={[
            styles.iconContainer,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
              backgroundColor: theme.colors.surface.normal.container10,
            },
          ]}
        >
          {/* TODO: Icon 컴포넌트 추가 시 주석 해제 */}
          {/* <Icon name={iconName} size={iconSize * 0.6} color={theme.colors.surface.texticon.onnormal.text.midEmp} /> */}
        </View>
      )}

      <Text
        style={[
          styles.message,
          {
            fontSize: theme.typography.fontSize.lg, // 16px
            fontWeight: theme.typography.fontWeight.medium, // 500
            lineHeight: theme.typography.fontSize.lg * 1.5,
            letterSpacing: theme.typography.getLetterSpacing(16),
            color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
          },
        ]}
      >
        {message}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              fontSize: theme.typography.fontSize.sm, // 14px
              fontWeight: theme.typography.fontWeight.regular, // 400
              lineHeight: theme.typography.fontSize.sm * 1.5,
              letterSpacing: theme.typography.getLetterSpacing(14),
              color: theme.colors.surface.texticon.onnormal.text.lowEmp, // 더 연한 회색
            },
          ]}
        >
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
  },
});

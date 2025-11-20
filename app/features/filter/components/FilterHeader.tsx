/**
 * FilterHeader Component
 *
 * 필터 화면의 커스텀 헤더입니다.
 * - 좌측: X 아이콘 (닫기)
 * - 중앙: "필터" 텍스트
 * - 스크롤 가능하도록 별도 컴포넌트로 분리
 */

import { Icon, useTheme } from '@/design-system';
import { useRouter } from 'expo-router';
import { useThrottledNavigation } from '@/app/shared/hooks';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const FilterHeader: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { back } = useThrottledNavigation();

  const handleClose = () => {
    back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <TouchableOpacity
        onPress={handleClose}
        activeOpacity={0.7}
        style={styles.closeButton}
        accessibilityRole="button"
        accessibilityLabel="필터 닫기"
      >
        <Icon
          name="x"
          size={24}
          color={theme.colors.surface.texticon.onnormal.icon.black}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semiBold,
            letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.lg),
          },
        ]}
      >
        필터
      </Text>

      {/* 빈 공간 (중앙 정렬을 위한 균형 유지) */}
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    lineHeight: 19.04, // Figma 기준
  },
  placeholder: {
    width: 24,
    height: 24,
  },
});

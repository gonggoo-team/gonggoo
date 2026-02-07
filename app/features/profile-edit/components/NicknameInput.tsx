/**
 * Nickname Input Component
 *
 * 닉네임 입력 필드 + text-delete 아이콘 + 에러 메시지
 * Figma: 중앙 정렬, 밑줄, 에러 시 빨간색 메시지
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme, Icon } from '@/design-system';

export interface NicknameInputProps {
  /** 닉네임 값 */
  value: string;

  /** 닉네임 변경 핸들러 */
  onChangeText: (text: string) => void;

  /** 닉네임 초기화 핸들러 */
  onClear: () => void;

  /** 에러 상태 */
  hasError?: boolean;

  /** 에러 메시지 */
  errorMessage?: string;

  /** Placeholder */
  placeholder?: string;

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

export function NicknameInput({
  value,
  onChangeText,
  onClear,
  hasError = false,
  errorMessage = '닉네임을 입력해주세요!',
  placeholder = '닉네임',
  accessibilityLabel = '닉네임 입력',
}: NicknameInputProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* 입력 필드 + 삭제 아이콘 */}
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
          style={[
            styles.input,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.md, // 15px
              fontWeight: theme.typography.fontWeight.medium, // 500
              letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.md),
            },
          ]}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint="닉네임을 입력하세요"
          maxLength={20} // 최대 20자
        />

        {/* 삭제 아이콘 (값이 있을 때만 표시) */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="닉네임 지우기"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name="text-delete"
              size={24}
              color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 밑줄 */}
      <View
        style={[
          styles.underline,
          {
            backgroundColor: hasError
              ? theme.colors.surface.env.accent // 에러 시 빨간색
              : theme.colors.border.brand.primary, // 기본 브랜드 컬러
          },
        ]}
      />

      {/* 에러 메시지 */}
      {hasError && errorMessage && (
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.surface.texticon.onnormal.text.red,
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.sm, // 13px (Figma 사양)
                fontWeight: theme.typography.fontWeight.medium, // 500
                letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
              },
            ]}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // Figma: 좌우 패딩
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40, // 삭제 아이콘 영역 확보
    minWidth: 100,
    lineHeight: 18,
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    padding: 4,
  },
  underline: {
    height: 1,
    marginTop: 4,
  },
  errorContainer: {
    marginTop: 10,
    paddingHorizontal: 3, // Figma: padding: 10px 20px 10px 23px
  },
  errorText: {
    lineHeight: 15.5, // Figma line-height
  },
});

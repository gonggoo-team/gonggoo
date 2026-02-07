/**
 * FeedbackInput Component
 *
 * 탈퇴 사유를 입력받는 텍스트 입력 컴포넌트
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { ACCOUNT_DELETION_TEXT, getAccountDeletionColors } from '../constants/accountDeletion.constants';

interface FeedbackInputProps {
  /** 입력된 텍스트 */
  value: string;
  /** 텍스트 변경 핸들러 */
  onChangeText: (text: string) => void;
}

export function FeedbackInput({ value, onChangeText }: FeedbackInputProps) {
  const { theme } = useTheme();
  const colors = getAccountDeletionColors();

  const getLetterSpacing = (fontSize: number, percentage: number) => {
    return (fontSize * percentage) / 100;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            lineHeight: theme.typography.fontSize.sm * 1.8,
            letterSpacing: getLetterSpacing(theme.typography.fontSize.sm, -2.5),
            backgroundColor: colors.feedbackInput.backgroundColor,
            borderRadius: colors.feedbackInput.borderRadius,
            padding: colors.feedbackInput.padding,
            minHeight: colors.feedbackInput.minHeight,
            color: colors.feedbackInput.textColor,
          },
        ]}
        placeholder={ACCOUNT_DELETION_TEXT.feedbackInput.placeholder}
        placeholderTextColor={colors.feedbackInput.placeholderColor}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
        maxLength={ACCOUNT_DELETION_TEXT.feedbackInput.maxLength}
        returnKeyType="default"
        blurOnSubmit={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    // Dynamic styles applied inline
  },
});

/**
 * AgreementCheckbox Component
 *
 * 회원 탈퇴 동의 체크박스 컴포넌트
 * 사용자의 동의를 받기 위한 체크박스와 텍스트를 표시합니다.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, useTheme } from '@/design-system';
import { ACCOUNT_DELETION_STYLES } from '../constants/accountDeletion.constants';

interface AgreementCheckboxProps {
  /** 체크박스 선택 상태 */
  checked: boolean;
  /** 체크박스 선택 상태 변경 핸들러 */
  onToggle: () => void;
  /** 동의 문구 텍스트 */
  text: string;
}

export function AgreementCheckbox({ checked, onToggle, text }: AgreementCheckboxProps) {
  const { theme } = useTheme();

  const getLetterSpacing = (fontSize: number, percentage: number) => {
    return (fontSize * percentage) / 100;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={text}
    >
      <Icon name={checked ? 'check-box-fill' : 'check-box-empty'} size={24} />
      <Text
        style={[
          styles.text,
          {
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            lineHeight: theme.typography.fontSize.sm * 1.2,
            letterSpacing: getLetterSpacing(theme.typography.fontSize.sm, -2.5),
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ACCOUNT_DELETION_STYLES.checkboxGap,
    paddingHorizontal: 20,
  },
  text: {
    flex: 1,
  },
});

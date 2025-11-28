/**
 * Phone Input Component
 *
 * 전화번호 입력 컴포넌트
 * - 한국 전화번호 형식 (010-XXXX-XXXX)
 * - 자동 포맷팅
 * - 유효성 검사
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  editable?: boolean;
}

/**
 * 전화번호 포맷팅 (010-XXXX-XXXX)
 */
function formatPhoneNumber(text: string): string {
  // 숫자만 추출
  const numbers = text.replace(/[^0-9]/g, '');

  // 최대 11자리
  const trimmed = numbers.slice(0, 11);

  // 포맷팅
  if (trimmed.length <= 3) {
    return trimmed;
  } else if (trimmed.length <= 7) {
    return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
  } else {
    return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
  }
}

/**
 * 전화번호 유효성 검사
 */
export function isValidPhoneNumber(phone: string): boolean {
  const numbers = phone.replace(/[^0-9]/g, '');
  return numbers.length === 11 && numbers.startsWith('010');
}

export function PhoneInput({
  value,
  onChangeText,
  error,
  editable = true,
}: PhoneInputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    const formatted = formatPhoneNumber(text);
    onChangeText(formatted);
  };

  const getBorderColor = () => {
    if (error) {
      return theme.colors.surface.env.accent;
    }
    if (isFocused) {
      return theme.colors.surface.brand.primary;
    }
    return theme.colors.border.lowEmp;
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
          },
        ]}
      >
        전화번호
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: getBorderColor(),
            backgroundColor: theme.colors.surface.normal.bg1,
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
          },
          !editable && { backgroundColor: theme.colors.surface.normal.bg2 },
        ]}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="숫자만 입력해 주세요"
        placeholderTextColor={theme.colors.surface.texticon.onnormal.text.midEmp}
        keyboardType="phone-pad"
        maxLength={13} // 010-0000-0000
        editable={editable}
        autoComplete="tel"
        textContentType="telephoneNumber"
      />

      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: theme.colors.surface.env.accent,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
});

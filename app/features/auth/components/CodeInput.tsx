/**
 * Code Input Component
 *
 * 6자리 인증코드 입력 컴포넌트
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';

interface CodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export function CodeInput({ value, onChangeText, error }: CodeInputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    // 숫자만 허용, 최대 6자리
    const numbers = text.replace(/[^0-9]/g, '').slice(0, 6);
    onChangeText(numbers);
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
        인증번호
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
        ]}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="123456"
        placeholderTextColor={theme.colors.surface.texticon.onnormal.text.midEmp}
        keyboardType="number-pad"
        maxLength={6}
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
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

      <Text
        style={[
          styles.hint,
          {
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
            fontFamily: theme.typography.fontFamily.primary,
          },
        ]}
      >
        개발 모드: 인증번호는 123456입니다
      </Text>
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
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 4,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'center',
  },
});

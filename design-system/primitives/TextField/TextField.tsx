/**
 * TextField Component
 *
 * 범용 텍스트 입력 필드 컴포넌트입니다.
 * Figma 디자인 시스템의 텍스트입력창을 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=613-10258&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 주요 기능:
 * - 기본 텍스트 입력
 * - Placeholder 지원
 * - 커서 라인 표시 (옵션)
 * - 포커스 상태 관리
 *
 * 반응형 디자인:
 * - 컨테이너: width: '100%' (부모에서 제어)
 * - Input: flex: 1 (가변, 디바이스 크기에 따라 자동 조절)
 * - 모든 디바이스(320px~768px)에서 정상 작동
 *
 * 사용 예시:
 * ```tsx
 * <TextField
 *   value={nickname}
 *   onChangeText={setNickname}
 *   placeholder="닉네임을 입력해주세요."
 *   showCursor={true}
 * />
 * ```
 */

import React from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '../../hooks';
import { createTextFieldStyles } from './TextField.styles';
import type { TextFieldProps } from './TextField.types';

/**
 * TextField Component
 */
export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  showCursor = false,
  onFocusChange,
  containerStyle,
  inputStyle,
  accessibilityLabel,
  testID,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const styles = createTextFieldStyles(theme);

  // 포커스 핸들러
  const handleFocus = () => {
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    onFocusChange?.(false);
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      accessibilityRole="none"
      testID={testID || 'text-field'}
    >
      <View style={styles.inputWrapper}>
        {/* Input Field */}
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.surface.texticon.onnormal.text.midEmp} // #9FA7B1
          accessibilityLabel={accessibilityLabel || placeholder || '텍스트 입력'}
          {...textInputProps}
        />

      </View>
    </View>
  );
};

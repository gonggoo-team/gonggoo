/**
 * LabeledInput Component
 *
 * 라벨이 있는 입력 필드 컴포넌트입니다.
 * Figma 디자인 시스템의 회원가입/번호 입력을 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/jPe01AFoSydgfZcPoZwncX/Untitled?node-id=116-72
 * 마지막 동기화: 2025-10-06
 *
 * 사용 예시:
 * <LabeledInput
 *   label="휴대폰 번호"
 *   value="010-1234-5678"
 *   onChangeText={handleChange}
 *   variant="phone"
 * />
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../hooks';
import { createLabeledInputStyles } from './LabeledInput.styles';
import { Icon } from '../Icon';
import { Divider } from '../Divider';

/**
 * LabeledInput Variant (Figma 기반)
 */
export type LabeledInputVariant =
  | 'phone'        // 휴대폰 번호 입력
  | 'verification'; // 인증번호 입력

/**
 * LabeledInput Props
 */
export interface LabeledInputProps extends Omit<TextInputProps, 'style'> {
  /** 라벨 텍스트 */
  label: string;

  /** 입력값 */
  value: string;

  /** 값 변경 핸들러 */
  onChangeText: (text: string) => void;

  /** 입력 필드 변형 */
  variant?: LabeledInputVariant;

  /** 삭제 버튼 표시 여부 (기본: 값이 있으면 표시) */
  showClearButton?: boolean;

  /** 삭제 버튼 클릭 핸들러 */
  onClear?: () => void;

  /** 컨테이너 커스텀 스타일 */
  containerStyle?: StyleProp<ViewStyle>;

  /** 라벨 커스텀 스타일 */
  labelStyle?: StyleProp<TextStyle>;

  /** 입력 필드 커스텀 스타일 */
  inputStyle?: StyleProp<TextStyle>;

  /** Divider 표시 여부 (기본: true) */
  showDivider?: boolean;
}

/**
 * LabeledInput Component
 */
export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChangeText,
  variant = 'phone',
  showClearButton,
  onClear,
  containerStyle,
  labelStyle,
  inputStyle,
  showDivider = true,
  placeholder,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const styles = createLabeledInputStyles(theme);

  // Focus 상태 관리
  const [isFocused, setIsFocused] = React.useState(false);

  // 삭제 버튼 표시 여부 결정
  const shouldShowClearButton = showClearButton !== undefined
    ? showClearButton
    : value.length > 0;

  // 삭제 핸들러
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  };

  // Focus 핸들러
  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  // Blur 핸들러
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // placeholder 기본값
  const defaultPlaceholder = variant === 'verification'
    ? '숫자를 입력해 주세요'
    : '';

  // Focus 상태에 따른 label 색상
  const labelColor = isFocused
    ? theme.colors.surface.brand.primary
    : theme.colors.surface.texticon.onnormal.text.lowEmp;

  // Focus 상태에 따른 divider 색상
  const dividerColor = isFocused
    ? theme.colors.surface.brand.primary
    : theme.colors.border.lowEmp;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }, labelStyle]}>
          {label}
        </Text>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || defaultPlaceholder}
          placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
          {...textInputProps}
        />

        {/* Clear Button */}
        {shouldShowClearButton && (
          <TouchableOpacity
            onPress={handleClear}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="입력 내용 삭제"
          >
            <Icon name="text-delete" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      {showDivider && (
        <View style={styles.dividerContainer}>
          <Divider
            color="lowEmp"
            style={{ backgroundColor: dividerColor }}
          />
        </View>
      )}
    </View>
  );
};

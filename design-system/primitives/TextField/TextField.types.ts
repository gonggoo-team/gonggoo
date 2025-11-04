/**
 * TextField Type Definitions
 *
 * 텍스트 입력 필드 컴포넌트의 타입을 정의합니다.
 */

import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

/**
 * TextField Props
 */
export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** 입력값 */
  value: string;

  /** 값 변경 핸들러 */
  onChangeText: (text: string) => void;

  /** Placeholder 텍스트 */
  placeholder?: string;

  /** 커서 라인 표시 여부 (기본: false) */
  showCursor?: boolean;

  /** 포커스 상태 변경 핸들러 */
  onFocusChange?: (focused: boolean) => void;

  /** 컨테이너 커스텀 스타일 */
  containerStyle?: StyleProp<ViewStyle>;

  /** 입력 필드 커스텀 스타일 */
  inputStyle?: StyleProp<TextStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;

  /** 테스트 ID */
  testID?: string;
}

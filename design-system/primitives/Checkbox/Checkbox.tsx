/**
 * Checkbox Component
 *
 * 디자인 시스템의 기본 체크박스 컴포넌트입니다.
 * 라벨과 체크박스 아이콘을 조합한 형태로 제공됩니다.
 *
 * 사용 예시:
 * <Checkbox
 *   checked={isChecked}
 *   label="예약 가능한 공구만 보기"
 *   onPress={() => setIsChecked(!isChecked)}
 * />
 */

import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import { createCheckboxStyles } from './Checkbox.styles';

/**
 * Checkbox Props
 */
export interface CheckboxProps {
  /** 체크 상태 */
  checked: boolean;

  /** 라벨 텍스트 */
  label: string;

  /** 클릭 핸들러 */
  onPress: () => void;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 체크박스 위치 (기본: left) */
  position?: 'left' | 'right';

  /** 커스텀 스타일 (컨테이너) */
  style?: StyleProp<ViewStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;

  /** 테스트 ID */
  testID?: string;
}

/**
 * Checkbox Component
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  label,
  onPress,
  disabled = false,
  position = 'left',
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = createCheckboxStyles(theme);

  // 컨테이너 스타일 구성
  const containerStyle = [
    styles.container,
    position === 'right' && styles.containerReverse,
    disabled && styles.disabled,
    style,
  ];

  // 아이콘 색상
  const iconColor = checked
    ? theme.colors.surface.brand.primary
    : theme.colors.border.midEmp;

  const iconElement = (
    <View style={styles.iconContainer}>
      <Icon
        name={checked ? 'check-box-fill' : 'check-box-empty'}
        size={24}
        color={iconColor}
      />
    </View>
  );

  const labelElement = (
    <Text style={[styles.label, disabled && styles.disabledText]}>
      {label}
    </Text>
  );

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ checked, disabled }}
      testID={testID}
    >
      {position === 'left' ? (
        <>
          {iconElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement}
          {iconElement}
        </>
      )}
    </TouchableOpacity>
  );
};

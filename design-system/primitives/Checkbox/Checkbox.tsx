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

import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import { createCheckboxStyles } from './Checkbox.styles';

/** 터치 영역 확대를 위한 hitSlop */
const HIT_SLOP = { top: 4, right: 4, bottom: 4, left: 4 };

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
 * Checkbox Component (React.memo로 최적화)
 */
export const Checkbox = React.memo<CheckboxProps>(({
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
  const styles = useMemo(() => createCheckboxStyles(theme), [theme]);

  // 컨테이너 스타일 구성 (메모이제이션)
  const containerStyle = useMemo(() => [
    styles.container,
    position === 'right' && styles.containerReverse,
    disabled && styles.disabled,
    style,
  ], [styles, position, disabled, style]);

  // 아이콘 색상 (메모이제이션)
  const iconColor = useMemo(() =>
    checked
      ? theme.colors.surface.brand.primary
      : theme.colors.border.midEmp,
    [checked, theme.colors.surface.brand.primary, theme.colors.border.midEmp]
  );

  // Pressable 스타일 헬퍼
  const getPressedStyle = useCallback(
    ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
      containerStyle,
      pressed && !disabled && { opacity: 0.7 },
    ],
    [containerStyle, disabled]
  );

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
    <Pressable
      style={getPressedStyle}
      onPress={onPress}
      disabled={disabled}
      delayPressIn={0}
      hitSlop={HIT_SLOP}
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
    </Pressable>
  );
});

Checkbox.displayName = 'Checkbox';

/**
 * Button Component
 *
 * 디자인 시스템의 기본 버튼 컴포넌트입니다.
 * Figma의 디자인 토큰을 활용하여 일관된 스타일을 제공합니다.
 *
 * 사용 예시:
 * <Button variant="primary" size="md" onPress={handlePress}>
 *   클릭하기
 * </Button>
 */

import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../hooks';

import { createButtonStyles } from './Button.styles';

/** 터치 영역 확대를 위한 hitSlop */
const HIT_SLOP = { top: 4, right: 4, bottom: 4, left: 4 };

/**
 * Button Variant (Figma 기반)
 */
export type ButtonVariant =
  | 'category-selected'    // 라운드 칩 - 선택됨
  | 'category-unselected'  // 라운드 칩 - 미선택
  | 'price-selected'       // 가격 버튼 - 선택됨
  | 'price-unselected'     // 가격 버튼 - 미선택
  | 'square-selected'      // 사각형 - 선택됨
  | 'square-unselected'    // 사각형 - 미선택
  | 'full-primary'         // 전체 너비 - 주요 (활성)
  | 'full-primary-rounded' // 전체 너비 - 주요 (활성) + 둥근 모서리
  | 'full-secondary'       // 전체 너비 - 보조 (비활성 검정)
  | 'full-secondary-rounded' // 전체 너비 - 보조 (비활성 검정) + 둥근 모서리
  | 'full-disabled'        // 전체 너비 - 비활성 (회색)
  | 'small'                // 작은 버튼 (키보드 부착)
  | 'search-active'        // 검색 버튼 - 활성
  | 'search-inactive';     // 검색 버튼 - 비활성

/**
 * Button Size (square variant 전용)
 */
export type ButtonSize = 'long' | 'short';

/**
 * Button Props
 */
export interface ButtonProps {
  /** 버튼 텍스트 */
  children: string;

  /** 버튼 스타일 변형 (Figma 기반) */
  variant?: ButtonVariant;

  /** 버튼 크기 (square variant 전용: long=345px, short=172px) */
  size?: ButtonSize;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 로딩 상태 */
  loading?: boolean;

  /** 클릭 핸들러 */
  onPress?: () => void;

  /** 커스텀 스타일 (컨테이너) */
  style?: StyleProp<ViewStyle>;

  /** 커스텀 텍스트 스타일 */
  textStyle?: StyleProp<TextStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;

  /** 아이콘 (search variant용) */
  icon?: React.ReactNode;
}

/**
 * Button Component (React.memo로 최적화)
 */
export const Button = React.memo<ButtonProps>(({
  children,
  variant = 'category-selected',
  size,
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  icon,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createButtonStyles(theme), [theme]);

  const isDisabled = disabled || loading;

  // 컨테이너 스타일 구성 (메모이제이션)
  const containerStyle = useMemo(() => [
    styles.base,
    styles[variant],
    size && styles[size],
    isDisabled && styles.disabled,
    style,
  ], [styles, variant, size, isDisabled, style]);

  // 텍스트 스타일 구성 (메모이제이션)
  const textStyleCombined = useMemo(() => [
    styles.text,
    styles[`${variant}-text` as keyof typeof styles],
    textStyle,
  ], [styles, variant, textStyle]);

  // 로딩 스피너 색상 결정
  const spinnerColor = useMemo(() =>
    variant.includes('selected') || variant === 'full-primary'
      ? theme.colors.surface.texticon.onnormal.text.white
      : theme.colors.surface.texticon.onnormal.text.midEmp,
    [variant, theme.colors.surface.texticon.onnormal.text]
  );

  // Pressable 스타일 헬퍼
  const getPressedStyle = useCallback(
    ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
      containerStyle,
      pressed && !isDisabled && { opacity: 0.7 },
    ],
    [containerStyle, isDisabled]
  );

  return (
    <Pressable
      style={getPressedStyle}
      onPress={onPress}
      disabled={isDisabled}
      delayPressIn={0}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={textStyleCombined}>{children}</Text>
        </>
      )}
    </Pressable>
  );
});

Button.displayName = 'Button';

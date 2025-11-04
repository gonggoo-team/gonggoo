/**
 * Divider Component
 *
 * 수평 또는 수직 구분선 컴포넌트입니다.
 * Figma 디자인 시스템의 divider를 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/jPe01AFoSydgfZcPoZwncX/Untitled?node-id=116-72
 * 마지막 동기화: 2025-10-06
 *
 * 사용 예시:
 * <Divider />
 * <Divider orientation="vertical" />
 * <Divider color="midEmp" />
 */

import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { createDividerStyles } from './Divider.styles';

/**
 * Divider Orientation
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Divider Color Key
 */
export type DividerColorKey = 'lowEmp' | 'midEmp' | 'highEmp';

/**
 * Divider Props
 */
export interface DividerProps {
  /** 방향 (기본: horizontal) */
  orientation?: DividerOrientation;

  /** 색상 키 (기본: lowEmp) */
  color?: DividerColorKey;

  /** 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * Divider Component
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = 'lowEmp',
  style,
  accessibilityLabel = 'divider',
}) => {
  const { theme } = useTheme();
  const styles = createDividerStyles(theme);

  // 스타일 구성
  const dividerStyle = [
    styles.base,
    styles[orientation],
    styles[color],
    style,
  ];

  return (
    <View
      style={dividerStyle}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
    />
  );
};

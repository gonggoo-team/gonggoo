/**
 * ProgressBar Component
 *
 * 진행률을 표시하는 게이지 컴포넌트입니다.
 * 퍼센트 라벨을 가운데 정렬로 표시합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <ProgressBar percentage={66} variant="light" />
 * <ProgressBar percentage={20} variant="dark" showLabel={false} />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { createProgressBarStyles } from './ProgressBar.styles';
import type { ProgressBarProps } from './ProgressBar.types';

/**
 * ProgressBar Component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  variant = 'light',
  showLabel = true,
}) => {
  const { theme } = useTheme();
  const styles = createProgressBarStyles(theme, variant);

  // 0-100 범위로 제한
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedPercentage }}
      accessibilityLabel={`${clampedPercentage}% 달성`}
    >
      {/* 진행 바 */}
      <View style={[styles.fill, { width: `${clampedPercentage}%` }]} />

      {/* 퍼센트 라벨 */}
      {showLabel && <Text style={styles.text}>{clampedPercentage}%</Text>}
    </View>
  );
};

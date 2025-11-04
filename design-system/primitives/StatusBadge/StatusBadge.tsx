/**
 * StatusBadge Component
 *
 * 상태 표시용 배지 컴포넌트입니다.
 * View 기반으로 클릭 불가능하며, 정보 표시만 담당합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <StatusBadge type="deadline" label="오늘 마감" />
 * <StatusBadge type="recruiting" label="3명 모집" />
 * <StatusBadge type="remaining" label="14일 남음" />
 * <StatusBadge type="closed" label="모집 마감" />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { createStatusBadgeStyles } from './StatusBadge.styles';
import type { StatusBadgeProps } from './StatusBadge.types';

/**
 * StatusBadge Component
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  const { theme } = useTheme();
  const styles = createStatusBadgeStyles(theme, type);

  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

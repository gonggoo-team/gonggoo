/**
 * CountBadge Component
 *
 * GNB와 TabBar에서 공통으로 사용하는 숫자 배지 컴포넌트입니다.
 * - 0일 때는 표시하지 않음
 * - 99 초과 시 "99+" 표시
 * - variant로 GNB/TabBar 스타일 구분
 *
 * 사용 예시:
 * ```tsx
 * // GNB에서 사용 (빨간색)
 * <CountBadge count={3} variant="gnb" />
 *
 * // TabBar에서 사용 (초록색, 흰색 테두리)
 * <CountBadge count={5} variant="tabbar" style={{ top: 13, left: '50%', transform: [{ translateX: 7 }] }} />
 *
 * // 99+ 표시
 * <CountBadge count={150} variant="gnb" />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { createCountBadgeStyles } from './CountBadge.styles';
import type { CountBadgeProps } from './CountBadge.types';

/**
 * CountBadge Component
 */
export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  variant = 'gnb',
  style,
}) => {
  const { theme } = useTheme();
  const styles = createCountBadgeStyles(theme, variant);

  // count가 0이면 렌더링하지 않음
  if (count <= 0) {
    return null;
  }

  // 99 초과 시 "99+" 표시
  const displayText = count > 99 ? '99+' : count.toString();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{displayText}</Text>
    </View>
  );
};

/**
 * RankingIndicator Component
 *
 * 순위 변동을 표시하는 컴포넌트입니다.
 * Figma 디자인 시스템의 검색창/인기순위 요소를 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/jPe01AFoSydgfZcPoZwncX/Untitled?node-id=116-72
 * 마지막 동기화: 2025-10-06
 *
 * 사용 예시:
 * <RankingIndicator variant="up" />
 * <RankingIndicator variant="down" />
 * <RankingIndicator variant="maintain" />
 */

import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { createRankingIndicatorStyles } from './RankingIndicator.styles';
import { Icon } from '../Icon';

/**
 * RankingIndicator Variant (Figma 기반)
 */
export type RankingIndicatorVariant =
  | 'up'        // 순위 상승 (빨간 화살표)
  | 'down'      // 순위 하락 (파란 화살표)
  | 'maintain'; // 순위 유지 (회색 선)

/**
 * RankingIndicator Props
 */
export interface RankingIndicatorProps {
  /** 순위 변동 상태 */
  variant: RankingIndicatorVariant;

  /** 컨테이너 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * RankingIndicator Component
 */
export const RankingIndicator: React.FC<RankingIndicatorProps> = ({
  variant,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const styles = createRankingIndicatorStyles(theme);

  // variant에 따라 아이콘 선택
  const getIconName = (): 'arrow-up' | 'arrow-down' | 'ranking-maintain' => {
    switch (variant) {
      case 'up':
        return 'arrow-up';
      case 'down':
        return 'arrow-down';
      case 'maintain':
      default:
        return 'ranking-maintain';
    }
  };

  // 접근성 라벨 기본값
  const defaultAccessibilityLabel =
    variant === 'up'
      ? '순위 상승'
      : variant === 'down'
      ? '순위 하락'
      : '순위 유지';

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
    >
      <Icon name={getIconName()} size={10} />
    </View>
  );
};

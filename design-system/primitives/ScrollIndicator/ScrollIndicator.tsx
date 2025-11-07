/**
 * ScrollIndicator Component
 *
 * 스크롤 가능한 콘텐츠의 페이지네이션을 표시하는 인디케이터입니다.
 * 점(dot) 형태로 현재 페이지를 시각적으로 표시합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6497&m=dev
 * 마지막 동기화: 2025-10-09
 *
 * 사용 예시:
 * ```tsx
 * <ScrollIndicator
 *   currentIndex={0}
 *   totalPages={3}
 * />
 * ```
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks';
import { createScrollIndicatorStyles } from './ScrollIndicator.styles';
import type { ScrollIndicatorProps } from './ScrollIndicator.types';

/**
 * ScrollIndicator Component
 */
export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  currentIndex = 0,
  currentPage,
  totalPages,  
  activeColor = '#A6A6A6', // Figma 기준
  inactiveColor = '#D1D6DA', // Figma 기준
}) => {
  const { theme } = useTheme();
  const styles = createScrollIndicatorStyles(theme);

  // 페이지가 1개 이하면 인디케이터 숨김
  if (totalPages <= 1) {
    return null;
  }

  // 현재 인덱스를 0 ~ totalPages-1 범위로 제한
  const clampedIndex = Math.max(0, Math.min(totalPages - 1, currentIndex));

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`${totalPages}개 중 ${clampedIndex + 1}번째 페이지`}
    >
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === clampedIndex ? activeColor : inactiveColor,
            },
          ]}
        />
      ))}
    </View>
  );
};

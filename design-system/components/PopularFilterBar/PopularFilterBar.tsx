/**
 * PopularFilterBar Component
 *
 * 인기 탭 전용 3개 필터 버튼 바입니다. (성별/연령대/기간)
 * - FilterBottomSheet와 함께 사용
 * - 각 버튼 클릭 시 FilterBottomSheet 열림
 * - SortButton 컴포넌트 재사용으로 동네/오늘마감 탭과 동일한 스타일
 *
 * 사용 예시:
 * ```tsx
 * <PopularFilterBar
 *   onGenderPress={() => { setActiveTab('gender'); setIsFilterVisible(true); }}
 *   onAgePress={() => { setActiveTab('age'); setIsFilterVisible(true); }}
 *   onPeriodPress={() => { setActiveTab('period'); setIsFilterVisible(true); }}
 * />
 * ```
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks';
import { SortButton } from '../../primitives/SortButton';
import { createPopularFilterBarStyles } from './PopularFilterBar.styles';
import type { PopularFilterBarProps } from './PopularFilterBar.types';

/**
 * PopularFilterBar Component
 */
export const PopularFilterBar: React.FC<PopularFilterBarProps> = ({
  onGenderPress,
  onAgePress,
  onPeriodPress,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createPopularFilterBarStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <SortButton label="성별" icon="drop" isOpen={false} onPress={onGenderPress} />
      <SortButton label="연령대" icon="drop" isOpen={false} onPress={onAgePress} />
      <SortButton label="기간" icon="drop" isOpen={false} onPress={onPeriodPress} />
    </View>
  );
};

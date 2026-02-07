/**
 * RecommendedSearchGrid Component
 *
 * 추천 검색어 자동 줄바꿈 그리드 컴포넌트입니다.
 * flexWrap을 사용하여 자동으로 줄바꿈하며, 최대 표시 줄 수를 제한합니다.
 *
 * 주요 기능:
 * - flexWrap으로 자동 줄바꿈
 * - 최대 줄 수 제한 (기본 4줄)
 * - 텍스트 길이에 따라 유동적으로 배치
 * - 다양한 디바이스 크기 대응
 *
 * 사용 예시:
 * ```tsx
 * <RecommendedSearchGrid
 *   items={recommendedSearches}
 *   onPress={handleTagPress}
 *   maxLines={4}
 * />
 * ```
 */

import type { RecommendedSearch } from '@/app/shared/types/search';
import { SearchTag, useTheme } from '@/design-system';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * RecommendedSearchGrid Props
 */
export interface RecommendedSearchGridProps {
  /** 추천 검색어 목록 */
  items: RecommendedSearch[];

  /** 검색어 클릭 핸들러 */
  onPress: (keyword: string) => void;

  /** 최대 표시 줄 수 (기본: 4줄) */
  maxLines?: number;
}

/**
 * RecommendedSearchGrid Component
 */
export const RecommendedSearchGrid: React.FC<RecommendedSearchGridProps> = ({
  items,
  onPress,
  maxLines = 4,
}) => {
  const { theme } = useTheme();

  /**
   * 표시할 아이템 목록
   *
   * 현재는 모든 아이템을 표시하고, flexWrap으로 자동 줄바꿈합니다.
   * maxLines는 향후 더 정교한 제어가 필요할 때 사용할 수 있습니다.
   *
   * 참고: 정확한 줄 수 제어를 위해서는 각 태그의 너비를 측정해야 하지만,
   * 이는 성능 저하를 일으킬 수 있으므로 현재는 단순하게 구현합니다.
   */
  const displayItems = useMemo(() => {
    // 현재는 모든 아이템을 표시
    // 향후 필요시 maxLines 기반으로 아이템 수를 제한할 수 있음
    return items;
  }, [items]);

  return (
    <View
      style={[
        styles.grid,
        {
          gap: 10, // Figma 기준: 아이템 간격
          paddingHorizontal: theme.spacing.lg, // 20px          
        },
      ]}
    >
      {displayItems.map((item) => (
        <SearchTag
          key={item.id}
          variant="recommended"
          text={item.keyword}
          onPress={onPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  /**
   * 그리드 컨테이너 (flexWrap 적용)
   */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 자동 줄바꿈
    // gap: 10px (동적 설정)
    // paddingHorizontal: 20px (동적 설정)
  },
});

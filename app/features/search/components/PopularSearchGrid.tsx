/**
 * PopularSearchGrid Component
 *
 * 인기 검색어 2열 그리드 레이아웃 컴포넌트입니다.
 * Figma 디자인에 따라 1-5위는 왼쪽 열, 6-10위는 오른쪽 열에 배치됩니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=449-8822
 * 마지막 동기화: 2025-10-24
 *
 * 레이아웃:
 * - 2열 구조 (gap: 23px between columns, Figma 기준)
 * - 각 열 내부 행 간격: 17px (Figma 기준)
 * - 왼쪽 열: 1, 2, 3, 4, 5위
 * - 오른쪽 열: 6, 7, 8, 9, 10위
 */

import { PopularSearchItem, useTheme } from '@/design-system';
import type { PopularSearch } from '@/app/shared/types/search';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * PopularSearchGrid Props
 */
export interface PopularSearchGridProps {
  /** 인기 검색어 목록 (1-10위) */
  items: PopularSearch[];

  /** 검색어 클릭 핸들러 */
  onPress: (keyword: string) => void;
}

/**
 * PopularSearchGrid Component
 */
export const PopularSearchGrid: React.FC<PopularSearchGridProps> = ({
  items,
  onPress,
}) => {
  const { theme } = useTheme();

  // 왼쪽 열 (1-5위), 오른쪽 열 (6-10위)로 분할
  const { leftColumn, rightColumn } = useMemo(() => {
    const left = items.filter((item) => item.rank >= 1 && item.rank <= 5);
    const right = items.filter((item) => item.rank >= 6 && item.rank <= 10);
    return { leftColumn: left, rightColumn: right };
  }, [items]);

  return (
    <View
      style={[
        styles.grid,
        {
          gap: 23, // Figma 기준: 열 간격
          paddingHorizontal: theme.spacing.lg, // 20px
        },
      ]}
    >
      {/* 왼쪽 열 (1-5위) */}
      <View
        style={[
          styles.column,
          {
            gap: 17, // Figma 기준: 행 간격
          },
        ]}
      >
        {leftColumn.map((item) => (
          <PopularSearchItem
            key={item.rank}
            rank={item.rank}
            keyword={item.keyword}
            rankingChange={item.rankingChange}
            onPress={onPress}
          />
        ))}
      </View>

      {/* 오른쪽 열 (6-10위) */}
      <View
        style={[
          styles.column,
          {
            gap: 17, // Figma 기준: 행 간격
          },
        ]}
      >
        {rightColumn.map((item) => (
          <PopularSearchItem
            key={item.rank}
            rank={item.rank}
            keyword={item.keyword}
            rankingChange={item.rankingChange}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /**
   * 그리드 컨테이너 (2열)
   */
  grid: {
    flexDirection: 'row',
    // gap: 23px (동적 설정)
    // paddingHorizontal: 20px (동적 설정)
  },

  /**
   * 각 열 (왼쪽, 오른쪽)
   */
  column: {
    flex: 1, // 각 열이 동일한 너비를 가짐
    // gap: 17px (동적 설정)
  },
});

/**
 * RecentSearchList Component
 *
 * 최근 검색어 수평 스크롤 리스트 컴포넌트입니다.
 * FlatList horizontal 모드를 사용하여 성능을 최적화합니다.
 *
 * 주요 기능:
 * - FlatList horizontal로 성능 최적화
 * - getItemLayout으로 스크롤 성능 향상
 * - 메모이제이션으로 불필요한 리렌더링 방지
 * - 다양한 디바이스 크기 대응
 *
 * 사용 예시:
 * ```tsx
 * <RecentSearchList
 *   items={recentSearches}
 *   onPress={handleTagPress}
 *   onDelete={handleDeleteRecentSearch}
 * />
 * ```
 */

import type { RecentSearch } from '@/app/shared/types/search';
import { SearchTag, useTheme } from '@/design-system';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

/**
 * RecentSearchList Props
 */
export interface RecentSearchListProps {
  /** 최근 검색어 목록 */
  items: RecentSearch[];

  /** 검색어 클릭 핸들러 */
  onPress: (keyword: string) => void;

  /** 검색어 삭제 핸들러 */
  onDelete: (keyword: string) => void;
}

/**
 * 아이템 평균 너비 추정 (성능 최적화용)
 * 실제 텍스트 길이에 따라 다르지만 평균적으로 약 100px
 */
const ESTIMATED_ITEM_WIDTH = 100;
const ITEM_GAP = 10; // Figma 기준

/**
 * RecentSearchList Component
 */
export const RecentSearchList: React.FC<RecentSearchListProps> = ({
  items,
  onPress,
  onDelete,
}) => {
  const { theme } = useTheme();

  /**
   * FlatList renderItem
   * useCallback으로 메모이제이션하여 성능 최적화
   */
  const renderItem = useCallback(
    ({ item }: { item: RecentSearch }) => (
      <SearchTag
        variant="recent"
        text={item.keyword}
        onPress={onPress}
        onDelete={onDelete}
      />
    ),
    [onPress, onDelete]
  );

  /**
   * FlatList keyExtractor
   * 고유 ID를 키로 사용
   */
  const keyExtractor = useCallback((item: RecentSearch) => item.id, []);

  /**
   * FlatList ItemSeparatorComponent
   * 아이템 사이 간격 추가 (Figma 기준 10px)
   */
  const ItemSeparator = useMemo(
    () => () => <View style={{ width: ITEM_GAP }} />,
    []
  );

  /**
   * FlatList getItemLayout
   * 성능 최적화: 스크롤 위치 계산을 빠르게 함
   * 주의: 실제 아이템 너비는 텍스트 길이에 따라 다르므로 정확하지 않을 수 있음
   * 하지만 대략적인 값이라도 제공하면 스크롤 성능이 향상됨
   */
  const getItemLayout = useCallback(
    (_data: ArrayLike<RecentSearch> | null | undefined, index: number) => ({
      length: ESTIMATED_ITEM_WIDTH,
      offset: (ESTIMATED_ITEM_WIDTH + ITEM_GAP) * index,
      index,
    }),
    []
  );

  /**
   * contentContainerStyle (동적)
   */
  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: theme.spacing.lg, // 20px
      minHeight: 68, // 레이아웃 점프 방지 (EmptyRecentSearches와 동일 높이)
    }),
    [theme]
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={ItemSeparator}
      getItemLayout={getItemLayout}
      contentContainerStyle={contentContainerStyle}
      style={styles.list}
      // 성능 최적화 옵션
      removeClippedSubviews={true} // 화면 밖 아이템 언마운트
      maxToRenderPerBatch={10} // 한 번에 렌더링할 최대 아이템 수
      windowSize={5} // 렌더링 윈도우 크기
      initialNumToRender={10} // 초기 렌더링 아이템 수
      // 접근성
      accessibilityRole="list"
      accessibilityLabel="최근 검색어 목록"
    />
  );
};

const styles = StyleSheet.create({
  list: {
    // 최소 스타일만 적용 (나머지는 동적)    
  },
});

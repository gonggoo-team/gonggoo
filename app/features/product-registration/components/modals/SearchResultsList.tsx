/**
 * SearchResultsList Component
 *
 * 주소 검색 결과를 표시하는 컴포넌트입니다.
 * LocationSelectionModal에서 사용됩니다.
 *
 * Features:
 * - 검색 결과를 FlatList로 표시
 * - 각 결과 클릭 시 지도 이동 + 결과 목록 닫기
 * - 도로명 주소 + 지번 주소 표시
 * - 검색 중일 때 "검색 중..." 표시
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/design-system';
import type { NeighborhoodSearchResult } from '@/app/features/location/services/naverGeocodingService';

interface SearchResultsListProps {
  /** 검색 결과 배열 */
  results: NeighborhoodSearchResult[];
  /** 결과 선택 핸들러 */
  onSelectResult: (result: NeighborhoodSearchResult) => void;
  /** 검색 중 여부 */
  isSearching: boolean;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  onSelectResult,
  isSearching,
}) => {
  const { theme } = useTheme();
  console.log(results)
  // 검색 중일 때
  if (isSearching) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.emptyText,
            { color: theme.colors.surface.texticon.onnormal.text.midEmp },
          ]}
        >
          검색 중...
        </Text>
      </View>
    );
  }

  // 결과가 없을 때 (검색 전 또는 결과 없음)
  if (results.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.resultItem,
              { borderBottomColor: theme.colors.border.lowEmp },
            ]}
            onPress={() => onSelectResult(item)}
            activeOpacity={0.7}
          >
            {/* 도로명 주소 (메인) */}
            <Text
              style={[
                styles.mainAddress,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
              numberOfLines={1}
            >
              {item.roadAddress || item.jibunAddress}
            </Text>

            {/* 지번 주소 (서브, 도로명과 다를 경우만 표시) */}
            {item.jibunAddress && item.roadAddress !== item.jibunAddress && (
              <Text
                style={[
                  styles.subAddress,
                  { color: theme.colors.surface.texticon.onnormal.text.midEmp },
                ]}
                numberOfLines={1}
              >
                {item.jibunAddress}
              </Text>
            )}
          </TouchableOpacity>
        )}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,    
  },
  list: {
    // flex: 1,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  mainAddress: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
    marginBottom: 4,
  },
  subAddress: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Pretendard',
    letterSpacing: -0.3,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    letterSpacing: -0.35,
  },
});

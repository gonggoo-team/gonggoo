/**
 * SearchResultsList Component
 *
 * 주소 검색 결과를 표시하는 컴포넌트입니다.
 * LocationSelectionModal에서 사용됩니다.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ScreenWrapper, useTheme } from '@/design-system';
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

  // 검색 중일 때
  if (isSearching) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
        <View style={styles.loadingWrapper}>
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.surface.texticon.onnormal.text.midEmp },
            ]}
          >
            검색 중...
          </Text>
        </View>
      </View>
    );
  }

  // 결과가 없을 때
  if (results.length === 0) {
    return null;
  }

  return (
    <ScreenWrapper
      preset='fullscreen'
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.resultItem,
              { borderBottomColor: theme.colors.border.lowEmp },
            ]}
            onPress={() => onSelectResult(item)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.mainAddress,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
              numberOfLines={1}
            >
              {item.roadAddress || item.jibunAddress}
            </Text>

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
        contentContainerStyle={styles.listContent}
        
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}        
        nestedScrollEnabled={true} 
        bounces={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  list: {
    maxHeight: 275, 
    flexGrow: 0, // 250보다 작을 땐 내용물만큼만 차지
  },
  listContent: {
    paddingBottom: 4,
  },
  loadingWrapper: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  resultItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  mainAddress: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
    marginBottom: 4,
  },
  subAddress: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Pretendard',
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    letterSpacing: -0.35,
  },
});
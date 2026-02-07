/**
 * Neighborhood Search Screen
 *
 * 동네 검색 화면
 * - 주소 또는 동네명 검색
 * - 검색 결과 리스트에서 체크박스로 선택
 * - 선택한 동네 정보를 다음 화면으로 전달
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ThemeProvider, useTheme, GNB, Button, SearchBar, Icon, ScreenWrapper } from '@/design-system';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { searchNeighborhoods, type NeighborhoodSearchResult } from './services/naverGeocodingService';

export default function NeighborhoodSearchScreen() {
  return (
    <ThemeProvider>
      <NeighborhoodSearchScreenContent />
    </ThemeProvider>
  );
}

function NeighborhoodSearchScreenContent() {
  const { theme } = useTheme();
  const { back } = useThrottledNavigation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NeighborhoodSearchResult[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodSearchResult | null>(null);

  /**
   * 검색 핸들러
   */
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchNeighborhoods(query);
      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert('검색 결과 없음', '검색 결과가 없습니다. 다른 검색어를 입력해주세요.');
      }
    } catch (error) {
      console.error('[NeighborhoodSearch] Search error:', error);
      Alert.alert('검색 실패', '검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * 동네 선택 핸들러
   */
  const handleSelectNeighborhood = useCallback((neighborhood: NeighborhoodSearchResult) => {
    // 이미 선택된 동네를 다시 클릭하면 선택 해제
    if (selectedNeighborhood?.id === neighborhood.id) {
      setSelectedNeighborhood(null);
    } else {
      setSelectedNeighborhood(neighborhood);
    }
  }, [selectedNeighborhood]);

  /**
   * 다음 버튼 핸들러
   *
   * replace를 사용하여 검색 화면을 location-setting으로 대체
   * 스택: 내 정보 → neighborhood-search → location-setting (X)
   * 스택: 내 정보 → location-setting (O)
   */
  const handleNext = useCallback(() => {
    if (!selectedNeighborhood) {
      Alert.alert('알림', '동네를 선택해주세요.');
      return;
    }

    // 검색 화면을 location-setting으로 대체 (fromSearch 플래그 제거)
    router.replace({
      pathname: '/location-setting',
      params: {
        mode: 'manual',
        lat: selectedNeighborhood.latitude.toString(),
        lng: selectedNeighborhood.longitude.toString(),
        address: selectedNeighborhood.fullAddress,
        neighborhood: selectedNeighborhood.neighborhood,
        city: selectedNeighborhood.city,
        district: selectedNeighborhood.district,
      },
    });
  }, [selectedNeighborhood, router]);

  /**
   * 검색 결과 아이템 렌더링
   */
  const renderSearchResultItem = useCallback(({ item }: { item: NeighborhoodSearchResult }) => {
    const isSelected = selectedNeighborhood?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.resultItem,
          {
            backgroundColor: theme.colors.surface.normal.bg1,
            borderBottomColor: theme.colors.border.lowEmp,
          },
        ]}
        onPress={() => handleSelectNeighborhood(item)}
        activeOpacity={0.7}
      >
        {/* 체크박스 */}
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isSelected
                ? theme.colors.surface.brand.primary
                : theme.colors.border.lowEmp,
              backgroundColor: isSelected
                ? theme.colors.surface.brand.primary
                : theme.colors.surface.normal.bg1,
            },
          ]}
        >
          {isSelected && (
            <Icon
              name="check"
              // width={16}
              // height={16}
              color="#FFFFFF"
            />
          )}
        </View>

        {/* 동네 정보 */}
        <View style={styles.infoContainer}>
          {/* 동네명 */}
          <Text
            style={[
              styles.neighborhood,
              {
                color: theme.colors.surface.texticon.onnormal.text.black,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.semiBold,
              },
            ]}
          >
            {item.neighborhood || '동네명 없음'}
          </Text>

          {/* 주소 */}
          <Text
            style={[
              styles.address,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.regular,
              },
            ]}
            numberOfLines={2}
          >
            {item.fullAddress}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [selectedNeighborhood, theme, handleSelectNeighborhood]);

  return (
    <ScreenWrapper preset='fullscreen' style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg2 }]}>
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: '동네 설정',
          onPress: back,
        }}
      />

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
          placeholder="동네명 또는 주소 검색 (예: 역삼동)"
          editable={!isSearching}
        />
      </View>

      {/* 검색 결과 리스트 */}
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.surface.brand.primary}
          />
          <Text
            style={[
              styles.loadingText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            검색 중...
          </Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResultItem}
          keyExtractor={(item) => item.id}
          style={styles.resultList}
          contentContainerStyle={styles.resultListContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            {searchQuery ? '검색 결과가 없습니다.' : '동네명 또는 주소를 검색해주세요.'}
          </Text>
        </View>
      )}

      {/* 다음 버튼 */}
      <View style={styles.buttonContainer}>
        <Button
          variant="full-primary-rounded"
          onPress={handleNext}
          disabled={!selectedNeighborhood}
        >
          다음
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 17,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 17,
  },
  resultList: {
    flex: 1,
  },
  resultListContent: {
    paddingBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  neighborhood: {
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.4,
  },
  address: {
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.3,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
  },
});

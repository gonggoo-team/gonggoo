/**
 * Search Screen (리팩토링 버전)
 *
 * 검색 화면입니다.
 * GNB의 검색 아이콘을 클릭하면 표시되는 전체 화면 검색 화면입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=449-8791&m=dev
 * 마지막 동기화: 2025-10-24
 *
 * 주요 개선 사항:
 * - Status Bar 제거 (app/_layout.tsx에서 headerShown: false 설정)
 * - 인기 검색어 2열 레이아웃 (PopularSearchGrid 사용)
 * - 섹션 컴포넌트화 (SearchSection 사용)
 * - 검색바 너비 확대 (패딩 조정)
 * - 반응형 개선 (모든 디바이스 대응)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchService } from '@/app/shared/services/searchService';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import type {
  PopularSearch,
  RecentSearch,
  RecommendedSearch,
} from '@/app/shared/types/search';

import {
  Icon,
  SearchBar,
  useTheme,
} from '@/design-system';

import {
  EmptyRecentSearches,
  PopularSearchGrid,
  RecentSearchList,
  RecommendedSearchGrid,
  SearchSection
} from './components';

/**
 * SearchScreen Component
 */
export default function SearchScreen() {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();
  const insets = useSafeAreaInsets();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recommendedSearches, setRecommendedSearches] = useState<
    RecommendedSearch[]
  >([]);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSearchData = async () => {
    setIsLoading(true);
    try {
      const [recent, recommended, popular] = await Promise.all([
        SearchService.getRecentSearches(),
        SearchService.getRecommendedSearches(),
        SearchService.getPopularSearches(),
      ]);

      setRecentSearches(recent);
      setRecommendedSearches(recommended);
      setPopularSearches(popular);
    } catch (error) {
      console.error('[SearchScreen] 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadSearchData();
  }, []);

  // 화면이 포커스될 때마다 최근 검색어 갱신 (뒤로가기 대응)
  useFocusEffect(
    useCallback(() => {
      const refreshRecentSearches = async () => {
        try {
          const recent = await SearchService.getRecentSearches();
          setRecentSearches(recent);
        } catch (error) {
          console.error('[SearchScreen] 최근 검색어 갱신 실패:', error);
        }
      };

      refreshRecentSearches();
    }, [])
  );

  // 검색 실행
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    console.log('[SearchScreen] 검색 실행:', query);
    await SearchService.addRecentSearch(query);

    // 검색 결과 페이지로 이동
    push(`/search-results?q=${encodeURIComponent(query)}`);
  }, [push]);

  // 검색어 제출
  const handleSubmit = useCallback(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // 태그 클릭 (즉시 검색 실행)
  const handleTagPress = useCallback(async (text: string) => {
    // 즉시 검색 실행
    handleSearch(text);
  }, [handleSearch]);

  // 최근 검색어 삭제
  const handleDeleteRecentSearch = useCallback(async (text: string) => {
    const target = recentSearches.find((item) => item.keyword === text);
    if (target) {
      await SearchService.removeRecentSearch(target.id);
      setRecentSearches((prev) => prev.filter((item) => item.id !== target.id));
    }
  }, [recentSearches]);

  // 최근 검색어 전체 삭제
  const handleClearRecentSearches = useCallback(async () => {
    await SearchService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // 인기 검색어 클릭 (검색 + 최근 검색어에 추가)
  const handlePopularSearchPress = useCallback(async (keyword: string) => {
    handleSearch(keyword);
    // 최근 검색어에 추가
    await SearchService.addRecentSearch(keyword);
    const updated = await SearchService.getRecentSearches();
    setRecentSearches(updated);
  }, [handleSearch]);

  // 뒤로가기
  const handleGoBack = useCallback(() => {
    back();
  }, [back]);

  // 현재 시간 (인기 검색어 기준 시간)
  const currentTime = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')} 기준`;
  }, []);

  // "전체 삭제" 버튼 렌더링
  const renderClearButton = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={handleClearRecentSearches}
        accessibilityRole="button"
        accessibilityLabel="최근 검색어 전체 삭제"
      >
        <Text
          style={[
            styles.clearButtonText,
            {
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              letterSpacing: theme.typography.getLetterSpacing(
                theme.typography.fontSize.xs
              ),
              lineHeight:
                theme.typography.fontSize.xs *
                theme.typography.lineHeight.tight,
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
            },
          ]}
        >
          전체 삭제
        </Text>
      </TouchableOpacity>
    );
  }, [theme, handleClearRecentSearches]);

  // "인기 검색어" 헤더 (제목 + 시간 통합)
  const renderPopularSearchHeader = useMemo(() => {
    return (
      <View style={styles.popularSearchHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.semiBold,
              letterSpacing: theme.typography.getLetterSpacing(
                theme.typography.fontSize.md
              ),
              lineHeight:
                theme.typography.fontSize.md *
                theme.typography.lineHeight.tight,
              color: theme.colors.surface.texticon.onnormal.text.black,
            },
          ]}
        >
          인기 검색어
        </Text>
        <Text
          style={[
            styles.timestamp,
            {
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              letterSpacing: theme.typography.getLetterSpacing(
                theme.typography.fontSize.xs
              ),
              lineHeight:
                theme.typography.fontSize.xs * theme.typography.lineHeight.tight,
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
            },
          ]}
        >
          {currentTime}
        </Text>
      </View>
    );
  }, [theme, currentTime]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      {/* 헤더 (검색바) - Status Bar 없이 시작 */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + theme.spacing.md, // 16px (Status Bar 제거)
            paddingHorizontal: theme.spacing.lg, // 20px
            paddingBottom: theme.spacing.xs, // 8px
          },
        ]}
      >
        <View style={styles.headerContent}>
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
          >
            <Icon
              name="back"
              size={theme.dimensions.iconSize.md}
              color={theme.colors.surface.texticon.onnormal.icon.black}
            />
          </TouchableOpacity>

          {/* 검색바 (더 넓게) */}
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSubmit}
              placeholder="검색어를 입력해주세요."
              autoFocus
            />
          </View>
        </View>
      </View>

      {/* 콘텐츠 영역 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: theme.spacing.xxl, // 32px
            gap: theme.spacing.xl, // 24px - 섹션 간격
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 최근 검색어 섹션 (FlatList horizontal, 성능 최적화) */}
        {!isLoading && (
          <SearchSection
            title="최근 검색어"
            rightAction={renderClearButton}
            style={{ paddingHorizontal: 0, paddingTop: 20 }}
            accessibilityLabel="최근 검색어 섹션"
            testID="recent-searches-section"
          >
            {recentSearches.length > 0 ? (
              <RecentSearchList
                items={recentSearches}
                onPress={handleTagPress}
                onDelete={handleDeleteRecentSearch}
              />
            ) : (
              <EmptyRecentSearches />
            )}
          </SearchSection>
        )}

        {/* 추천 검색어 섹션 (flexWrap 자동 줄바꿈, Figma 디자인) */}
        {!isLoading && recommendedSearches.length > 0 && (
          <SearchSection
            title="추천 검색어"
            style={{ paddingHorizontal: 0, paddingTop: 20 }}
            accessibilityLabel="추천 검색어 섹션"
            testID="recommended-searches-section"
          >
            <RecommendedSearchGrid
              items={recommendedSearches}
              onPress={handleTagPress}
              maxLines={4}
            />
          </SearchSection>
        )}

        {/* 인기 검색어 섹션 (2열 그리드) */}
        {!isLoading && popularSearches.length > 0 && (
          <SearchSection
            title="" // 제목은 커스텀 헤더에 포함
            rightAction={renderPopularSearchHeader}
            hideHeader={true} // 기본 헤더 숨김
            style={{ paddingHorizontal: 0, paddingTop: 20 }}
            accessibilityLabel="인기 검색어 섹션"
            testID="popular-searches-section"
          >
            {/* 커스텀 헤더 */}
            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              {renderPopularSearchHeader}
            </View>
            {/* 그리드 */}
            <PopularSearchGrid
              items={popularSearches}
              onPress={handlePopularSearchPress}
            />
          </SearchSection>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // 동적 패딩 설정
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Figma 기준    
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1, // 남은 공간 모두 차지 (더 넓은 검색바)    
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    // paddingBottom, gap은 동적 설정
  },
  clearButtonText: {
    // 동적 스타일 설정
  },
  popularSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 제목과 시간 사이 간격 (Figma 기준)    
  },
  sectionTitle: {
    // 동적 스타일 설정
  },
  timestamp: {
    // 동적 스타일 설정
  },
});

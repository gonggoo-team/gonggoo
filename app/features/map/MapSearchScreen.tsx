/**
 * Map Search Screen
 *
 * 지도 화면 전용 검색 화면입니다.
 * MapScreen의 검색창을 누르면 표시되는 간단한 검색 화면입니다.
 *
 * 주요 기능:
 * - GNB (뒤로가기 + 검색창)
 * - 최근 검색어 목록 + 전체 삭제
 * - 검색 실행 시 MapScreen으로 돌아가서 검색어 필터링
 *
 * UX 패턴: 당근마켓, 배민 등의 지도 검색과 유사
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchService } from '@/app/shared/services/searchService';
import type { RecentSearch } from '@/app/shared/types/search';

import {
  Icon,
  SearchBar,
  useTheme,
} from '@/design-system';

import {
  EmptyRecentSearches,
  RecentSearchList,
} from '../search/components';

/**
 * MapSearchScreen Component
 */
export default function MapSearchScreen() {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();
  const insets = useSafeAreaInsets();

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const loadRecentSearches = async () => {
      setIsLoading(true);
      try {
        const recent = await SearchService.getRecentSearches();
        setRecentSearches(recent);
      } catch (error) {
        console.error('[MapSearchScreen] 최근 검색어 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentSearches();
  }, []);

  /**
   * 검색 실행
   * - 최근 검색어에 추가
   * - MapScreen으로 돌아가면서 검색어 전달
   */
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    // 최근 검색어에 추가
    await SearchService.addRecentSearch(query);

    // MapScreen으로 돌아가면서 검색어 전달
    push(`/(tabs)/map?searchQuery=${encodeURIComponent(query)}`);
  }, [push]);

  /**
   * 검색어 제출
   */
  const handleSubmit = useCallback(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  /**
   * 최근 검색어 클릭 (즉시 검색 실행)
   */
  const handleRecentSearchPress = useCallback((keyword: string) => {
    handleSearch(keyword);
  }, [handleSearch]);

  /**
   * 최근 검색어 삭제
   */
  const handleDeleteRecentSearch = useCallback(async (text: string) => {
    const target = recentSearches.find((item) => item.keyword === text);
    if (target) {
      await SearchService.removeRecentSearch(target.id);
      setRecentSearches((prev) => prev.filter((item) => item.id !== target.id));
    }
  }, [recentSearches]);

  /**
   * 최근 검색어 전체 삭제
   */
  const handleClearRecentSearches = useCallback(async () => {
    await SearchService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  /**
   * 뒤로가기
   */
  const handleGoBack = useCallback(() => {
    back();
  }, [back]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      {/* GNB (검색바) */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + theme.spacing.md, // 16px
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

          {/* 검색바 */}
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSubmit}
              placeholder="검색어를 입력해주세요."
              variant="map"
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
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 최근 검색어 섹션 */}
        {!isLoading && (
          <View style={styles.section}>
            {/* 섹션 헤더 */}
            <View
              style={[
                styles.sectionHeader,
                {
                  paddingHorizontal: theme.spacing.lg, // 20px
                  paddingTop: theme.spacing.lg, // 20px
                  paddingBottom: theme.spacing.sm, // 12px
                },
              ]}
            >
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
                최근 검색
              </Text>

              {/* 전체 삭제 버튼 */}
              {recentSearches.length > 0 && (
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
              )}
            </View>

            {/* 최근 검색어 리스트 */}
            {recentSearches.length > 0 ? (
              <RecentSearchList
                items={recentSearches}
                onPress={handleRecentSearchPress}
                onDelete={handleDeleteRecentSearch}
              />
            ) : (
              <EmptyRecentSearches />
            )}
          </View>
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
    gap: 10,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    // paddingBottom은 동적 설정
  },
  section: {
    // 섹션 컨테이너
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // 동적 패딩 설정
  },
  sectionTitle: {
    // 동적 스타일 설정
  },
  clearButtonText: {
    // 동적 스타일 설정
  },
});

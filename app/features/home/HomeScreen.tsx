/**
 * Home Screen
 *
 * 홈 탭 화면입니다.
 * - CategoryTabBar를 통해 카테고리 전환 (State 기반)
 * - GNB는 모든 카테고리에서 동일 (주소, 검색, 장바구니, 알림)
 * - 하단 탭바는 고정
 * - 모든 네비게이션 핸들러는 useThrottledNavigation으로 쓰로틀링 적용 (300ms)
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6474&m=dev
 * 마지막 동기화: 2025-10-10
 */

import React, { useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { useThrottledNavigation } from '@/app/shared/hooks';

import { CategoryTabBar, FloatingActionButton, GNB, useTheme } from '@/design-system';
import type { CategoryType } from '@/design-system/components/CategoryTabBar';

import {
  HomeContent,
  NeighborhoodContent,
  PopularContent,
  RecommendContent,
  TodayContent,
} from './contents';

/**
 * HomeScreen Component
 */
export default function HomeScreen() {
  const { theme } = useTheme();
  const { push } = useThrottledNavigation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('home');

  // 각 탭별 FlatList ref
  const scrollRefs = useRef<{ [key in CategoryType]?: FlatList | null }>({});

  // ref 할당 헬퍼 함수 (타입 에러 해결)
  const setScrollRef = (category: CategoryType) => (ref: FlatList | null) => {
    scrollRefs.current[category] = ref;
  };

  // 카테고리 전환 핸들러 (State 기반, 네비게이션 없음)
  const handleCategoryChange = (category: CategoryType) => {
    // 이미 선택된 탭을 다시 클릭한 경우 최상단으로 스크롤
    if (selectedCategory === category) {
      const scrollRef = scrollRefs.current[category];
      if (scrollRef) {
        scrollRef.scrollToOffset({ offset: 0, animated: true });
      }
    } else {
      setSelectedCategory(category);
      console.log('Category changed to:', category);
    }
  };

  // 홈 콘텐츠에서 카테고리로 이동
  const handleNavigateToCategory = (category: string) => {
    setSelectedCategory(category as CategoryType);
  };

  // 상품 등록 버튼 핸들러
  const handleProductRegistration = () => {
    push('/product-registration');
  };

  // GNB 핸들러들 (모두 쓰로틀링 적용)
  const handleSearchPress = () => {
    push('/search');
  };

  const handleCartPress = () => {
    console.log('[HomeScreen] Cart pressed');
    // TODO: 장바구니 화면으로 이동
  };

  const handleNotificationPress = () => {
    console.log('[HomeScreen] Notification pressed');
    // TODO: 알림 화면으로 이동
  };

  const handleAddressPress = () => {
    Alert.alert('준비중', '동네 설정 기능은 준비 중입니다');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      {/* GNB */}
      <GNB
        leftSection={{ type: 'address', text: '논현동', onPress: handleAddressPress }}
        rightIcons={[
          { type: 'search', onPress: handleSearchPress },
          {
            type: 'cart',
            badge: { count: 3 },
            onPress: handleCartPress,
          },
          {
            type: 'notification',
            badge: { dot: true },
            onPress: handleNotificationPress,
          },
        ]}
      />

      {/* CategoryTabBar */}
      <CategoryTabBar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

      {/* 콘텐츠 영역 - 조건부 렌더링으로 성능 최적화 */}
      {selectedCategory === 'home' && <HomeContent onNavigateToCategory={handleNavigateToCategory} />}
      {selectedCategory === 'neighborhood' && <NeighborhoodContent ref={setScrollRef('neighborhood')} />}
      {selectedCategory === 'today' && <TodayContent ref={setScrollRef('today')} />}
      {selectedCategory === 'popular' && <PopularContent ref={setScrollRef('popular')} />}
      {selectedCategory === 'recommend' && <RecommendContent />}
      {selectedCategory === 'share' && (
        <View style={styles.placeholder}>
          {/* TODO: ShareContent 구현 */}
        </View>
      )}
      {selectedCategory === 'event' && (
        <View style={styles.placeholder}>
          {/* TODO: EventContent 구현 */}
        </View>
      )}

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton
        onPress={handleProductRegistration}
        icon="plus"
        accessibilityLabel="상품 등록"
        bottom={25}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

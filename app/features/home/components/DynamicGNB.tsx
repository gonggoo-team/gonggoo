/**
 * DynamicGNB Component
 *
 * 카테고리별로 동적으로 변경되는 GNB 컴포넌트입니다.
 * - 홈: 로고 + 검색/장바구니/알림
 * - 동네/오늘마감/인기/추천: 타이틀 + 검색/장바구니/알림
 * - 뒤로가기 버튼 없음 (모두 홈 화면 내부이므로)
 *
 * 개선 사항:
 * - 중복 네비게이션 방지: useThrottledNavigation (300ms)
 */

import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { GNB } from '@/design-system';
import type { CategoryType } from '@/design-system/components/CategoryTabBar';

interface DynamicGNBProps {
  selectedCategory: CategoryType;
}

// 카테고리별 타이틀 매핑
const CATEGORY_TITLES: Record<CategoryType, string> = {
  home: '로고',
  neighborhood: '우리 동네에서 모집 중!',
  today: '오늘 마감!',
  popular: '가장 인기 있는!',
  recommend: '00님을 위한 추천',
  share: '나눔',
  event: '이벤트',
};

export const DynamicGNB: React.FC<DynamicGNBProps> = ({ selectedCategory }) => {
  const router = useRouter();
  const { push } = useThrottledNavigation();

  // 검색 아이콘 클릭 핸들러 (중복 네비게이션 방지)
  const handleSearchPress = () => {
    push('/search');
  };

  // 장바구니 아이콘 클릭 핸들러
  const handleCartPress = () => {
    console.log('[DynamicGNB] Cart pressed');
    // TODO: 장바구니 화면으로 이동
  };

  // 알림 아이콘 클릭 핸들러
  const handleNotificationPress = () => {
    console.log('[DynamicGNB] Notification pressed');
    // TODO: 알림 화면으로 이동
  };

  // 주소 클릭 핸들러
  const handleAddressPress = () => {
    Alert.alert('준비중', '동네 설정 기능은 준비 중입니다');
  };

  // 홈 화면인 경우 주소 표시
  if (selectedCategory === 'home') {
    return (
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
    );
  }

  // 카테고리 화면인 경우 (동네/오늘마감/인기/추천): 주소 표시
  return (
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
  );
};

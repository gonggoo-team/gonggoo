/**
 * Tabs Layout
 *
 * Expo Router의 Tabs를 사용한 하단 탭 네비게이션입니다.
 * - 5개 탭: 홈, 카테고리, 지도, 채팅, 프로필
 * - Figma 디자인 정확히 일치: 60px 컨텐츠 영역 + 24px 하단 패딩 = 84px
 * - TabBarIcon: flex: 1 완전 균등 분배 (minWidth/maxWidth 제거)
 * - 채팅, 프로필 탭: 인증 필요 (Alert 방식)
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=249-1477&m=dev
 */

import React from 'react';
import { Alert } from 'react-native';
import { Tabs, useRouter } from 'expo-router';

import { useAuth, useChat } from '@/app/shared/contexts';
import { TabBarIcon, useTheme } from '@/design-system';

/**
 * TabsLayout Component
 */
export default function TabsLayout() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { totalUnreadCount } = useChat();
  const router = useRouter();

  // 인증이 필요한 탭 클릭 핸들러
  const handleProtectedTabPress = (e: any) => {
    if (!isAuthenticated) {
      e.preventDefault();
      Alert.alert(
        '로그인이 필요한 기능이에요',
        '로그인하고 모든 기능을 이용해보세요!',
        [
          {
            text: '둘러보기 계속하기',
            style: 'cancel',
          },
          {
            text: '회원가입',
            onPress: () => router.push('/signup'),
          },
          {
            text: '로그인',
            onPress: () => router.push('/login'),
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.normal.bg1,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.lowEmp,
          height: 84,
          paddingBottom: 24,
        },
        tabBarActiveTintColor: theme.colors.surface.texticon.onnormal.text.green,
        tabBarInactiveTintColor: theme.colors.surface.texticon.onnormal.icon.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {/* 홈 탭 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} label="홈" />,
        }}
      />

      {/* 카테고리 탭 */}
      <Tabs.Screen
        name="category"
        options={{
          title: '카테고리',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="category" focused={focused} label="카테고리" />
          ),
        }}
      />

      {/* 지도 탭 */}
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
          tabBarIcon: ({ focused }) => <TabBarIcon name="map" focused={focused} label="지도" />,
        }}
      />

      {/* 채팅 탭 (인증 필요) */}
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="chat" focused={focused} label="채팅" badgeCount={totalUnreadCount} />
          ),
        }}
        listeners={{
          tabPress: handleProtectedTabPress,
        }}
      />

      {/* 프로필 탭 (인증 필요) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="profile" focused={focused} label="프로필" />
          ),
        }}
        listeners={{
          tabPress: handleProtectedTabPress,
        }}
      />
    </Tabs>
  );
}

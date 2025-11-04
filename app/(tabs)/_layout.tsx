/**
 * Tabs Layout
 *
 * Expo Router의 Tabs를 사용한 하단 탭 네비게이션입니다.
 * - 5개 탭: 홈, 카테고리, 지도, 채팅, 프로필
 * - Figma 디자인 정확히 일치: 60px 컨텐츠 영역 + 24px 하단 패딩 = 84px
 * - TabBarIcon: flex: 1 완전 균등 분배 (minWidth/maxWidth 제거)
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=249-1477&m=dev
 */

import { TabBarIcon, useTheme } from '@/design-system';
import { Tabs } from 'expo-router';
import React from 'react';

/**
 * TabsLayout Component
 */
export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.lowEmp, // #E1E1E1
          height: 84, // Figma 기준 전체 높이 (60px 컨텐츠 + 24px 패딩)
          paddingBottom: 24, // 홈 인디케이터 영역 (Figma 기준)
        },
        tabBarActiveTintColor: theme.colors.surface.texticon.onnormal.text.green, // #006242
        tabBarInactiveTintColor: theme.colors.surface.texticon.onnormal.icon.tabBar, // #9C9DA4
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

      {/* 채팅 탭 */}
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ focused }) => <TabBarIcon name="chat" focused={focused} label="채팅" />,
        }}
      />

      {/* 프로필 탭 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="profile" focused={focused} label="프로필" />
          ),
        }}
      />
    </Tabs>
  );
}

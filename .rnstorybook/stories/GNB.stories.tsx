/**
 * GNB Storybook
 *
 * 동적 3섹션 시스템으로 재구성된 GNB 컴포넌트입니다.
 * 모든 화면 패턴을 테스트할 수 있습니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GNB } from '../../design-system/components/GNB';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof GNB> = {
  title: 'Design System/Components/GNB',
  component: GNB,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.container}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GNB>;

// ===== 홈 화면 패턴 =====

export const HomeScreen: Story = {
  name: '홈 화면 (기본)',
  args: {
    leftSection: { type: 'logo-text', text: '공구팟' },
    rightIcons: [
      { type: 'search', onPress: () => console.log('Search') },
      { type: 'cart', badge: { count: 3 }, onPress: () => console.log('Cart') },
      { type: 'notification', badge: { dot: true }, onPress: () => console.log('Notification') },
    ],
  },
};

export const HomeWithManyCartItems: Story = {
  name: '홈 화면 (장바구니 많음)',
  args: {
    leftSection: { type: 'logo-text', text: '공구팟' },
    rightIcons: [
      { type: 'search', onPress: () => console.log('Search') },
      { type: 'cart', badge: { count: 150 }, onPress: () => console.log('Cart') },
      { type: 'notification', onPress: () => console.log('Notification') },
    ],
  },
};

// ===== 상세 페이지 패턴 =====

export const DetailPage: Story = {
  name: '상세 페이지',
  args: {
    leftSection: { type: 'back', onPress: () => console.log('Back') },
    centerSection: { type: 'title', text: '상품 상세' },
    rightIcons: [
      { type: 'share', onPress: () => console.log('Share') },
      { type: 'cart', badge: { count: 3 }, onPress: () => console.log('Cart') },
    ],
  },
};

export const DetailPageLongTitle: Story = {
  name: '상세 페이지 (긴 제목)',
  args: {
    leftSection: { type: 'back', onPress: () => console.log('Back') },
    centerSection: { type: 'title', text: '아주 긴 상품명이 들어가는 상세 페이지 타이틀입니다' },
    rightIcons: [
      { type: 'share', onPress: () => console.log('Share') },
    ],
  },
};

// ===== 검색 페이지 패턴 =====

export const SearchPage: Story = {
  name: '검색 페이지',
  render: () => {
    const [searchText, setSearchText] = useState('');
    return (
      <ThemeProvider>
        <GNB
          leftSection={{ type: 'back', onPress: () => console.log('Back') }}
          centerSection={{
            type: 'search-bar',
            value: searchText,
            onChangeText: setSearchText,
            placeholder: '검색어를 입력하세요',
          }}
        />
      </ThemeProvider>
    );
  },
};

// ===== 필터 화면 패턴 =====

export const FilterScreen: Story = {
  name: '필터 화면',
  args: {
    leftSection: { type: 'close', onPress: () => console.log('Close') },
    centerSection: { type: 'title', text: '필터' },
    rightIcons: [
      { type: 'x', onPress: () => console.log('Reset'), accessibilityLabel: '초기화' },
    ],
  },
};

// ===== 설정 화면 패턴 =====

export const SettingsScreen: Story = {
  name: '설정 화면',
  args: {
    leftSection: { type: 'back', onPress: () => console.log('Back') },
    centerSection: { type: 'title', text: '설정' },
  },
};

// ===== 중앙 로고 패턴 =====

export const CenterLogo: Story = {
  name: '중앙 로고',
  args: {
    leftSection: { type: 'menu', onPress: () => console.log('Menu') },
    centerSection: { type: 'logo-text', text: '공구팟' },
    rightIcons: [
      { type: 'notification', badge: { dot: true }, onPress: () => console.log('Notification') },
    ],
  },
};

// ===== 최소 구성 =====

export const Minimal: Story = {
  name: '최소 구성 (뒤로가기만)',
  args: {
    leftSection: { type: 'back', onPress: () => console.log('Back') },
  },
};

// ===== 최대 구성 =====

export const MaximalIcons: Story = {
  name: '최대 아이콘 구성',
  args: {
    leftSection: { type: 'logo-text', text: '공구팟' },
    rightIcons: [
      { type: 'search', onPress: () => {} },
      { type: 'cart', badge: { count: 5 }, onPress: () => {} },
      { type: 'notification', badge: { dot: true }, onPress: () => {} },
      { type: 'share', onPress: () => {} },
      { type: 'menu', onPress: () => {} },
    ],
  },
};

// ===== 다양한 배지 조합 =====

export const VariousBadges: Story = {
  name: '다양한 배지',
  args: {
    leftSection: { type: 'logo-text', text: '공구팟' },
    rightIcons: [
      { type: 'cart', badge: { count: 1 }, onPress: () => {} },
      { type: 'cart', badge: { count: 99 }, onPress: () => {} },
      { type: 'cart', badge: { count: 999 }, onPress: () => {} },
      { type: 'notification', badge: { dot: true }, onPress: () => {} },
    ],
  },
};

// ===== 접근성 테스트 =====

export const AccessibilityTest: Story = {
  name: '접근성 테스트',
  args: {
    leftSection: { type: 'back', onPress: () => console.log('Back') },
    centerSection: { type: 'title', text: '접근성 테스트' },
    rightIcons: [
      {
        type: 'share',
        onPress: () => console.log('Share'),
        accessibilityLabel: '공유하기',
      },
      {
        type: 'cart',
        badge: { count: 5 },
        onPress: () => console.log('Cart'),
        accessibilityLabel: '장바구니 (5개 상품)',
      },
    ],
  },
};

// ===== 다국어 테스트 =====

export const EnglishVersion: Story = {
  name: '영어 버전',
  args: {
    leftSection: { type: 'logo-text', text: 'GonggooPot' },
    rightIcons: [
      { type: 'search', onPress: () => {} },
      { type: 'cart', badge: { count: 3 }, onPress: () => {} },
    ],
  },
};

export const JapaneseVersion: Story = {
  name: '일본어 버전',
  args: {
    leftSection: { type: 'logo-text', text: '共同購入' },
    centerSection: { type: 'none' },
    rightIcons: [
      { type: 'search', onPress: () => {} },
      { type: 'notification', badge: { dot: true }, onPress: () => {} },
    ],
  },
};

// ===== Interactive Playground =====

export const Playground: Story = {
  name: 'Playground (자유 테스트)',
  args: {
    leftSection: { type: 'logo-text', text: '공구팟' },
    rightIcons: [
      { type: 'search', onPress: () => console.log('Search') },
      { type: 'cart', badge: { count: 5 }, onPress: () => console.log('Cart') },
      { type: 'notification', badge: { dot: true }, onPress: () => console.log('Notification') },
    ],
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

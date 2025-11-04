/**
 * TabBarIcon Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 TabBarIcon 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - HomeFocused (홈 탭 선택)
 * - HomeUnfocused (홈 탭 비선택)
 * - CategoryFocused (카테고리 탭 선택)
 * - MapFocused (지도 탭 선택)
 * - ChatFocused (채팅 탭 선택)
 * - ProfileFocused (프로필 탭 선택)
 * - AllTabs (모든 탭 미리보기)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { TabBarIcon } from '../../design-system/components/TabBar';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof TabBarIcon> = {
  title: 'Design System/Components/TabBarIcon',
  component: TabBarIcon,
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

type Story = StoryObj<typeof TabBarIcon>;

// ===== Home Focused (홈 탭 선택) =====

export const HomeFocused: Story = {
  args: {
    name: 'home',
    focused: true,
    label: '홈',
  },
};

// ===== Home Unfocused (홈 탭 비선택) =====

export const HomeUnfocused: Story = {
  args: {
    name: 'home',
    focused: false,
    label: '홈',
  },
};

// ===== Category Focused (카테고리 탭 선택) =====

export const CategoryFocused: Story = {
  args: {
    name: 'category',
    focused: true,
    label: '카테고리',
  },
};

// ===== Map Focused (지도 탭 선택) =====

export const MapFocused: Story = {
  args: {
    name: 'map',
    focused: true,
    label: '지도',
  },
};

// ===== Chat Focused (채팅 탭 선택) =====

export const ChatFocused: Story = {
  args: {
    name: 'chat',
    focused: true,
    label: '채팅',
  },
};

// ===== Profile Focused (프로필 탭 선택) =====

export const ProfileFocused: Story = {
  args: {
    name: 'profile',
    focused: true,
    label: '프로필',
  },
};

// ===== All Tabs (모든 탭 미리보기) =====

export const AllTabs: Story = {
  render: () => (
    <View style={styles.allTabsContainer}>
      <TabBarIcon name="home" focused={true} label="홈" />
      <TabBarIcon name="category" focused={false} label="카테고리" />
      <TabBarIcon name="map" focused={false} label="지도" />
      <TabBarIcon name="chat" focused={false} label="채팅" />
      <TabBarIcon name="profile" focused={false} label="프로필" />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  allTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E8EB',
    height: 84,
    width: '100%',
  },
});

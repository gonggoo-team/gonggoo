/**
 * CategoryTabBar Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 CategoryTabBar 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - HomeSelected (홈 선택)
 * - NeighborhoodSelected (동네 선택)
 * - TodaySelected (오늘 마감 선택)
 * - PopularSelected (인기 선택)
 * - RecommendSelected (추천 선택)
 * - ShareSelected (나눔 선택)
 * - EventSelected (이벤트 선택)
 * - Interactive (실제 상호작용 가능)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CategoryTabBar,
  type CategoryType,
} from '../../design-system/components/CategoryTabBar';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof CategoryTabBar> = {
  title: 'Design System/Components/CategoryTabBar',
  component: CategoryTabBar,
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

type Story = StoryObj<typeof CategoryTabBar>;

// ===== Home Selected (홈 선택) =====

export const HomeSelected: Story = {
  args: {
    selectedCategory: 'home',
    onCategoryChange: () => {},
  },
};

// ===== Neighborhood Selected (동네 선택) =====

export const NeighborhoodSelected: Story = {
  args: {
    selectedCategory: 'neighborhood',
    onCategoryChange: () => {},
  },
};

// ===== Today Selected (오늘 마감 선택) =====

export const TodaySelected: Story = {
  args: {
    selectedCategory: 'today',
    onCategoryChange: () => {},
  },
};

// ===== Popular Selected (인기 선택) =====

export const PopularSelected: Story = {
  args: {
    selectedCategory: 'popular',
    onCategoryChange: () => {},
  },
};

// ===== Recommend Selected (추천 선택) =====

export const RecommendSelected: Story = {
  args: {
    selectedCategory: 'recommend',
    onCategoryChange: () => {},
  },
};

// ===== Share Selected (나눔 선택) =====

export const ShareSelected: Story = {
  args: {
    selectedCategory: 'share',
    onCategoryChange: () => {},
  },
};

// ===== Event Selected (이벤트 선택) =====

export const EventSelected: Story = {
  args: {
    selectedCategory: 'event',
    onCategoryChange: () => {},
  },
};

// ===== Interactive (실제 상호작용 가능) =====

export const Interactive: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('home');

    return (
      <CategoryTabBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    );
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

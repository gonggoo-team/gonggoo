/**
 * FilterBottomSheet Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 FilterBottomSheet 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - GenderTabActive (성별 탭 활성)
 * - AgeTabActive (연령대 탭 활성)
 * - PeriodTabActive (기간 탭 활성)
 * - WithSelections (선택된 상태)
 * - Interactive (실제 상호작용 가능)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Alert, Button as RNButton, StyleSheet, View } from 'react-native';
import {
  FilterBottomSheet,
  type FilterType,
  type SelectedFilters,
} from '../../design-system/components/FilterBottomSheet';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof FilterBottomSheet> = {
  title: 'Design System/Components/FilterBottomSheet',
  component: FilterBottomSheet,
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

type Story = StoryObj<typeof FilterBottomSheet>;

// 기본 선택 값
const defaultSelectedFilters: SelectedFilters = {
  gender: '성별 전체',
  age: '연령대 전체',
  period: '실시간 랭킹',
};

// ===== Gender Tab Active (성별 탭 활성) =====

export const GenderTabActive: Story = {
  args: {
    isVisible: true,
    onClose: () => {},
    activeTab: 'gender',
    onTabChange: () => {},
    selectedFilters: defaultSelectedFilters,
    onSelectOption: () => {},
    onReset: () => {},
    onApply: () => {},
    resultCount: 42,
  },
};

// ===== Age Tab Active (연령대 탭 활성) =====

export const AgeTabActive: Story = {
  args: {
    isVisible: true,
    onClose: () => {},
    activeTab: 'age',
    onTabChange: () => {},
    selectedFilters: {
      gender: '성별 전체',
      age: '20대',
      period: '실시간 랭킹',
    },
    onSelectOption: () => {},
    onReset: () => {},
    onApply: () => {},
    resultCount: 128,
  },
};

// ===== Period Tab Active (기간 탭 활성) =====

export const PeriodTabActive: Story = {
  args: {
    isVisible: true,
    onClose: () => {},
    activeTab: 'period',
    onTabChange: () => {},
    selectedFilters: {
      gender: '성별 전체',
      age: '20대',
      period: '원데이 랭킹',
    },
    onSelectOption: () => {},
    onReset: () => {},
    onApply: () => {},
    resultCount: 56,
  },
};

// ===== With Selections (선택된 상태) =====

export const WithSelections: Story = {
  args: {
    isVisible: true,
    onClose: () => {},
    activeTab: 'gender',
    onTabChange: () => {},
    selectedFilters: {
      gender: '여성',
      age: '30대',
      period: '주간 랭킹',
    },
    onSelectOption: () => {},
    onReset: () => {},
    onApply: () => {},
    resultCount: 89,
  },
};

// ===== Interactive (실제 상호작용 가능) =====

export const Interactive: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<FilterType>('gender');
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
      gender: '성별 전체',
      age: '연령대 전체',
      period: '실시간 랭킹',
    });

    const handleSelectOption = (filterType: FilterType, option: string) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: option,
      }));
    };

    const handleReset = () => {
      setSelectedFilters({
        gender: '성별 전체',
        age: '연령대 전체',
        period: '실시간 랭킹',
      });
      Alert.alert('초기화', '필터가 초기화되었습니다.');
    };

    const handleApply = () => {
      setIsVisible(false);
      Alert.alert(
        '적용',
        `필터 적용:\n성별: ${selectedFilters.gender}\n연령대: ${selectedFilters.age}\n기간: ${selectedFilters.period}`
      );
    };

    return (
      <ThemeProvider>
        <View style={styles.interactiveContainer}>
          <RNButton title="필터 열기" onPress={() => setIsVisible(true)} />
          <FilterBottomSheet
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedFilters={selectedFilters}
            onSelectOption={handleSelectOption}
            onReset={handleReset}
            onApply={handleApply}
            resultCount={42}
          />
        </View>
      </ThemeProvider>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  interactiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

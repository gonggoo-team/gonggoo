/**
 * ProgressBar Storybook
 *
 * 모집 진행률을 표시하는 ProgressBar 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - Light variant (기본 - 검은색 텍스트)
 * - Dark variant (흰색 텍스트)
 * - 0%, 50%, 100% 케이스
 * - 라벨 숨김 케이스
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { ProgressBar } from '../../design-system/primitives/ProgressBar';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof ProgressBar> = {
  title: 'Design System/Primitives/ProgressBar',
  component: ProgressBar,
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

type Story = StoryObj<typeof ProgressBar>;

// ===== Light variant (기본) =====

export const LightVariant: Story = {
  args: {
    percentage: 66,
    variant: 'light',
    showLabel: true,
  },
};

// ===== Dark variant =====

export const DarkVariant: Story = {
  args: {
    percentage: 66,
    variant: 'dark',
    showLabel: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={[styles.container, { backgroundColor: '#181A1A' }]}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

// ===== 0% Progress =====

export const ZeroPercent: Story = {
  args: {
    percentage: 0,
    variant: 'light',
    showLabel: true,
  },
};

// ===== 50% Progress =====

export const FiftyPercent: Story = {
  args: {
    percentage: 50,
    variant: 'light',
    showLabel: true,
  },
};

// ===== 100% Progress =====

export const HundredPercent: Story = {
  args: {
    percentage: 100,
    variant: 'light',
    showLabel: true,
  },
};

// ===== Without Label =====

export const WithoutLabel: Story = {
  args: {
    percentage: 66,
    variant: 'light',
    showLabel: false,
  },
};

// ===== All Progress Levels =====

export const AllProgressLevels: Story = {
  render: () => (
    <View style={styles.column}>
      <ProgressBar percentage={0} variant="light" />
      <ProgressBar percentage={25} variant="light" />
      <ProgressBar percentage={50} variant="light" />
      <ProgressBar percentage={75} variant="light" />
      <ProgressBar percentage={100} variant="light" />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  column: {
    gap: 16,
  },
});

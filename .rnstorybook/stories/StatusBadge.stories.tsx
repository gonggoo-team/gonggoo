/**
 * StatusBadge Storybook
 *
 * 상품 상태를 표시하는 StatusBadge 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - Deadline (오늘 마감)
 * - Recruiting (모집중)
 * - Remaining (남은자리)
 * - Closed (마감)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { StatusBadge } from '../../design-system/primitives/StatusBadge';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof StatusBadge> = {
  title: 'Design System/Primitives/StatusBadge',
  component: StatusBadge,
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

type Story = StoryObj<typeof StatusBadge>;

// ===== Deadline (오늘 마감) =====

export const Deadline: Story = {
  args: {
    type: 'deadline',
    label: '오늘 마감',
  },
};

// ===== Recruiting (모집중) =====

export const Recruiting: Story = {
  args: {
    type: 'recruiting',
    label: '3명 모집',
  },
};

// ===== Remaining (남은자리) =====

export const Remaining: Story = {
  args: {
    type: 'remaining',
    label: '3일 남음',
  },
};

// ===== Closed (마감) =====

export const Closed: Story = {
  args: {
    type: 'closed',
    label: '모집 마감',
  },
};

// ===== All Variants (모든 variant 한번에 보기) =====

export const AllVariants: Story = {
  render: () => (
    <View style={styles.row}>
      <StatusBadge type="deadline" label="오늘 마감" />
      <StatusBadge type="recruiting" label="3명 모집" />
      <StatusBadge type="remaining" label="3일 남음" />
      <StatusBadge type="closed" label="모집 마감" />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

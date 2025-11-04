/**
 * RankingIndicator Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 RankingIndicator 컴포넌트입니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, Text, View } from 'react-native';
import { RankingIndicator } from '../../design-system/primitives/RankingIndicator';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof RankingIndicator> = {
  title: 'Design System/Components/RankingIndicator',
  component: RankingIndicator,
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

type Story = StoryObj<typeof RankingIndicator>;

// ===== Ranking Up =====

export const RankingUp: Story = {
  args: {
    variant: 'up',
  },
};

// ===== Ranking Down =====

export const RankingDown: Story = {
  args: {
    variant: 'down',
  },
};

// ===== Ranking Maintain =====

export const RankingMaintain: Story = {
  args: {
    variant: 'maintain',
  },
};

// ===== With Label Example =====

export const WithLabel: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.labelContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.rank}>1</Text>
          <Text style={styles.label}>동원참치 캔 20ea</Text>
          <RankingIndicator variant="down" />
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.rank}>2</Text>
          <Text style={styles.label}>신라면 멀티팩</Text>
          <RankingIndicator variant="up" />
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.rank}>3</Text>
          <Text style={styles.label}>풀무원 두부</Text>
          <RankingIndicator variant="maintain" />
        </View>
      </View>
    </ThemeProvider>
  ),
};

// ===== Showcase =====

export const AllVariants: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>순위 상승 (빨강)</Text>
          <RankingIndicator variant="up" />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>순위 하락 (파랑)</Text>
          <RankingIndicator variant="down" />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>순위 유지 (회색)</Text>
          <RankingIndicator variant="maintain" />
        </View>
      </View>
    </ThemeProvider>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  labelContainer: {
    gap: 12,
    padding: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rank: {
    fontSize: 13,
    fontWeight: '500',
    color: '#181A1A',
    width: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#181A1A',
    flex: 1,
  },
  showcase: {
    gap: 24,
    padding: 16,
    alignItems: 'center',
  },
  section: {
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#181A1A',
  },
});

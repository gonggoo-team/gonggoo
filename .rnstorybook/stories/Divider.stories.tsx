/**
 * Divider Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 Divider 컴포넌트입니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { Divider } from '../../design-system/primitives/Divider';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof Divider> = {
  title: 'Design System/Components/Divider',
  component: Divider,
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

type Story = StoryObj<typeof Divider>;

// ===== Horizontal Dividers =====

export const HorizontalLowEmp: Story = {
  args: {
    orientation: 'horizontal',
    color: 'lowEmp',
  },
};

export const HorizontalMidEmp: Story = {
  args: {
    orientation: 'horizontal',
    color: 'midEmp',
  },
};

export const HorizontalHighEmp: Story = {
  args: {
    orientation: 'horizontal',
    color: 'highEmp',
  },
};

// ===== Vertical Dividers =====

export const VerticalLowEmp: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.verticalContainer}>
        <Divider orientation="vertical" color="lowEmp" />
      </View>
    </ThemeProvider>
  ),
};

export const VerticalMidEmp: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.verticalContainer}>
        <Divider orientation="vertical" color="midEmp" />
      </View>
    </ThemeProvider>
  ),
};

export const VerticalHighEmp: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.verticalContainer}>
        <Divider orientation="vertical" color="highEmp" />
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
          <Divider orientation="horizontal" color="lowEmp" />
        </View>
        <View style={styles.section}>
          <Divider orientation="horizontal" color="midEmp" />
        </View>
        <View style={styles.section}>
          <Divider orientation="horizontal" color="highEmp" />
        </View>
        <View style={styles.verticalShowcase}>
          <Divider orientation="vertical" color="lowEmp" />
          <Divider orientation="vertical" color="midEmp" />
          <Divider orientation="vertical" color="highEmp" />
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
  verticalContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  showcase: {
    width: '100%',
    gap: 24,
    padding: 16,
  },
  section: {
    width: '100%',
  },
  verticalShowcase: {
    flexDirection: 'row',
    height: 100,
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

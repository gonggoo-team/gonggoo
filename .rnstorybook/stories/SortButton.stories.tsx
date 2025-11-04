/**
 * SortButton Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 SortButton 컴포넌트입니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SortButton } from '../../design-system/primitives/SortButton';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof SortButton> = {
  title: 'Design System/Components/SortButton',
  component: SortButton,
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

type Story = StoryObj<typeof SortButton>;

// ===== Closed State =====

export const Closed: Story = {
  render: () => (
    <ThemeProvider>
      <SortButton
        label="추천순"
        isOpen={false}
        onPress={() => console.log('Pressed')}
      />
    </ThemeProvider>
  ),
};

// ===== Open State =====

export const Open: Story = {
  render: () => (
    <ThemeProvider>
      <SortButton
        label="추천순"
        isOpen={true}
        onPress={() => console.log('Pressed')}
      />
    </ThemeProvider>
  ),
};

// ===== Interactive =====

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <ThemeProvider>
        <SortButton
          label="추천순"
          isOpen={isOpen}
          onPress={() => setIsOpen(!isOpen)}
        />
      </ThemeProvider>
    );
  },
};

// ===== Different Labels =====

export const DifferentLabels: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <SortButton label="추천순" isOpen={false} onPress={() => {}} />
        <SortButton label="최신순" isOpen={false} onPress={() => {}} />
        <SortButton label="인기순" isOpen={false} onPress={() => {}} />
        <SortButton label="할인율 높은 순" isOpen={false} onPress={() => {}} />
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
  showcase: {
    gap: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
});

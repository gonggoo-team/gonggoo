/**
 * DropdownMenu Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 DropdownMenu 컴포넌트입니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { DropdownMenu } from '../../design-system/primitives/DropdownMenu';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Design System/Components/DropdownMenu',
  component: DropdownMenu,
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

type Story = StoryObj<typeof DropdownMenu>;

// ===== Sort Options =====

export const SortOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState('최신순');

    return (
      <ThemeProvider>
        <DropdownMenu
          options={['최신순', '오래된 순', '인기순', '할인율 높은 순']}
          selectedOption={selected}
          onSelect={(value) => {
            setSelected(value);
            Alert.alert('선택', value);
          }}
        />
      </ThemeProvider>
    );
  },
};

// ===== Simple Options =====

export const SimpleOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState('옵션 1');

    return (
      <ThemeProvider>
        <DropdownMenu
          options={['옵션 1', '옵션 2', '옵션 3']}
          selectedOption={selected}
          onSelect={(value) => {
            setSelected(value);
            Alert.alert('선택', value);
          }}
        />
      </ThemeProvider>
    );
  },
};

// ===== With Object Options =====

export const ObjectOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState('latest');

    const options = [
      { label: '최신순', value: 'latest' },
      { label: '오래된 순', value: 'oldest' },
      { label: '인기순', value: 'popular' },
      { label: '할인율 높은 순', value: 'discount' },
    ];

    return (
      <ThemeProvider>
        <DropdownMenu
          options={options}
          selectedOption={selected}
          onSelect={(value) => {
            setSelected(value);
            Alert.alert('선택', value);
          }}
        />
      </ThemeProvider>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',   
  },
});

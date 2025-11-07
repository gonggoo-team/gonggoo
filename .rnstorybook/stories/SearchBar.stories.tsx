/**
 * SearchBar Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 SearchBar 컴포넌트입니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../design-system/primitives/SearchBar';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof SearchBar> = {
  title: 'Design System/Components/SearchBar',
  component: SearchBar,
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

type Story = StoryObj<typeof SearchBar>;

// ===== Default State =====

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <ThemeProvider>
        <View style={styles.fullWidth}>
          <SearchBar
            value={value}
            onChangeText={setValue}
            onSearch={(text) => Alert.alert('검색', text)}
          />
        </View>
      </ThemeProvider>
    );
  },
};

// ===== With Text =====

export const WithText: Story = {
  render: () => {
    const [value, setValue] = useState('프로틴 바');
    return (
      <ThemeProvider>
        <View style={styles.fullWidth}>
          <SearchBar
            value={value}
            onChangeText={setValue}
            onSearch={(text) => Alert.alert('검색', text)}
          />
        </View>
      </ThemeProvider>
    );
  },
};

// ===== Interactive =====

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);

    return (
      <ThemeProvider>
        <View style={styles.showcase}>
          <SearchBar
            value={value}
            onChangeText={setValue}
            onSearch={(text) => Alert.alert('검색', text)}
            onFocusChange={setFocused}
          />
        </View>
      </ThemeProvider>
    );
  },
};

// ===== Showcase =====

export const AllStates: Story = {
  render: () => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('프로틴 바');

    return (
      <ThemeProvider>
        <View style={styles.showcase}>
          <SearchBar
            value={value1}
            onChangeText={setValue1}
            onSearch={(text) => Alert.alert('검색', text)}
          />
          <SearchBar
            value={value2}
            onChangeText={setValue2}
            onSearch={(text) => Alert.alert('검색', text)}
          />
        </View>
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
  fullWidth: {
    width: '100%',
    maxWidth: 375,
    alignItems: 'center',
  },
  showcase: {
    width: '100%',
    maxWidth: 375,
    gap: 16,
    padding: 16,
    alignItems: 'center',
  },
});

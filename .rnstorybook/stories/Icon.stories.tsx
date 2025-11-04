/**
 * Icon Storybook
 *
 * Figma 디자인 시스템의 모든 아이콘을 표시합니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { IconName } from '../../design-system/primitives/Icon';
import { Icon } from '../../design-system/primitives/Icon';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Components/Icon',
  component: Icon,
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

type Story = StoryObj<typeof Icon>;

// ===== Individual Icons =====

export const Search: Story = {
  args: {
    name: 'search',
    size: 24,
  },
};

export const TextDelete: Story = {
  args: {
    name: 'text-delete',
    size: 24,
  },
};

export const Drop: Story = {
  args: {
    name: 'drop',
    size: 16,
  },
};

export const ArrowUp: Story = {
  args: {
    name: 'arrow-up',
    size: 10,
  },
};

export const ArrowDown: Story = {
  args: {
    name: 'arrow-down',
    size: 10,
  },
};

export const RankingMaintain: Story = {
  args: {
    name: 'ranking-maintain',
    size: 10,
  },
};

// ===== Size Variants =====

export const Sizes: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <View style={styles.row}>
          <Icon name="search" size={10} />
          <Text style={styles.label}>10px</Text>
        </View>
        <View style={styles.row}>
          <Icon name="search" size={16} />
          <Text style={styles.label}>16px</Text>
        </View>
        <View style={styles.row}>
          <Icon name="search" size={24} />
          <Text style={styles.label}>24px (기본)</Text>
        </View>
        <View style={styles.row}>
          <Icon name="search" size={32} />
          <Text style={styles.label}>32px</Text>
        </View>
      </View>
    </ThemeProvider>
  ),
};

// ===== Color Variants =====

export const Colors: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <View style={styles.row}>
          <Icon name="search" size={24} color="#000000" />
          <Text style={styles.label}>Black</Text>
        </View>
        <View style={styles.row}>
          <Icon name="search" size={24} color="#006242" />
          <Text style={styles.label}>Green (Brand)</Text>
        </View>
        <View style={styles.row}>
          <Icon name="search" size={24} color="#F7514D" />
          <Text style={styles.label}>Red (Accent)</Text>
        </View>
        <View style={styles.row}>
          <Icon name="search" size={24} color="#1D8BFF" />
          <Text style={styles.label}>Blue</Text>
        </View>
      </View>
    </ThemeProvider>
  ),
};

// ===== All Icons Gallery =====

const allIcons: IconName[] = [
  'search',
  'text-delete',
  'drop',
  'arrow-up',
  'arrow-down',
  'ranking-maintain',
  'back',
  'back-mini',
  'plus',
  'hamburger',
  'x',
  'small-x',
  'check',
  'filter',
  'question',
  'cart',
  'share',
  'refresh',
  'profile-line',
  'profile-fill',
  'home-line',
  'home-fill',
  'chat-line',
  'chat-fill',
  'map-pin-line',
  'map-pin-fill',
  'bell-on',
  'bell-off',
  'heart-line',
  'heart-fill',
  'alarm-fill',
  'check-box-fill',
  'check-box-empty',
];

export const AllIcons: Story = {
  render: () => (
    <ThemeProvider>
      <ScrollView contentContainerStyle={styles.gallery}>
        {allIcons.map((iconName) => (
          <View key={iconName} style={styles.iconItem}>
            <Icon name={iconName} size={24} />
            <Text style={styles.iconLabel}>{iconName}</Text>
          </View>
        ))}
      </ScrollView>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#181A1A',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  iconItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    gap: 8,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#181A1A',
    textAlign: 'center',
  },
});

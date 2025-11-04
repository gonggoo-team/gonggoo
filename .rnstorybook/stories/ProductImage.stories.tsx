/**
 * ProductImage Storybook
 *
 * 상품 이미지를 표시하는 ProductImage 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - Default (border 없음)
 * - With Border (흰색 이미지 케이스)
 * - Square (1:1 비율)
 * - Landscape (16:9 비율)
 * - Portrait (3:4 비율)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { ProductImage } from '../../design-system/primitives/ProductImage';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof ProductImage> = {
  title: 'Design System/Primitives/ProductImage',
  component: ProductImage,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            <Story />
          </View>
        </View>
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProductImage>;

// ===== Default (Border 없음) =====

export const Default: Story = {
  args: {
    uri: 'https://picsum.photos/300/300',
    aspectRatio: 1,
    showBorder: false,
  },
};

// ===== With Border (흰색 이미지 케이스) =====

export const WithBorder: Story = {
  args: {
    uri: 'https://picsum.photos/300/300',
    aspectRatio: 1,
    showBorder: true,
  },
};

// ===== Square (1:1) =====

export const Square: Story = {
  args: {
    uri: 'https://picsum.photos/400/400',
    aspectRatio: 1,
    showBorder: false,
  },
};

// ===== Landscape (16:9) =====

export const Landscape: Story = {
  args: {
    uri: 'https://picsum.photos/1600/900',
    aspectRatio: 16 / 9,
    showBorder: false,
  },
};

// ===== Portrait (3:4) =====

export const Portrait: Story = {
  args: {
    uri: 'https://picsum.photos/600/800',
    aspectRatio: 3 / 4,
    showBorder: false,
  },
};

// ===== Different Aspect Ratios =====

export const DifferentAspectRatios: Story = {
  render: () => (
    <View style={styles.column}>
      <ProductImage uri="https://picsum.photos/300/300" aspectRatio={1} />
      <ProductImage uri="https://picsum.photos/1600/900" aspectRatio={16 / 9} />
      <ProductImage uri="https://picsum.photos/600/800" aspectRatio={3 / 4} />
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  imageWrapper: {
    width: 200,
  },
  column: {
    gap: 16,
    width: 200,
  },
});

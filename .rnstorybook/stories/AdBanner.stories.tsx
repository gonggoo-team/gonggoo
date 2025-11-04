/**
 * AdBanner Storybook
 *
 * 홈화면 광고 배너 컴포넌트입니다.
 *
 * 테스트 시나리오:
 * - Single Banner (배너 1개)
 * - Multiple Banners (배너 여러 개)
 * - With Auto-play (자동 슬라이드)
 * - Different Heights (다양한 높이)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { AdBanner } from '../../design-system/components/AdBanner';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof AdBanner> = {
  title: 'Design System/Components/AdBanner',
  component: AdBanner,
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

type Story = StoryObj<typeof AdBanner>;

const singleBannerData = [
  {
    id: '1',
    imageUri: 'https://picsum.photos/800/400',
  },
];

const multipleBannerData = [
  {
    id: '1',
    imageUri: 'https://picsum.photos/800/400',
  },
  {
    id: '2',
    imageUri: 'https://picsum.photos/801/401',
  },
  {
    id: '3',
    imageUri: 'https://picsum.photos/802/402',
  },
];

// ===== Single Banner =====

export const SingleBanner: Story = {
  args: {
    items: singleBannerData,
    autoPlay: false,
    height: 120,
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

// ===== Multiple Banners =====

export const MultipleBanners: Story = {
  args: {
    items: multipleBannerData,
    autoPlay: false,
    height: 120,
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

// ===== With Auto-play =====

export const WithAutoPlay: Story = {
  args: {
    items: multipleBannerData,
    autoPlay: true,
    autoPlayInterval: 3000,
    height: 120,
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

// ===== Small Height (82px) =====

export const SmallHeight: Story = {
  args: {
    items: multipleBannerData,
    autoPlay: false,
    height: 82,
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

// ===== Medium Height (120px) =====

export const MediumHeight: Story = {
  args: {
    items: multipleBannerData,
    autoPlay: false,
    height: 120,
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

// ===== Large Height (200px) =====

export const LargeHeight: Story = {
  args: {
    items: multipleBannerData,
    autoPlay: false,
    height: 200,
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

// ===== Square (화면 너비만큼) =====

export const Square: Story = {
  args: {
    items: multipleBannerData,
    autoPlay: true,
    autoPlayInterval: 5000,
    height: 335, // SCREEN_WIDTH - 40 (375 - 40)
    onBannerPress: (item) => console.log('Banner pressed:', item.id),
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

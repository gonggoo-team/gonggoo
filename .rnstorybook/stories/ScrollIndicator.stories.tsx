/**
 * ScrollIndicator Storybook
 *
 * 스크롤 페이지네이션 인디케이터 컴포넌트
 *
 * 테스트 시나리오:
 * - 기본 (3페이지, 첫 번째 페이지 활성화)
 * - 중간 페이지 활성화
 * - 많은 페이지 (5페이지)
 * - 1페이지 (인디케이터 숨김)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { ScrollIndicator } from '../../design-system/primitives/ScrollIndicator';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof ScrollIndicator> = {
  title: 'Design System/Primitives/ScrollIndicator',
  component: ScrollIndicator,
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

type Story = StoryObj<typeof ScrollIndicator>;

export const Default: Story = {
  args: {
    currentIndex: 0,
    totalPages: 3,
  },
};

export const SecondPage: Story = {
  args: {
    currentIndex: 1,
    totalPages: 3,
  },
};

export const LastPage: Story = {
  args: {
    currentIndex: 2,
    totalPages: 3,
  },
};

export const ManyPages: Story = {
  args: {
    currentIndex: 2,
    totalPages: 5,
  },
};

export const SinglePage: Story = {
  args: {
    currentIndex: 0,
    totalPages: 1,
  },
};

export const CustomColors: Story = {
  args: {
    currentIndex: 1,
    totalPages: 3,
    activeColor: '#FF0000',
    inactiveColor: '#CCCCCC',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

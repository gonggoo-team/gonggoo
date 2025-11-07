/**
 * CountdownTimer Storybook
 *
 * 카운트다운 타이머 컴포넌트
 *
 * 테스트 시나리오:
 * - 기본 (5시간 14분 35초 남음)
 * - 1시간 미만
 * - 1분 미만
 * - 이미 마감됨
 * - 커스텀 색상
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { CountdownTimer } from '../../design-system/primitives/CountdownTimer';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof CountdownTimer> = {
  title: 'Design System/Primitives/CountdownTimer',
  component: CountdownTimer,
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

type Story = StoryObj<typeof CountdownTimer>;

// 5시간 14분 35초 후
export const Default: Story = {
  args: {
    targetTime: new Date(Date.now() + 5 * 60 * 60 * 1000 + 14 * 60 * 1000 + 35 * 1000),
    onExpire: () => console.log('마감되었습니다!'),
  },
};

// 30분 후
export const LessThanOneHour: Story = {
  args: {
    targetTime: new Date(Date.now() + 30 * 60 * 1000),
    onExpire: () => console.log('마감되었습니다!'),
  },
};

// 45초 후
export const LessThanOneMinute: Story = {
  args: {
    targetTime: new Date(Date.now() + 45 * 1000),
    onExpire: () => console.log('마감되었습니다!'),
  },
};

// 이미 마감됨 (과거 시간)
export const Expired: Story = {
  args: {
    targetTime: new Date(Date.now() - 1000),
    onExpire: () => console.log('마감되었습니다!'),
  },
};

// 커스텀 색상
export const CustomColors: Story = {
  args: {
    targetTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    textColor: '#FF0000',
    iconColor: '#FF0000',
    onExpire: () => console.log('마감되었습니다!'),
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

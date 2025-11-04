/**
 * Design System Button Storybook (Figma 기반)
 *
 * Figma 디자인 시스템에 맞춰 재구성된 Button 컴포넌트입니다.
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from '../../design-system/primitives/Button';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof Button> = {
  title: 'Design System/Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={styles.container}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  args: {
    children: 'Button',
    onPress: () => Alert.alert('Button Pressed!'),
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// ===== Category Buttons (라운드 칩) =====

export const CategorySelected: Story = {
  args: {
    variant: 'category-selected',
    children: '식품',
  },
};

export const CategoryUnselected: Story = {
  args: {
    variant: 'category-unselected',
    children: '생활',
  },
};

export const CategoryShowcase: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.categoryRow}>
        <Button variant="category-selected" onPress={() => {}}>
          전체
        </Button>
        <Button variant="category-unselected" onPress={() => {}}>
          식품
        </Button>
        <Button variant="category-unselected" onPress={() => {}}>
          생활
        </Button>
        <Button variant="category-unselected" onPress={() => {}}>
          육아
        </Button>
        <Button variant="category-unselected" onPress={() => {}}>
          애완용품
        </Button>
      </View>
    </ThemeProvider>
  ),
};

// ===== Square Buttons (사각형) =====

export const SquareSelectedLong: Story = {
  args: {
    variant: 'square-selected',
    size: 'long',
    children: '롱 버튼 선택됨',
  },
};

export const SquareUnselectedLong: Story = {
  args: {
    variant: 'square-unselected',
    size: 'long',
    children: '롱 버튼 미선택',
  },
};

export const SquareSelectedShort: Story = {
  args: {
    variant: 'square-selected',
    size: 'short',
    children: '숏 버튼 선택',
  },
};

export const SquareUnselectedShort: Story = {
  args: {
    variant: 'square-unselected',
    size: 'short',
    children: '숏 버튼 미선택',
  },
};

export const SquareShowcase: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <Button variant="square-selected" size="long" onPress={() => {}}>
          롱 버튼 선택됨
        </Button>
        <Button variant="square-unselected" size="long" onPress={() => {}}>
          롱 버튼 미선택
        </Button>
        <View style={styles.row}>
          <Button variant="square-selected" size="short" onPress={() => {}}>
            숏 선택
          </Button>
          <Button variant="square-unselected" size="short" onPress={() => {}}>
            숏 미선택
          </Button>
        </View>
      </View>
    </ThemeProvider>
  ),
};

// ===== Full Width Buttons (전체 너비) =====

export const FullPrimary: Story = {
  args: {
    variant: 'full-primary',
    children: '다음',
  },
};

export const FullSecondary: Story = {
  args: {
    variant: 'full-secondary',
    children: '확인',
  },
};

export const FullDisabled: Story = {
  args: {
    variant: 'full-disabled',
    children: '비활성',
  },
};

export const FullWidthShowcase: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <Button variant="full-primary" onPress={() => {}}>
          로그인
        </Button>
        <Button variant="full-secondary" onPress={() => {}}>
          취소
        </Button>
        <Button variant="full-disabled" onPress={() => {}}>
          비활성
        </Button>
      </View>
    </ThemeProvider>
  ),
};

// ===== Small Button (작은 버튼) =====

export const SmallButton: Story = {
  args: {
    variant: 'small',
    children: '인증번호 재전송',
  },
};

// ===== Search Buttons (검색) =====

export const SearchActive: Story = {
  args: {
    variant: 'search-active',
    children: '텍스트',
  },
};

export const SearchInactive: Story = {
  args: {
    variant: 'search-inactive',
    children: '텍스트',
  },
};

export const SearchShowcase: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <Button variant="search-active" onPress={() => {}}>
          검색어 입력
        </Button>
        <Button variant="search-inactive" onPress={() => {}}>
          검색어 입력
        </Button>
      </View>
    </ThemeProvider>
  ),
};

// ===== Loading States =====

export const LoadingStates: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.showcase}>
        <Button variant="category-selected" loading onPress={() => {}}>
          로딩중
        </Button>
        <Button variant="square-selected" size="long" loading onPress={() => {}}>
          로딩중
        </Button>
        <Button variant="full-primary" loading onPress={() => {}}>
          로딩중
        </Button>
      </View>
    </ThemeProvider>
  ),
};

// ===== All Variants Showcase =====

export const AllVariants: Story = {
  render: () => (
    <ThemeProvider>
      <View style={styles.allShowcase}>
        {/* Category Buttons */}
        <View style={styles.section}>
          <View style={styles.categoryRow}>
            <Button variant="category-selected" onPress={() => {}}>
              선택
            </Button>
            <Button variant="category-unselected" onPress={() => {}}>
              미선택
            </Button>
          </View>
        </View>

        {/* Square Buttons */}
        <View style={styles.section}>
          <Button variant="square-selected" size="long" onPress={() => {}}>
            롱 선택
          </Button>
          <Button variant="square-unselected" size="long" onPress={() => {}}>
            롱 미선택
          </Button>
        </View>

        {/* Full Width Buttons */}
        <View style={styles.section}>
          <Button variant="full-primary" onPress={() => {}}>
            Primary
          </Button>
          <Button variant="full-secondary" onPress={() => {}}>
            Secondary
          </Button>
          <Button variant="full-disabled" onPress={() => {}}>
            Disabled
          </Button>
        </View>

        {/* Small & Search */}
        <View style={styles.section}>
          <Button variant="small" onPress={() => {}}>
            Small
          </Button>
          <Button variant="search-active" onPress={() => {}}>
            Search
          </Button>
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
  showcase: {
    width: '100%',
    gap: 12,
    padding: 16,
    alignItems: 'center',
  },
  allShowcase: {
    width: '100%',
    gap: 24,
    padding: 16,
  },
  section: {
    gap: 12,
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
});

/**
 * PopularSearchItem Storybook
 *
 * Figma 디자인 시스템에 맞춰 구성된 PopularSearchItem 컴포넌트입니다.
 *
 * 반응형 테스트:
 * - 짧은 텍스트 (정상 표시)
 * - 긴 텍스트 (말줄임 처리)
 * - 다양한 디바이스 크기 (320px ~ 768px)
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PopularSearchItem } from '../../design-system/primitives/PopularSearchItem';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof PopularSearchItem> = {
  title: 'Design System/Components/PopularSearchItem',
  component: PopularSearchItem,
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

type Story = StoryObj<typeof PopularSearchItem>;

// ===== Default (짧은 텍스트) =====

export const Default: Story = {
  args: {
    rank: 1,
    keyword: '동원참치',
    rankingChange: 'up',
  },
};

// ===== Ranking Up (순위 상승) =====

export const RankingUp: Story = {
  args: {
    rank: 1,
    keyword: '동원참치 캔 20ea',
    rankingChange: 'up',
    onPress: (keyword) => Alert.alert('검색', keyword),
  },
};

// ===== Ranking Down (순위 하락) =====

export const RankingDown: Story = {
  args: {
    rank: 2,
    keyword: '신라면 멀티팩',
    rankingChange: 'down',
    onPress: (keyword) => Alert.alert('검색', keyword),
  },
};

// ===== Ranking Maintain (순위 유지) =====

export const RankingMaintain: Story = {
  args: {
    rank: 3,
    keyword: '풀무원 두부',
    rankingChange: 'maintain',
    onPress: (keyword) => Alert.alert('검색', keyword),
  },
};

// ===== Long Text (긴 텍스트 - 말줄임 테스트) =====

export const LongText: Story = {
  args: {
    rank: 1,
    keyword: '프로틴 바 대용량 세트 1+1 이벤트 특가 할인 프로모션 진행중',
    rankingChange: 'up',
    onPress: (keyword) => Alert.alert('검색', keyword),
  },
};

// ===== Non Clickable (클릭 불가능) =====

export const NonClickable: Story = {
  args: {
    rank: 5,
    keyword: '비타민 C',
    rankingChange: 'maintain',
    // onPress 없음 - View로 렌더링
  },
};

// ===== Top 10 List (1-10위 목록 - 반응형 테스트) =====

export const Top10List: Story = {
  render: () => {
    const mockData = [
      { rank: 1, keyword: '동원참치 캔 20ea', rankingChange: 'down' as const },
      { rank: 2, keyword: '신라면 멀티팩', rankingChange: 'up' as const },
      { rank: 3, keyword: '풀무원 두부', rankingChange: 'maintain' as const },
      { rank: 4, keyword: '프로틴 바 대용량 세트', rankingChange: 'up' as const },
      { rank: 5, keyword: '비타민 C 1000mg', rankingChange: 'down' as const },
      { rank: 6, keyword: '삼다수 2L 6병', rankingChange: 'maintain' as const },
      { rank: 7, keyword: '커피 원두 1kg', rankingChange: 'up' as const },
      { rank: 8, keyword: '화장지 30롤', rankingChange: 'down' as const },
      { rank: 9, keyword: '세제 리필 3.5L', rankingChange: 'up' as const },
      { rank: 10, keyword: '마스크 100매', rankingChange: 'maintain' as const },
    ];

    return (
      <ThemeProvider>
        <ScrollView style={styles.listContainer}>
          <Text style={styles.title}>인기 검색어</Text>
          <View style={styles.list}>
            {mockData.map((item) => (
              <PopularSearchItem
                key={item.rank}
                rank={item.rank}
                keyword={item.keyword}
                rankingChange={item.rankingChange}
                onPress={(keyword) => Alert.alert('검색', keyword)}
              />
            ))}
          </View>
        </ScrollView>
      </ThemeProvider>
    );
  },
};

// ===== Responsive Test (반응형 테스트 - 다양한 너비) =====

export const ResponsiveTest: Story = {
  render: () => {
    const testCases = [
      { width: 280, label: '작은 디바이스 (280px)' },
      { width: 320, label: 'iPhone SE (320px)' },
      { width: 375, label: 'iPhone 14 (375px)' },
      { width: 390, label: 'iPhone 14 Pro (390px)' },
      { width: 430, label: 'iPhone 14 Pro Max (430px)' },
    ];

    return (
      <ThemeProvider>
        <ScrollView style={styles.responsiveContainer}>
          {testCases.map((testCase) => (
            <View key={testCase.width} style={styles.responsiveSection}>
              <Text style={styles.responsiveLabel}>{testCase.label}</Text>
              <View style={[styles.responsiveBox, { width: testCase.width }]}>
                <PopularSearchItem
                  rank={1}
                  keyword="프로틴 바 대용량 세트 1+1 이벤트 특가"
                  rankingChange="up"
                  onPress={(keyword) => Alert.alert('검색', keyword)}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </ThemeProvider>
    );
  },
};

// ===== Interactive Showcase (모든 상태 한 눈에) =====

export const AllStates: Story = {
  render: () => {
    return (
      <ThemeProvider>
        <ScrollView style={styles.showcaseContainer}>
          <View style={styles.showcase}>
            <Text style={styles.sectionTitle}>짧은 텍스트</Text>
            <PopularSearchItem
              rank={1}
              keyword="동원참치"
              rankingChange="up"
              onPress={(keyword) => Alert.alert('검색', keyword)}
            />

            <Text style={styles.sectionTitle}>중간 길이 텍스트</Text>
            <PopularSearchItem
              rank={2}
              keyword="동원참치 캔 20ea"
              rankingChange="down"
              onPress={(keyword) => Alert.alert('검색', keyword)}
            />

            <Text style={styles.sectionTitle}>긴 텍스트 (말줄임)</Text>
            <PopularSearchItem
              rank={3}
              keyword="프로틴 바 대용량 세트 1+1 이벤트 특가 할인 프로모션"
              rankingChange="maintain"
              onPress={(keyword) => Alert.alert('검색', keyword)}
            />

            <Text style={styles.sectionTitle}>클릭 불가능</Text>
            <PopularSearchItem
              rank={4}
              keyword="비타민 C"
              rankingChange="up"
            />
          </View>
        </ScrollView>
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
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181A1A',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  responsiveContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  responsiveSection: {
    padding: 16,
    gap: 8,
  },
  responsiveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181A1A',
    marginBottom: 8,
  },
  responsiveBox: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F9F9F9',
  },
  showcaseContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  showcase: {
    padding: 16,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 8,
  },
});

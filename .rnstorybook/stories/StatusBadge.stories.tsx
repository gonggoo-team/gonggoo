/**
 * StatusBadge Storybook
 *
 * 상품 상태를 표시하는 StatusBadge 컴포넌트입니다.
 *
 * Variant 기반 스타일 시스템:
 * - Card Variant: ProductCard용 소형 배지 (11px, 2px 4px, 반응형)
 * - Detail Variant: 상품 상세 페이지용 대형 배지 (14px, 5px 10px, 고정 크기)
 *
 * Figma 동기화: 2025-12-07
 */

import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBadge } from '../../design-system/primitives/StatusBadge';
import { ThemeProvider } from '../../design-system/theme';

const meta: Meta<typeof StatusBadge> = {
  title: 'Design System/Primitives/StatusBadge',
  component: StatusBadge,
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

type Story = StoryObj<typeof StatusBadge>;

// ============================================================
// Card Variant (ProductCards용 - 소형)
// ============================================================

/**
 * Card Variant - Deadline
 * "오늘 마감" 배지 (빨간 배경, 흰색 텍스트)
 * Figma Node: 268-922
 */
export const CardDeadline: Story = {
  args: {
    variant: 'card',
    type: 'deadline',
    label: '오늘 마감',
  },
};

/**
 * Card Variant - Recruiting
 * "3명 모집" 배지 (연한 초록 배경, 진한 초록 텍스트)
 * Figma Node: 268-921
 */
export const CardRecruiting: Story = {
  args: {
    variant: 'card',
    type: 'recruiting',
    label: '3명 모집',
  },
};

/**
 * Card Variant - Remaining
 * "14일 남음" 배지 (연한 핑크 배경, 빨간 텍스트)
 * Figma Node: 268-920
 */
export const CardRemaining: Story = {
  args: {
    variant: 'card',
    type: 'remaining',
    label: '14일 남음',
  },
};

/**
 * Card Variant - Closed
 * "모집 마감" 배지 (회색 배경, 흰색 텍스트)
 * Figma Node: 667-11266
 */
export const CardClosed: Story = {
  args: {
    variant: 'card',
    type: 'closed',
    label: '모집 마감',
  },
};

// ============================================================
// Detail Variant (상품 상세 페이지용 - 대형)
// ============================================================

/**
 * Detail Variant - Recruiting
 * "모집 중" 배지 (진한 초록 배경, 흰색 텍스트, font weight 600)
 * Figma Node: 374-3955
 */
export const DetailRecruiting: Story = {
  args: {
    variant: 'detail',
    type: 'recruiting',
    label: '모집 중',
  },
};

/**
 * Detail Variant - Recruitment Complete
 * "모집 완료" 배지 (연한 회색 배경, 검은색 텍스트)
 * Figma Node: 374-3957
 */
export const DetailRecruitmentComplete: Story = {
  args: {
    variant: 'detail',
    type: 'recruitment-complete',
    label: '모집 완료',
  },
};

/**
 * Detail Variant - Transaction Complete
 * "거래 완료" 배지 (연한 회색 배경, 검은색 텍스트)
 * Figma Node: 374-3959
 */
export const DetailTransactionComplete: Story = {
  args: {
    variant: 'detail',
    type: 'transaction-complete',
    label: '거래 완료',
  },
};

// ============================================================
// Comparison Views (비교 뷰)
// ============================================================

/**
 * 모든 Card Variant 배지 한눈에 보기
 * ProductCard에서 사용되는 모든 배지 타입
 */
export const AllCardVariants: Story = {
  render: () => (
    <View>
      <Text style={styles.heading}>Card Variant (ProductCards)</Text>
      <Text style={styles.subheading}>11px, padding 2px 4px, 반응형</Text>
      <View style={styles.row}>
        <StatusBadge variant="card" type="deadline" label="오늘 마감" />
        <StatusBadge variant="card" type="recruiting" label="3명 모집" />
        <StatusBadge variant="card" type="remaining" label="14일 남음" />
        <StatusBadge variant="card" type="closed" label="모집 마감" />
      </View>
    </View>
  ),
};

/**
 * 모든 Detail Variant 배지 한눈에 보기
 * 상품 상세 페이지에서 사용되는 모든 배지 타입
 */
export const AllDetailVariants: Story = {
  render: () => (
    <View>
      <Text style={styles.heading}>Detail Variant (Product Detail Page)</Text>
      <Text style={styles.subheading}>14px, padding 5px 10px, 고정 크기</Text>
      <View style={styles.row}>
        <StatusBadge variant="detail" type="recruiting" label="모집 중" />
        <StatusBadge variant="detail" type="recruitment-complete" label="모집 완료" />
        <StatusBadge variant="detail" type="transaction-complete" label="거래 완료" />
      </View>
    </View>
  ),
};

/**
 * Card vs Detail Variant 크기 비교
 * 같은 타입(recruiting)에서 variant에 따른 차이 확인
 */
export const SideBySideComparison: Story = {
  render: () => (
    <View style={styles.comparisonContainer}>
      <Text style={styles.heading}>Recruiting Badge - Variant Comparison</Text>
      <Text style={styles.subheading}>
        같은 recruiting 타입도 variant에 따라 다른 스타일 적용
      </Text>

      <View style={styles.comparisonRow}>
        <View style={styles.comparisonItem}>
          <Text style={styles.label}>Card (small)</Text>
          <Text style={styles.description}>ProductCard용</Text>
          <Text style={styles.specs}>11px · 2px 4px · 반응형</Text>
          <StatusBadge variant="card" type="recruiting" label="3명 모집" />
        </View>

        <View style={styles.comparisonItem}>
          <Text style={styles.label}>Detail (large)</Text>
          <Text style={styles.description}>상세 페이지용</Text>
          <Text style={styles.specs}>14px · 5px 10px · 고정</Text>
          <StatusBadge variant="detail" type="recruiting" label="모집 중" />
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>⚠️ 중요</Text>
        <Text style={styles.noteText}>
          • Card variant: 연한 초록 배경 (#E6EDE9)
        </Text>
        <Text style={styles.noteText}>
          • Detail variant: 진한 초록 배경 (#006242)
        </Text>
        <Text style={styles.noteText}>
          • 같은 recruiting 타입이지만 variant에 따라 색상이 반전됩니다
        </Text>
      </View>
    </View>
  ),
};

/**
 * 전체 배지 시스템 종합 뷰
 * Card와 Detail variant의 모든 배지를 한번에 확인
 */
export const CompleteSystem: Story = {
  render: () => (
    <View style={{ gap: 32 }}>
      {/* Card Variant */}
      <View>
        <Text style={styles.heading}>Card Variant</Text>
        <Text style={styles.subheading}>ProductCard용 소형 배지</Text>
        <View style={styles.row}>
          <StatusBadge variant="card" type="deadline" label="오늘 마감" />
          <StatusBadge variant="card" type="recruiting" label="3명 모집" />
          <StatusBadge variant="card" type="remaining" label="14일 남음" />
          <StatusBadge variant="card" type="closed" label="모집 마감" />
        </View>
      </View>

      {/* Detail Variant */}
      <View>
        <Text style={styles.heading}>Detail Variant</Text>
        <Text style={styles.subheading}>상품 상세 페이지용 대형 배지</Text>
        <View style={styles.row}>
          <StatusBadge variant="detail" type="recruiting" label="모집 중" />
          <StatusBadge variant="detail" type="recruitment-complete" label="모집 완료" />
          <StatusBadge variant="detail" type="transaction-complete" label="거래 완료" />
        </View>
      </View>
    </View>
  ),
};

// ============================================================
// Legacy Stories (하위 호환성 테스트)
// ============================================================

/**
 * 기본 variant 생략 테스트
 * variant를 명시하지 않으면 자동으로 'card' variant 적용 확인
 */
export const DefaultVariantTest: Story = {
  render: () => (
    <View>
      <Text style={styles.heading}>Default Variant (variant 생략)</Text>
      <Text style={styles.subheading}>
        variant를 명시하지 않으면 기본값 'card' 적용
      </Text>
      <View style={styles.row}>
        <StatusBadge type="deadline" label="오늘 마감" />
        <StatusBadge type="recruiting" label="3명 모집" />
        <StatusBadge type="remaining" label="14일 남음" />
        <StatusBadge type="closed" label="모집 마감" />
      </View>
    </View>
  ),
};

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#181A1A',
  },
  subheading: {
    fontSize: 13,
    color: '#6B7684',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  comparisonContainer: {
    gap: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 24,
  },
  comparisonItem: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181A1A',
  },
  description: {
    fontSize: 12,
    color: '#6B7684',
  },
  specs: {
    fontSize: 11,
    color: '#9FA7B1',
    fontFamily: 'monospace',
  },
  note: {
    backgroundColor: '#FFF4E6',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    gap: 6,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#181A1A',
  },
  noteText: {
    fontSize: 12,
    color: '#6B7684',
    lineHeight: 18,
  },
});

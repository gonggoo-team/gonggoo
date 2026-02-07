/**
 * ProductProgressChart Component
 *
 * 공구팟 진행 상황을 차트 형태로 시각적으로 표시하는 컴포넌트입니다.
 * - 2-5명까지 지원
 * - 인원수에 따라 다른 레이아웃 적용
 * - 채워진 슬롯과 빈 슬롯을 구분하여 표시
 * - 우측에 "현재/전체" 형태의 텍스트 표시
 *
 * Figma: 공구팟 진행 상황 섹션
 * - 2명: node-id=406-1860
 * - 3명: node-id=406-1855
 * - 4명: node-id=406-1865
 * - 5명: node-id=688-11405
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import type { ProductProgressChartProps } from './ProductProgressChart.types';

export const ProductProgressChart: React.FC<ProductProgressChartProps> = ({
  participantCount,
  totalSlots,
}) => {
  const { theme } = useTheme();
  
  // 2-5명만 지원
  if (totalSlots < 2 || totalSlots > 5) {
    console.warn(`ProductProgressChart: totalSlots는 2-5 사이여야 합니다. 현재: ${totalSlots}`);
    return null;
  }

  // 슬롯 배열 생성
  const slots = Array.from({ length: totalSlots }, (_, index) => ({
    id: index,
    filled: index < participantCount,
  }));

  return (
    <View style={styles.container}>
      {/* 차트 바 - flex: 1로 가용 공간 차지 */}
      <View style={styles.chartContainer}>
        {slots.map((slot, index) => (
          <View
            key={slot.id}
            style={[
              styles.slot,
              {
                backgroundColor: slot.filled
                  ? theme.colors.surface.brand.primary // #006242
                  : theme.colors.surface.env.disabled, // #D9D9D9
              },
              // 첫 번째 슬롯
              index === 0 && styles.firstSlot,
              // 마지막 슬롯
              index === totalSlots - 1 && styles.lastSlot,
            ]}
          />
        ))}
      </View>

      {/* 참여 현황 텍스트 - flexShrink: 0으로 잘림 방지 */}
      <Text
        style={[
          styles.countText,
          {
            fontSize: theme.typography.fontSize.sm, // 14px
            fontWeight: theme.typography.fontWeight.medium, // 500
            lineHeight: theme.typography.fontSize.sm * 1.2,
            letterSpacing: theme.typography.getLetterSpacing(14),
            color: theme.colors.surface.brand.primary, // #006242
          },
        ]}
      >
        {participantCount}/{totalSlots}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12, // 차트와 텍스트 사이 간격
  },
  chartContainer: {
    flex: 1, // 가용 공간을 유연하게 차지
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // 슬롯 사이 간격
  },
  slot: {
    flex: 1, // 모든 슬롯이 균등하게 공간 분배
    height: 16,
  },
  firstSlot: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastSlot: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  countText: {
    flexShrink: 0, // 텍스트가 절대 축소되지 않도록 보장
  },
});

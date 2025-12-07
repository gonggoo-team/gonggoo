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

  // 슬롯 너비 계산 (Figma 기준)
  const getSlotWidth = () => {
    switch (totalSlots) {
      case 2:
        return 145; // 2명: 145px each
      case 3:
        return 'fill'; // 3명: fill 모드
      case 4:
        return 70; // 4명: 70px each
      case 5:
        return 55; // 5명: 55px each
      default:
        return 70;
    }
  };

  const slotWidth = getSlotWidth();

  // 슬롯 배열 생성
  const slots = Array.from({ length: totalSlots }, (_, index) => ({
    id: index,
    filled: index < participantCount,
  }));

  return (
    <View style={styles.container}>
      {/* 차트 바 */}
      <View style={[styles.chartContainer, totalSlots === 3 && styles.chartContainerFill]}>
        {slots.map((slot, index) => (
          <View
            key={slot.id}
            style={[
              styles.slot,
              {
                backgroundColor: slot.filled
                  ? theme.colors.surface.brand.primary // #006242
                  : theme.colors.surface.env.disabled, // #D9D9D9
                width: slotWidth === 'fill' ? undefined : slotWidth,
                // 3명일 때는 flex:1로 균등 분할
                flex: slotWidth === 'fill' ? 1 : undefined,
              },
              // 첫 번째 슬롯
              index === 0 && styles.firstSlot,
              // 마지막 슬롯
              index === totalSlots - 1 && styles.lastSlot,
            ]}
          />
        ))}
      </View>

      {/* 참여 현황 텍스트 */}
      <Text
        style={{
          fontSize: theme.typography.fontSize.sm, // 14px
          fontWeight: theme.typography.fontWeight.medium, // 500
          lineHeight: theme.typography.fontSize.sm * 1.2,
          letterSpacing: theme.typography.getLetterSpacing(14),
          color: theme.colors.surface.brand.primary, // #006242
        }}
      >
        {participantCount}/{totalSlots}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 27, // Figma 기준
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // 슬롯 사이 간격
  },
  chartContainerFill: {
    width: 295, // 3명일 때 전체 너비
  },
  slot: {
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
});

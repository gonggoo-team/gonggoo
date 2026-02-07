/**
 * ProductProgressSlots Component
 *
 * 공구팟 진행 상황을 슬롯 형태로 시각적으로 표시하는 컴포넌트입니다.
 * - 채워진 슬롯과 빈 슬롯을 구분하여 표시
 * - 우측에 "현재/전체" 형태의 텍스트 표시
 *
 * Figma: 공구팟 진행 상황 섹션
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import type { ProductProgressSlotsProps } from './ProductProgressSlots.types';

export const ProductProgressSlots: React.FC<ProductProgressSlotsProps> = ({
  participantCount,
  totalSlots,
}) => {
  const { theme } = useTheme();

  // 슬롯 배열 생성
  const slots = Array.from({ length: totalSlots }, (_, index) => ({
    id: index,
    filled: index < participantCount,
  }));

  return (
    <View style={styles.container}>
      {/* 슬롯 바 */}
      <View style={styles.slotsContainer}>
        {slots.map((slot, index) => (
          <View
            key={slot.id}
            style={[
              styles.slot,
              {
                backgroundColor: slot.filled
                  ? theme.colors.surface.brand.primary // #006242
                  : theme.colors.surface.env.disabled, // #D9D9D9
                borderRadius: index === 0
                  ? 10 // 첫 번째 슬롯: 왼쪽 모서리만 둥글게
                  : index === totalSlots - 1
                  ? 10 // 마지막 슬롯: 오른쪽 모서리만 둥글게
                  : 0,
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
  slotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // 슬롯 사이 간격
  },
  slot: {
    width: 70,
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

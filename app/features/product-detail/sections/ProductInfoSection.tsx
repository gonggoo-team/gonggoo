/**
 * ProductInfoSection Component
 *
 * 공구팟 진행 상황 섹션
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductProgressChart, useTheme } from '@/design-system';
import { useTypographyStyles } from '@/app/shared/hooks';

export interface ProductInfoSectionProps {
  participantCount: number;
  totalSlots: number;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  participantCount,
  totalSlots,
}) => {
  const { theme } = useTheme();
  const typo = useTypographyStyles();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
          공구팟 진행 상황
        </Text>
        <Text style={{ ...typo.sm, color: theme.colors.surface.brand.primary }}>
          {participantCount}명 참여
        </Text>
      </View>
      <ProductProgressChart participantCount={participantCount} totalSlots={totalSlots} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16.8,
  },
});

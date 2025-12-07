/**
 * ProductHeaderSection Component
 *
 * 상품 헤더 섹션 (카테고리, 제목, 가격, 상태)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge, useTheme } from '@/design-system';
import type { StatusBadgeType } from '@/design-system';
import { useTypographyStyles } from '@/app/shared/hooks';

export interface ProductHeaderSectionProps {
  category: string;
  title: string;
  price: number;
  pricePerSlot: number;
  recruitmentStatus: string;
  statusType: StatusBadgeType;
  daysRemaining?: number;
  reportable: boolean;
  onReportPress: () => void;
}

export const ProductHeaderSection: React.FC<ProductHeaderSectionProps> = ({
  category,
  title,
  price,
  pricePerSlot,
  recruitmentStatus,
  statusType,
  daysRemaining,
  reportable,
  onReportPress,
}) => {
  const { theme } = useTheme();
  const typo = useTypographyStyles();

  return (
    <View style={styles.section}>
      <View style={styles.categoryRow}>
        <Text style={{ ...typo.xxs, color: theme.colors.surface.texticon.onnormal.text.midEmp }}>
          카테고리 &gt; {category}
        </Text>
        {reportable && (
          <Text
            style={{ ...typo.xxs, color: theme.colors.surface.texticon.onnormal.text.midEmp }}
            onPress={onReportPress}
          >
            신고하기
          </Text>
        )}
      </View>
      <Text style={{ ...typo.md, color: theme.colors.surface.texticon.onnormal.text.black, marginTop: 14 }}>
        {title}
      </Text>
      <View style={styles.priceSection}>
        <View style={{ gap: 1 }}>
          <Text style={{ ...typo.md, color: theme.colors.surface.texticon.onnormal.text.midEmp }}>
            {price.toLocaleString()}원
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
            <Text style={{ ...typo.xxl25, color: theme.colors.surface.brand.primary }}>
              {pricePerSlot.toLocaleString()}원
            </Text>
            <Text style={{ ...typo.smHeight17, color: theme.colors.surface.texticon.onnormal.text.midEmp }}>
              1 슬롯당
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          {recruitmentStatus === '모집 중' && daysRemaining !== undefined && (
            <Text style={{ ...typo.sm, color: theme.colors.surface.brand.primary }}>
              {daysRemaining}일 남음
            </Text>
          )}
          <StatusBadge variant="detail" type={statusType} label={recruitmentStatus} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
  },
});

/**
 * ProductBadges Component
 *
 * 상품 상태 배지들을 표시하는 컴포넌트입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../hooks';
import { StatusBadge, type StatusBadgeType } from '../../../primitives/StatusBadge';

/**
 * ProductBadges Props
 */
export interface ProductBadgesProps {
  /**
   * 배지 목록
   */
  badges: Array<{
    type: StatusBadgeType;
    label: string;
  }> | null;
}

/**
 * ProductBadges Component
 */
export const ProductBadges = React.memo<ProductBadgesProps>(({ badges }) => {
  const { theme } = useTheme();

  if (badges && badges.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          gap: 7, // Figma 기준: 7px
        },
      ]}
    >
      {badges && badges.map((badge, index) => (
        <StatusBadge key={`${badge.type}-${index}`} type={badge.type} label={badge.label} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

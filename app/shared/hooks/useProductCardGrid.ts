/**
 * useProductCardGrid Hook
 *
 * 2열 상품 카드 그리드 레이아웃을 위한 계산 훅입니다.
 * - Figma 디자인 기준에 맞춘 정확한 카드 너비 계산
 * - 고정 간격 9px (카드 간격)
 * - 고정 패딩 20px (좌우)
 * - 행 간격 30px (Figma 기준)
 *
 * 사용 예시:
 * ```tsx
 * const { cardWidth, gap, rowGap } = useProductCardGrid();
 *
 * <View style={{ width: cardWidth, marginRight: isLeft ? gap : 0, marginBottom: rowGap }}>
 *   <ProductCard />
 * </View>
 * ```
 */

import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { useTheme } from '@/design-system';

/**
 * 2열 그리드 레이아웃 계산 훅
 */
export const useProductCardGrid = () => {
  const { theme } = useTheme();

  return useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const horizontalPadding = 40; // 좌우 각 20px
    const gap = theme.spacing.xs9; // 9px (카드 간격)
    const rowGap = theme.spacing.xl30; // 30px (행 간격)
    const availableWidth = screenWidth - horizontalPadding;
    const cardWidth = (availableWidth - gap) / 2;

    return {
      /** 카드 너비 */
      cardWidth,
      /** 카드 간 가로 간격 (9px) */
      gap,
      /** 카드 간 세로 간격 (30px) */
      rowGap,
    };
  }, [theme.spacing.xs9, theme.spacing.xl30]);
};

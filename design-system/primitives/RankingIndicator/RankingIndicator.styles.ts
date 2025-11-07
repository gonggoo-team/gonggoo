/**
 * RankingIndicator Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 검색창/인기순위 요소 컴포넌트 기준 (width: 10px, height: 10px)
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createRankingIndicatorStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container (Figma: 10x10)
    container: {
      width: theme.dimensions.iconSize.xs, // 10px
      height: theme.dimensions.iconSize.xs, // 10px
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

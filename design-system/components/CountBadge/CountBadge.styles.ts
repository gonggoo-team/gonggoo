/**
 * CountBadge Component Styles
 *
 * GNB와 TabBar에서 공통으로 사용하는 숫자 배지 스타일
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';
import type { CountBadgeVariant } from './CountBadge.types';

/**
 * CountBadge 스타일 생성 함수
 */
export const createCountBadgeStyles = (theme: Theme, variant: CountBadgeVariant) => {
  // GNB variant 스타일
  const gnbStyles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: -5,
      right: -8,
      minWidth: 16,
      height: 16,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xxs,
      backgroundColor: theme.colors.surface.env.accent, // #F7514D (빨간색)
    },
    text: {
      color: theme.colors.surface.texticon.onnormal.text.white,
      fontSize: theme.typography.fixedFontSize.badgeCount, // 10px
      fontWeight: '600',
      lineHeight: 16,
    },
  });

  // TabBar variant 스타일
  const tabbarStyles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: -5, // GNB와 동일: 아이콘 상단보다 5px 위
      right: -8, // GNB와 동일: 아이콘 우측보다 8px 오른쪽
      backgroundColor: theme.colors.surface.brand.primary, // #006242 (초록색)
      borderRadius: 10,
      width: 18, // 고정 크기로 원형 유지 (두 자리수도 들어감)
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface.normal.bg1, // 흰색 테두리로 가독성 향상
    },
    text: {
      color: theme.colors.surface.normal.bg1, // white
      fontSize: 9, // 작은 폰트로 두 자리수도 원형에 맞춤
      fontWeight: theme.typography.fontWeight.semiBold, // 600
      lineHeight: 10,
      textAlign: 'center',
      includeFontPadding: false, // Android에서 폰트 패딩 제거로 정확한 중앙 정렬
    },
  });

  return variant === 'gnb' ? gnbStyles : tabbarStyles;
};

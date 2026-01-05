/**
 * CountBadge Component Types
 *
 * GNB와 TabBar에서 공통으로 사용하는 숫자 배지 컴포넌트
 */

import type { ViewStyle } from 'react-native';

/**
 * 배지 variant
 * - gnb: GNB 아이콘용 (빨간색 배경, 테두리 없음)
 * - tabbar: TabBar 아이콘용 (초록색 배경, 흰색 테두리)
 */
export type CountBadgeVariant = 'gnb' | 'tabbar';

/**
 * CountBadge 컴포넌트 Props
 */
export interface CountBadgeProps {
  /**
   * 표시할 숫자
   * - 0이면 배지를 표시하지 않음
   * - 99 초과 시 "99+" 표시
   */
  count: number;

  /**
   * 배지 스타일 variant
   * @default 'gnb'
   */
  variant?: CountBadgeVariant;

  /**
   * 추가 스타일 (선택사항)
   * 주로 position, top, right, left, transform 등 위치 관련 스타일에 사용
   */
  style?: ViewStyle;
}

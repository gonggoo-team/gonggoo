/**
 * ProductOptionsMenu Types
 */

import type { Animated } from 'react-native';

export interface ProductOptionsMenuProps {
  /** 모집 취소 핸들러 */
  onCancel: () => void;

  /** 수정하기 핸들러 */
  onEdit: () => void;

  /** 아이콘 색상 (기본값: white) - 단색 사용 시 */
  iconColor?: string;

  /** 검정 아이콘 투명도 (스크롤 애니메이션용) */
  blackOpacity?: Animated.AnimatedInterpolation<number>;

  /** 흰색 아이콘 투명도 (스크롤 애니메이션용) */
  whiteOpacity?: Animated.AnimatedInterpolation<number>;

  /** 검정 아이콘 색상 */
  blackIconColor?: string;
}

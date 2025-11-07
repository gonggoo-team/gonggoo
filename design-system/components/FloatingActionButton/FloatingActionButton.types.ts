/**
 * FloatingActionButton Types
 */

import type { IconName } from '../../primitives/Icon/types';

export interface FloatingActionButtonProps {
  /** 버튼 클릭 핸들러 */
  onPress: () => void;
  /** 하단 위치 (기본값: 탭바 높이(84px) + 간격(25px) = 109px) */
  bottom?: number;
  /** 우측 위치 (기본값: 20) */
  right?: number;
  /** 아이콘 이름 (기본값: 'plus') */
  icon?: IconName;
  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * InfoRow Types
 */

import type { IconName } from '../Icon';

export type CustomIconName = 'grid' | 'box' | 'location' | 'clock';

export interface InfoRowProps {
  /** 아이콘 이름 (기존 Icon 컴포넌트 또는 커스텀 아이콘) */
  iconName?: IconName | CustomIconName;
  /** 아이콘 컴포넌트 (custom icon) */
  iconComponent?: React.ReactNode;
  /** 텍스트 */
  text: string;
  /** 아이콘 색상 */
  iconColor?: string;
  /** 텍스트 색상 */
  textColor?: string;
}

/**
 * TabBarIcon Types
 *
 * 하단 탭바 아이콘 컴포넌트의 타입 정의입니다.
 */

import type { IconName } from '../../primitives/Icon';

/**
 * 탭 이름 타입
 */
export type TabName = 'home' | 'category' | 'map' | 'chat' | 'profile';

/**
 * TabBarIcon Props
 */
export interface TabBarIconProps {
  /**
   * 탭 이름
   */
  name: TabName;

  /**
   * 현재 탭이 선택되었는지 여부
   */
  focused: boolean;

  /**
   * 라벨 텍스트
   */
  label: string;
}

/**
 * 탭별 아이콘 매핑
 */
export const TAB_ICON_MAP: Record<TabName, { fill: IconName; line: IconName }> = {
  home: {
    fill: 'home-fill',
    line: 'home-line',
  },
  category: {
    fill: 'hamburger',
    line: 'hamburger',
  },
  map: {
    fill: 'map-pin-fill',
    line: 'map-pin-line',
  },
  chat: {
    fill: 'chat-fill',
    line: 'chat-line',
  },
  profile: {
    fill: 'profile-fill',
    line: 'profile-line',
  },
};

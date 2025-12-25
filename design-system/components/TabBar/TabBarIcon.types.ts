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
   * 라벨 텍스트 (선택사항)
   * - 현재 디자인에서는 사용되지 않음
   */
  label?: string;

  /**
   * 배지에 표시할 숫자 (선택사항)
   * - 주로 채팅 탭에서 안 읽은 메시지 개수 표시
   */
  badgeCount?: number;
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

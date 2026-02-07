/**
 * Icon Types
 *
 * Figma 기반 아이콘 시스템의 타입 정의
 */

/**
 * 사용 가능한 모든 아이콘 이름
 * Figma icon set에서 추출
 */
export type IconName =
  | 'search'
  | 'profile-line'
  | 'profile-fill'
  | 'home-line'
  | 'home-fill'
  | 'back'
  | 'back-mini'
  | 'map-pin-line'
  | 'map-pin-fill'
  | 'plus'
  | 'hamburger'
  | 'chat-line'
  | 'chat-fill'
  | 'bell-on'
  | 'bell-off'
  | 'text-delete'
  | 'small-x'
  | 'heart-line'
  | 'heart-fill'
  | 'share'
  | 'alarm-fill'
  | 'drop'
  | 'filter'
  | 'x'
  | 'check-box-fill'
  | 'check-box-empty'
  | 'question'
  | 'cart'
  | 'check'
  | 'refresh'
  | 'arrow-up'
  | 'arrow-down'
  | 'ranking-maintain'
  | 'chevron-right'
  | 'small-chevron'
  | 'edit'
  | 'settings'
  | 'recruiting'
  | 'recruitment-complete'
  | 'group-complete'
  | 'joined'
  | 'profile-default'
  | 'camera'
  | 'minus'
  | 'close'
  | 'chat_send';

/**
 * Icon 크기 프리셋
 */
export const ICON_SIZES = {
  xs: 12, // back-mini
  sm: 13, // small-x
  md: 16, // drop, filter, question
  lg: 20, // refresh
  xl: 24, // 대부분의 아이콘
} as const;

/**
 * Icon Props
 */
export interface IconProps {
  /** 아이콘 이름 */
  name: IconName;

  /** 아이콘 크기 (기본: 24) */
  size?: number;

  /** 아이콘 색상 (기본: 현재 텍스트 색상) */
  color?: string;

  /** 접근성 라벨 */
  accessibilityLabel?: string;

  /** 테스트 ID */
  testID?: string;

  /**
   * 반응형 스케일링 적용 여부
   * @default true - 콘텐츠 아이콘은 스케일링
   * @example
   * <Icon name="search" size={24} /> // 반응형: 24px → 24-28px
   * <Icon name="bell" size={16} responsive={false} /> // 고정: 16px
   */
  responsive?: boolean;
}

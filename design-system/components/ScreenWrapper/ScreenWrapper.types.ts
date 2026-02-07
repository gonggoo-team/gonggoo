/**
 * ScreenWrapper Types
 *
 * 화면 래퍼 컴포넌트의 타입 정의입니다.
 */

import type { ViewStyle, StyleProp } from 'react-native';

/**
 * Safe Area Edge 타입
 */
export type SafeAreaEdge = 'top' | 'bottom' | 'left' | 'right';

/**
 * 화면 유형별 프리셋
 * - default: 일반 스택 화면 (상단만 safe area)
 * - tab: 탭 네비게이터 화면 (탭바가 하단 처리)
 * - modal: 모달 화면 (하단만 safe area, 상단은 헤더가 처리)
 * - fullscreen: 전체화면 (상하단 모두 safe area)
 * - none: safe area 없음 (직접 제어 필요한 경우)
 */
export type ScreenPreset = 'default' | 'tab' | 'modal' | 'fullscreen' | 'none';

/**
 * ScreenWrapper Props
 */
export interface ScreenWrapperProps {
  /** 자식 컴포넌트 */
  children: React.ReactNode;

  /** 화면 유형 프리셋 (기본값: 'default') */
  preset?: ScreenPreset;

  /** 커스텀 edges 설정 (preset보다 우선) */
  edges?: SafeAreaEdge[];

  /** 추가 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 배경색 (기본값: theme.colors.surface.normal.bg1) */
  backgroundColor?: string;

  /** testID for testing */
  testID?: string;
}

/**
 * 프리셋별 기본 edges 설정
 */
export const SCREEN_PRESETS: Record<ScreenPreset, SafeAreaEdge[]> = {
  default: ['top'],
  tab: [],
  modal: ['bottom'],
  fullscreen: ['top', 'bottom'],
  none: [],
};

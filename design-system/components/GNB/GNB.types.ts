/**
 * GNB Types
 *
 * 동적 3섹션 시스템을 위한 타입 정의
 * - 왼쪽: 단일 요소 (로고, 뒤로가기 등)
 * - 중앙: 로고/제목/검색바 등
 * - 오른쪽: 아이콘 배열
 */

import type { ReactNode } from 'react';

/**
 * 왼쪽 섹션 설정
 * 단일 요소만 표시 가능
 */
export type LeftSectionConfig =
  | { type: 'logo-text'; text: string; onPress?: () => void }
  | { type: 'logo-image'; uri: string; onPress?: () => void }
  | { type: 'back'; onPress: () => void }
  | { type: 'close'; onPress: () => void }
  | { type: 'menu'; onPress: () => void }
  | { type: 'address'; text: string; onPress: () => void };

/**
 * 중앙 섹션 설정
 * 로고, 제목, 검색바 또는 커스텀 컴포넌트
 */
export type CenterSectionConfig =
  | { type: 'logo-text'; text: string }
  | { type: 'logo-image'; uri: string }
  | { type: 'title'; text: string }
  | {
      type: 'search-bar';
      value: string;
      onChangeText: (text: string) => void;
      placeholder?: string;
      onSubmit?: () => void;
    }
  | { type: 'custom'; component: ReactNode }
  | { type: 'none' }; // 빈 공간

/**
 * 오른쪽 아이콘 설정
 */
export interface RightIconConfig {
  /** 아이콘 타입 */
  type: 'search' | 'cart' | 'notification' | 'share' | 'menu' | 'filter' | 'more' | 'x';

  /** 클릭 핸들러 */
  onPress: () => void;

  /** 배지 설정 */
  badge?: {
    /** 숫자 배지 (1-999) */
    count?: number;
    /** 점 배지 */
    dot?: boolean;
  };

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * GNB Props
 */
export interface GNBProps {
  /** 왼쪽 섹션 설정 */
  leftSection?: LeftSectionConfig;

  /** 중앙 섹션 설정 */
  centerSection?: CenterSectionConfig;

  /** 오른쪽 아이콘 배열 */
  rightIcons?: RightIconConfig[];
}

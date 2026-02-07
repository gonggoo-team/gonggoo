/**
 * TabContentLayout Type Definitions
 *
 * 탭 콘텐츠 레이아웃 컴포넌트의 타입을 정의합니다.
 */

import type { ReactNode } from 'react';
import type { FlatListProps } from 'react-native';

/**
 * TabContentLayout Props
 */
export interface TabContentLayoutProps<T = any> {
  /** 고정 헤더 컴포넌트 (카테고리 필터 등) - 항상 상단 고정, 배경 있음 */
  fixedHeader?: ReactNode;

  /** Collapsible 헤더 (정렬/필터, 성별/연령대 등) - 스크롤 방향에 따라 사라짐/나타남 */
  collapsibleHeader?: ReactNode;

  /** 일반 헤더 컴포넌트 (제목/부제목, 타이머 등) - 자연스럽게 스크롤 */
  header?: ReactNode;

  /** FlatList 데이터 배열 */
  data: T[];

  /** FlatList renderItem 함수 */
  renderItem: FlatListProps<T>['renderItem'];

  /** FlatList keyExtractor */
  keyExtractor?: FlatListProps<T>['keyExtractor'];

  /** FlatList numColumns */
  numColumns?: number;

  /** FlatList contentContainerStyle */
  contentContainerStyle?: object;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;

  /** Collapsible 헤더 활성화 여부 (기본값: true) */
  enableCollapsibleHeader?: boolean;

  /** FlatList 스크롤 활성화 여부 (기본값: true) */
  scrollEnabled?: boolean;
}

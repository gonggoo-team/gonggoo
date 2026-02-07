/**
 * ProductGrid Type Definitions
 *
 * 상품 그리드 컴포넌트의 타입을 정의합니다.
 */

import type { ReactElement } from 'react';

/**
 * ProductGrid Props
 */
export interface ProductGridProps<T> {
  /** 표시할 상품 데이터 배열 */
  data: T[];

  /** 그리드 열 개수 (1=세로 리스트, 2=2열 그리드) */
  numColumns?: 1 | 2;

  /** 각 아이템을 렌더링하는 함수 */
  renderItem: (item: T, index: number) => ReactElement;

  /** 리스트 헤더 컴포넌트 (선택사항) */
  ListHeaderComponent?: ReactElement;

  /** 각 아이템의 고유 키를 추출하는 함수 */
  keyExtractor?: (item: T) => string;

  /** 커스텀 스타일 (컨테이너) */
  style?: object;

  /** 커스텀 contentContainerStyle */
  contentContainerStyle?: object;
}

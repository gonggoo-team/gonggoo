/**
 * SearchTag Types
 *
 * 검색 태그 컴포넌트 타입 정의
 */

import type { StyleProp, ViewStyle } from 'react-native';

/**
 * SearchTag Variant
 * - recent: 최근 검색어 (X 버튼 포함, 흰 배경, 회색 테두리)
 * - recommended: 추천 검색어 (X 버튼 없음, 회색 배경)
 */
export type SearchTagVariant = 'recent' | 'recommended';

/**
 * SearchTag Props
 */
export interface SearchTagProps {
  /** 검색어 텍스트 */
  text: string;

  /** 태그 변형 */
  variant: SearchTagVariant;

  /** 클릭 핸들러 (태그 클릭 시) */
  onPress?: (text: string) => void;

  /** 삭제 핸들러 (X 버튼 클릭 시, recent variant만) */
  onDelete?: (text: string) => void;

  /** 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;

  /** 테스트 ID */
  testID?: string;
}

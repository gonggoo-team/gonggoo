/**
 * PopularSearchItem Type Definitions
 *
 * 인기 검색어 아이템 컴포넌트의 타입을 정의합니다.
 */

import type { StyleProp, ViewStyle } from 'react-native';
import type { RankingIndicatorVariant } from '../RankingIndicator';

/**
 * PopularSearchItem Props
 */
export interface PopularSearchItemProps {
  /** 순위 번호 (1-10) */
  rank: number;

  /** 검색어 텍스트 (길이 제한 없음, 자동으로 말줄임 처리됨) */
  keyword: string;

  /** 순위 변동 상태 */
  rankingChange: RankingIndicatorVariant;

  /** 검색어 클릭 핸들러 */
  onPress?: (keyword: string) => void;

  /** 컨테이너 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 접근성 라벨 (기본값: "{rank}위 {keyword} {변동상태}") */
  accessibilityLabel?: string;

  /** 테스트 ID */
  testID?: string;
}

/**
 * PopularSearchItem Component
 *
 * 인기 검색어 아이템 컴포넌트입니다.
 * Figma 디자인 시스템의 검색창/인기순위 요소를 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=242-487&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 주요 기능:
 * - 순위 번호 표시 (1-10)
 * - 검색어 텍스트 (긴 텍스트는 자동 말줄임)
 * - 순위 변동 인디케이터 (상승/하락/유지)
 * - 클릭 이벤트 지원
 *
 * 반응형 디자인:
 * - 순위: 24px (고정)
 * - 검색어: flex: 1 (가변, 디바이스 크기에 따라 자동 조절)
 * - 인디케이터: 10px (고정)
 * - 모든 디바이스(320px~768px)에서 정상 작동
 *
 * 사용 예시:
 * ```tsx
 * <PopularSearchItem
 *   rank={1}
 *   keyword="동원참치 캔 20ea"
 *   rankingChange="down"
 *   onPress={(keyword) => handleSearch(keyword)}
 * />
 * ```
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { RankingIndicator } from '../RankingIndicator';
import { createPopularSearchItemStyles } from './PopularSearchItem.styles';
import type { PopularSearchItemProps } from './PopularSearchItem.types';

/**
 * PopularSearchItem Component
 */
export const PopularSearchItem: React.FC<PopularSearchItemProps> = ({
  rank,
  keyword,
  rankingChange,
  onPress,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = createPopularSearchItemStyles(theme);

  // 클릭 핸들러
  const handlePress = () => {
    onPress?.(keyword);
  };

  // 순위 변동 상태에 따른 접근성 라벨 생성
  const getRankingChangeLabel = () => {
    switch (rankingChange) {
      case 'up':
        return '순위 상승';
      case 'down':
        return '순위 하락';
      case 'maintain':
        return '순위 유지';
      default:
        return '';
    }
  };

  // 기본 접근성 라벨
  const defaultAccessibilityLabel = `${rank}위 ${keyword} ${getRankingChangeLabel()}`;

  // 컨테이너 컴포넌트 결정 (클릭 가능 여부)
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress
    ? {
        onPress: handlePress,
        activeOpacity: 0.7,
        accessibilityRole: 'button' as const,
        accessibilityLabel: accessibilityLabel || defaultAccessibilityLabel,
        testID: testID || `popular-search-item-${rank}`,
      }
    : {
        accessibilityRole: 'text' as const,
        accessibilityLabel: accessibilityLabel || defaultAccessibilityLabel,
        testID: testID || `popular-search-item-${rank}`,
      };

  return (
    <Container style={[styles.container, style]} {...containerProps}>
      {/* 순위 번호 */}
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>

      {/* 검색어 텍스트 (반응형: flex 1) */}
      <View style={styles.keywordContainer}>
        <Text
          style={styles.keywordText}
          numberOfLines={1} // 한 줄로 제한
          ellipsizeMode="tail" // 끝에 "..." 표시
        >
          {keyword}
        </Text>
      </View>

      {/* 순위 변동 인디케이터 */}
      <View style={styles.indicatorContainer}>
        <RankingIndicator variant={rankingChange} />
      </View>
    </Container>
  );
};

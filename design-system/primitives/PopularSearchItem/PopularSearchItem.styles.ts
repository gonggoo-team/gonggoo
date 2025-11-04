/**
 * PopularSearchItem Styles (Figma 기반, 완전 반응형)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 검색창/인기순위 요소 컴포넌트 기준
 * - 전체 레이아웃: row, alignItems: center, height: 16px
 * - 순위: 24×16px
 * - 검색어: flex: 1 (반응형, Figma 104px 참고값)
 * - 인디케이터: 10×10px
 *
 * 반응형 처리:
 * - 검색어 영역은 flex: 1로 가변 처리
 * - numberOfLines={1}, ellipsizeMode="tail"로 긴 텍스트 말줄임
 * - 모든 디바이스(320px~768px)에서 정상 작동
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createPopularSearchItemStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container (Figma: row, alignItems center, height 16px)
    // 터치 영역 확보를 위해 paddingVertical 추가
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs, // 8px - 요소 간 간격
      paddingVertical: theme.spacing.xs, // 8px - 터치 영역 확보 (총 높이 32px)
      minHeight: 32, // 접근성을 위한 최소 터치 영역      
    },

    // Rank Container (Figma: 24×16px)
    rankContainer: {
      width: 24,
      height: 16,
      justifyContent: 'center',
      alignItems: 'flex-start', // 순위 번호 왼쪽 정렬
    },

    // Rank Text (Figma: fontSize 13, fontWeight 500, color #181A1A)
    rankText: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px
      fontWeight: theme.typography.fontWeight.medium, // '500'
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs13), // -0.325
      lineHeight: 16, // Figma 기준
    },

    // Keyword Text Container (2열 그리드 대응 반응형)
    // Figma에서는 104px이지만, 2열 레이아웃에서는 더 작아질 수 있음
    keywordContainer: {
      flex: 1,          // 남은 공간 모두 차지 (2열에서 중요)
      flexShrink: 1,    // 화면이 좁을 때 줄어들도록 함 (말줄임표 처리 필수)
      minWidth: 0,      // flex 아이템의 최소 너비를 0으로 설정 (말줄임 작동을 위해 필수)
      justifyContent: 'center',
    },

    // Keyword Text (Figma: fontSize 13, fontWeight 500, color #181A1A)
    // numberOfLines와 ellipsizeMode는 컴포넌트에서 직접 지정
    keywordText: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.xs13, // 13px
      fontWeight: theme.typography.fontWeight.medium, // '500'
      color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs13), // -0.325
      lineHeight: 16, // Figma 기준
    },

    // Indicator Container (Figma: 10×10px)
    indicatorContainer: {
      width: 10,
      height: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Pressable 상태 스타일
    // TouchableOpacity의 activeOpacity로 피드백 제공
    pressable: {
      // activeOpacity: 0.7 (컴포넌트에서 지정)
    },
  });

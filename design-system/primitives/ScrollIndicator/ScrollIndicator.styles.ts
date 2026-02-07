/**
 * ScrollIndicator Styles
 *
 * 스크롤 페이지네이션 인디케이터 컴포넌트의 스타일 정의입니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createScrollIndicatorStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 9, // Figma: 점 사이 간격 9px
      paddingVertical: 10, // 터치 영역 확보
    },
    dot: {
      width: 5.63, // Figma 정확한 크기
      height: 5.63,
      borderRadius: 5.63 / 2, // 완벽한 원형
    },
  });
};

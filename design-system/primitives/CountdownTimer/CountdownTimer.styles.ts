/**
 * CountdownTimer Styles
 *
 * 카운트다운 타이머 컴포넌트의 스타일 정의입니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createCountdownTimerStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10, // Figma: 아이콘과 시간 사이 10px
      paddingHorizontal: theme.spacing.lg, // 20px      
      paddingBottom: 10, // Figma 기준
      backgroundColor: theme.colors.surface.normal.bg1, // 배경색 추가 (고정 헤더와 동일)
    },
    iconContainer: {
      width: 24, // Figma 정확한 사이즈
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 25, // Figma 정확한 사이즈
      fontWeight: '600' as const, // semiBold
      lineHeight: 25 * 1.193, // Figma 기준
      letterSpacing: -0.025 * 25, // -2.5%
    },
  });
};

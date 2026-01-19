/**
 * CategoryTabBar Styles
 *
 * 메인 홈 상단 카테고리 바의 스타일입니다.
 * - 수평 스크롤 지원 (총 너비 490px = 70px × 7)
 * - 모든 디바이스에서 동작
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';

export const createCategoryTabBarStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      // paddingHorizontal: theme.spacing.lg,      // 20px
      // paddingTop: theme.spacing.md,              // 16px (GNB와의 간격)
      paddingBottom: theme.spacing.sm,           // 12px (콘텐츠와의 간격)
    },
    scrollView: {
      flexGrow: 0, // ScrollView가 필요한 만큼만 공간 차지
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

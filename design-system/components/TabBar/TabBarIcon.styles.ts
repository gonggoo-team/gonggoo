/**
 * TabBarIcon Styles
 *
 * Figma 디자인에 정확히 맞춘 스타일입니다.
 * - flex: 1로 완전 균등 분배 (minWidth/maxWidth 제거)
 * - height: 60px (탭 컨텐츠 영역, Figma 기준)
 * - paddingTop: 17px (아이콘 수직 위치, Figma 기준)
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=249-1477&m=dev
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme';

export const createTabBarIconStyles = (theme: Theme, focused: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1, // 5개 탭이 완전히 균등하게 공간 분배
      height: 60, // Figma 탭 컨텐츠 영역 높이 (60px)
      alignItems: 'center',
      justifyContent: 'flex-start', // 상단 기준 정렬
      paddingTop: 17, // Figma 아이콘 y 위치 (17px from top)
      gap: 4, // 아이콘과 텍스트 사이 간격
    },
    iconWrapper: {
      position: 'relative', // CountBadge의 absolute 위치 기준
      width: 24, // 아이콘 크기
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: theme.typography.fontSize.xs, // 12px
      lineHeight: 16, // 16px (Figma 기준)
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: focused
        ? theme.colors.surface.texticon.onnormal.text.green // #006242 (선택됨)
        : theme.colors.surface.texticon.onnormal.icon.tabBar, // #9C9DA4 (선택 안됨)
    },
  });

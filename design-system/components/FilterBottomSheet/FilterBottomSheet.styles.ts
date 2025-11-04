/**
 * FilterBottomSheet Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: Component 43 기준
 * - borderRadius: 12px 12px 0 0
 * - backgroundColor: #FFFFFF
 * - 카테고리 탭: padding 0 20px 0 10px
 * - 버튼 영역: padding 0 14px, gap 7px
 * - Divider: #E1E1E1
 * - 옵션 리스트: column
 * - 하단 영역: padding 0 20px, gap 23px
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createFilterBottomSheetStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container (Figma: 375×492px, radius 12px 12px 0 0, bg #FFFFFF)
    container: {
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderTopLeftRadius: theme.radius.md, // 12px
      borderTopRightRadius: theme.radius.md, // 12px
      width: '100%',
      flex: 1,
    },

    // 카테고리 탭 영역 (Figma: padding 0 20px 0 10px)
    tabContainer: {
      paddingTop: 18,
      paddingBottom: 18,
    },

    // 버튼 영역 (Figma: padding 0 14px, gap 7px)
    // 현재 선택된 필터들을 pill 형태로 표시
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingHorizontal: 14,
      gap: 7,
      paddingVertical: 13,            
    },
    bottomAreaContainer: {
      paddingTop: 13, // 기존 buttonsContainer의 paddingBottom과 유사한 값으로 상단 여백 추가
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.lowEmp, // 시각적 구분을 위한 상단 경계선      
    },
    // Divider 영역
    dividerContainer: {
      width: '100%',
    },

    // 옵션 리스트 영역
    optionsContainer: {
      width: '100%',
      flex: 1,
      // backgroundColor: 'red'
    },

    optionsScrollView: {
      // maxHeight: 245, // Figma: 245px (5개 항목 정도)
    },

    // 하단 영역 (Figma: padding 0 20px, gap 23px)
    // 초기화 버튼 + 모집글 보기 버튼
    footerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 23,
    },

    // 초기화 버튼 영역
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4, // 아이콘과 텍스트 사이 간격
    },

    resetText: {
      fontFamily: 'Pretendard',
      fontSize: 13, // Figma 기준
      fontWeight: '500',
      color: '#D1D6DA', // Figma 기준
      letterSpacing: -0.325, // -2.5%
    },

    // 모집글 보기 버튼 영역
    applyButtonContainer: {
      flex: 1,
    },
  });

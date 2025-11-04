/**
 * TextField Styles (Figma 기반, 완전 반응형)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 * Figma: 텍스트입력창 컴포넌트 기준
 * - 크기: 335×45px (Figma 기준)
 * - 패딩: 13px 16px
 * - 테두리: #CACACA, 1px, radius 4px
 * - 배경: #FFFFFF
 * - 텍스트: Pretendard, 15px, 500, #000000
 * - Placeholder: #9FA7B1
 * - 커서: #006242, 1px, 17px
 *
 * 반응형 처리:
 * - 컨테이너: width: '100%' (부모에서 제어)
 * - Input: flex: 1 (가변)
 * - 모든 디바이스(320px~768px)에서 정상 작동
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createTextFieldStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container (Figma: 335×45px, border #CACACA, radius 4px, bg #FFFFFF)
    // 반응형: width 100%, 부모 컴포넌트에서 maxWidth 제어
    container: {
      width: '100%',
      height: 45, // Figma 기준 (inputHeight 토큰에 없음)
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1, // 커서와 텍스트 사이 간격
      paddingVertical: 13,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface.normal.bg1, // #FFFFFF
      borderWidth: theme.dimensions.borderWidth.thin, // 1px
      borderColor: theme.colors.border.midEmp, // #CACACA
      borderRadius: theme.radius.xs, // 4px
    },

    // Input Wrapper (커서와 함께 flex로 배치)
    inputWrapper: {
      flex: 1, // ⭐ 남은 공간 모두 차지 (반응형의 핵심)
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1, // 커서와 텍스트 사이 간격
    },

    // Input Text (Figma: Pretendard, 15px, 500, #000000)
    input: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.primary, // Pretendard
      fontSize: 15, // Figma 기준 (fontSize 토큰에 sm15 없음)
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #000000
      letterSpacing: theme.typography.getLetterSpacing(15), // -0.375
      lineHeight: 18, // Figma: 1.193359375em ≈ 17.9px → 18px
      padding: 0, // React Native 기본 padding 제거
      height: '100%',
    },

    // Cursor Line (Figma: #006242, 1px, 17px)
    // 포커스 상태일 때만 표시
    cursor: {
      width: 1,
      height: 17, // Figma 기준
      backgroundColor: theme.colors.surface.brand.primary, // #006242
    },
  });

/**
 * PriceRangeSlider Styles (Figma 기반, 디자인 토큰 사용)
 *
 * 모든 스타일은 design-system/tokens에서 가져온 값을 사용합니다.
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '../../theme/types';

export const createPriceRangeSliderStyles = (theme: Theme) =>
  StyleSheet.create({
    // Container
    container: {
      paddingVertical: theme.spacing.sm, // 12px
      paddingHorizontal: theme.spacing.lg, // 20px (Figma 기준)
    },

    // Label Container (슬라이더 위에 배치)
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs, // 8px (슬라이더 위로 이동)
      paddingHorizontal: 2, // 레이블과 컨테이너 경계 사이 최소 여백
    },

    // Label Text (최소/최대 가격 표시)
    labelText: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm, // 14px
      fontWeight: theme.typography.fontWeight.medium, // 500
      color: theme.colors.surface.texticon.onnormal.text.black, // #000000
      letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
      flexShrink: 1, // 긴 가격 텍스트가 화면을 넘어가지 않도록      
    },

    // Track Container
    trackContainer: {
      height: 44, // 터치 타겟 최소 크기 보장
      justifyContent: 'center',
      position: 'relative',
      marginTop: theme.spacing.sm, // 12px      
    },

    // Track Background
    trackBackground: {
      height: 4,
      backgroundColor: theme.colors.border.lowEmp, // #E1E1E1 (연한 회색)
      borderRadius: 2,            
    },

    // Track Selected (선택된 범위)
    trackSelected: {
      position: 'absolute',
      height: 4,
      backgroundColor: theme.colors.surface.brand.primary, // #006242 (브랜드 그린)
      borderRadius: 2,      
    },

    // Handle (핸들)
    handle: {
      position: 'absolute',
      width: 44, // 터치 타겟 최소 크기
      height: 44, // 터치 타겟 최소 크기
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,            
    },

    // Handle Inner (실제 보이는 핸들 원)
    handleInner: {
      width: 16, // Figma 디자인 기준
      height: 16, // Figma 디자인 기준
      borderRadius: 8,
      backgroundColor: theme.colors.surface.brand.primary, // #006242 (브랜드 그린)
      // 그림자 효과 (더 부드럽고 프리미엄하게)
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5, // Android 그림자
    },

    // Handle Active (드래그 중) - Animated.Value로 대체됨, fallback용으로 유지
    handleActive: {
      // Animated scale이 우선 적용되므로 이 스타일은 fallback으로만 사용됨
    },

    // Disabled State
    disabled: {
      opacity: theme.dimensions.opacity.disabled, // 0.6
    },
  });

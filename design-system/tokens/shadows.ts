import { ViewStyle } from 'react-native';

/**
 * Shadow Design Tokens
 *
 * 그림자 효과 관련 토큰입니다.
 * React Native의 iOS와 Android 모두에서 작동하는 그림자를 정의합니다.
 *
 * 수정 시 주의사항:
 * 1. iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius 사용
 * 2. Android: elevation 사용
 * 3. 웹: boxShadow 사용 (별도 처리 필요)
 */

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

export const shadows = {
  /** 그림자 없음 */
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ShadowStyle,

  /** 아주 약한 그림자 */
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ShadowStyle,

  /** 약한 그림자 */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ShadowStyle,

  /** 기본 그림자 */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  } as ShadowStyle,

  /** 강한 그림자 */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  } as ShadowStyle,

  /** 아주 강한 그림자 */
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  } as ShadowStyle,

  /** 극도로 강한 그림자 */
  xxl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  } as ShadowStyle,

  /** Dropdown 전용 그림자 (Figma: 0px 7px 29px rgba(100, 100, 111, 0.2)) */
  dropdown: {
    shadowColor: '#646470',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 29,
    elevation: 7,
  } as ShadowStyle,
} as const;

/**
 * Shadows 타입 추출
 */
export type Shadows = typeof shadows;

/**
 * Shadow 키 타입
 */
export type ShadowKey = keyof typeof shadows;

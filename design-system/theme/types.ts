/**
 * Theme Type Definitions
 *
 * 테마 시스템의 TypeScript 타입을 정의합니다.
 */

import type {
  Colors,
  Spacing,
  Typography,
  Radius,
  Shadows,
  Dimensions,
} from '../tokens';

/**
 * Theme 인터페이스
 * 전체 디자인 시스템의 테마 구조를 정의
 */
export interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  radius: Radius;
  shadows: Shadows;
  dimensions: Dimensions;
}

/**
 * Theme Mode
 * 향후 다크모드 등 추가를 위한 타입
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme Context 타입
 * React Context에서 사용할 타입
 */
export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

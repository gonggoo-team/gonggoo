/**
 * Theme Configuration
 *
 * 디자인 토큰을 통합한 테마 객체입니다.
 *
 * 사용 예시:
 * import { theme } from '@/design-system/theme';
 * const backgroundColor = theme.colors.surface.background1;
 */

import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  dimensions,
} from '../tokens';
import type { Theme } from './types';

/**
 * Light Theme (기본 테마)
 */
export const lightTheme: Theme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  dimensions,
};

/**
 * 기본 테마 (현재는 Light Theme)
 * 향후 다크모드 추가 시 동적으로 변경 가능
 */
export const theme = lightTheme;

/**
 * 테마 타입 export
 */
export type { Theme } from './types';

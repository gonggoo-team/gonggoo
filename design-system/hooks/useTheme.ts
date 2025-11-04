/**
 * useTheme Hook
 *
 * 컴포넌트에서 테마에 접근하기 위한 커스텀 훅입니다.
 *
 * 사용 예시:
 * const { theme, mode, setMode } = useTheme();
 * const backgroundColor = theme.colors.surface.background1;
 */

import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';
import type { ThemeContextValue } from '../theme/types';

/**
 * useTheme Hook
 *
 * @throws {Error} ThemeProvider 외부에서 사용 시 에러 발생
 * @returns {ThemeContextValue} 테마 컨텍스트 값
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Wrap your app with <ThemeProvider> to use this hook.'
    );
  }

  return context;
}

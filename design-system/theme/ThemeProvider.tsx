/**
 * Theme Provider
 *
 * 앱 전체에 테마를 제공하는 Context Provider입니다.
 *
 * 사용 예시:
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */

import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { theme as defaultTheme } from './theme';
import type { Theme, ThemeMode, ThemeContextValue } from './types';

/**
 * Theme Context
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  children: ReactNode;
  /** 초기 테마 모드 */
  initialMode?: ThemeMode;
  /** 커스텀 테마 (선택사항) */
  customTheme?: Theme;
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({
  children,
  initialMode = 'light',
  customTheme,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: customTheme || defaultTheme,
      mode,
      setMode,
    }),
    [customTheme, mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

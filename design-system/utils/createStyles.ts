/**
 * createStyles Utility
 *
 * 테마 기반의 타입 안전한 스타일을 생성하는 유틸리티 함수입니다.
 *
 * 사용 예시:
 * import { createStyles } from '@/design-system/utils';
 * import { useTheme } from '@/design-system/hooks';
 *
 * const Component = () => {
 *   const { theme } = useTheme();
 *   const styles = createStyles(theme);
 *   return <View style={styles.container} />;
 * };
 *
 * const createStyles = (theme: Theme) => StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.surface.background1,
 *     padding: theme.spacing.md,
 *   },
 * });
 */

import { StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { Theme } from '../theme/types';

/**
 * Named Styles 타입
 * StyleSheet.create의 인자 타입
 */
export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

/**
 * Style Creator 함수 타입
 */
export type StyleCreator<T extends NamedStyles<T>> = (theme: Theme) => T;

/**
 * createStyles
 *
 * 테마를 인자로 받아 StyleSheet를 생성하는 함수를 반환합니다.
 *
 * @param styleCreator - 테마를 받아서 스타일 객체를 반환하는 함수
 * @returns 테마를 받아서 생성된 StyleSheet를 반환하는 함수
 *
 * @example
 * ```tsx
 * const useStyles = createStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.surface.background1,
 *     padding: theme.spacing.md,
 *   },
 *   text: {
 *     fontSize: theme.typography.fontSize.md,
 *     color: theme.colors.text.primary,
 *   },
 * }));
 *
 * // 컴포넌트에서 사용
 * const Component = () => {
 *   const { theme } = useTheme();
 *   const styles = useStyles(theme);
 *   return <View style={styles.container}><Text style={styles.text}>Hello</Text></View>;
 * };
 * ```
 */
export function createStyles<T extends NamedStyles<T>>(
  styleCreator: (theme: Theme) => T
) {
  return (theme: Theme) => StyleSheet.create(styleCreator(theme));
}

/**
 * makeStyles (Alternative API)
 *
 * 테마를 자동으로 주입받아 스타일을 생성하는 훅을 만드는 함수입니다.
 * useTheme과 함께 사용하면 더 편리합니다.
 *
 * @param styleCreator - 테마를 받아서 스타일 객체를 반환하는 함수
 * @returns useTheme과 함께 사용할 수 있는 훅
 *
 * @example
 * ```tsx
 * const useStyles = makeStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.surface.background1,
 *   },
 * }));
 *
 * // 컴포넌트에서 사용
 * const Component = () => {
 *   const styles = useStyles();  // 자동으로 theme이 주입됨
 *   return <View style={styles.container} />;
 * };
 * ```
 */
export function makeStyles<T extends NamedStyles<T>>(
  styleCreator: (theme: Theme) => T
) {
  let cachedStyles: ReturnType<typeof StyleSheet.create<T>> | null = null;
  let cachedTheme: Theme | null = null;

  return (theme: Theme) => {
    // 테마가 변경되었을 때만 스타일 재생성
    if (cachedTheme !== theme) {
      cachedStyles = StyleSheet.create(styleCreator(theme));
      cachedTheme = theme;
    }
    return cachedStyles!;
  };
}

import { useRouter, type Href } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * useThrottledNavigation
 *
 * 중복 네비게이션을 방지하는 throttled navigation hook입니다.
 *
 * 기능:
 * - Throttling으로 빠른 연속 클릭 방지 (기본 1초)
 * - push와 back 함수 모두 제공
 * - 메모리 누수 방지를 위한 자동 정리
 *
 * @param throttleTime - Throttle 시간 (기본값: 1000ms)
 * @returns { push, back } - throttled navigation functions
 *
 * @example
 * ```tsx
 * // push만 사용하는 경우
 * const { push } = useThrottledNavigation();
 * <Button onPress={() => push('/product/123')} />
 *
 * // back도 사용하는 경우
 * const { push, back } = useThrottledNavigation();
 * <Button onPress={back} />
 * ```
 */
export function useThrottledNavigation(throttleTime: number = 1000) {
  const router = useRouter();
  const lastCallTimeRef = useRef<number>(0);

  const push = useCallback(
    (href: Href) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Throttle 시간 내 중복 호출 방지
      if (timeSinceLastCall < throttleTime) {
        console.log(
          `[Navigation] Throttled: ${throttleTime - timeSinceLastCall}ms remaining`
        );
        return;
      }

      lastCallTimeRef.current = now;

      try {
        router.push(href);
        console.log('[Navigation] Success:', href);
      } catch (error) {
        console.error('[Navigation] Error:', error);
      }
    },
    [router, throttleTime]
  );

  const back = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;

    // Throttle 시간 내 중복 호출 방지
    if (timeSinceLastCall < throttleTime) {
      console.log(
        `[Navigation Back] Throttled: ${throttleTime - timeSinceLastCall}ms remaining`
      );
      return;
    }

    lastCallTimeRef.current = now;

    try {
      router.back();
      console.log('[Navigation Back] Success');
    } catch (error) {
      console.error('[Navigation Back] Error:', error);
    }
  }, [router, throttleTime]);

  return { push, back };
}

/**
 * useThrottledNavigationWithBack
 *
 * 하위 호환성을 위한 alias입니다.
 * useThrottledNavigation과 동일한 기능을 제공합니다.
 *
 * @deprecated useThrottledNavigation을 직접 사용하세요.
 */
export function useThrottledNavigationWithBack(throttleTime: number = 1000) {
  return useThrottledNavigation(throttleTime);
}

/**
 * useThrottledCallback
 *
 * 일반적인 callback을 throttle하는 hook입니다.
 * Navigation이 아닌 다른 용도로도 사용 가능합니다.
 *
 * @param callback - Throttle할 함수
 * @param throttleTime - Throttle 시간 (기본값: 1000ms)
 * @returns throttled callback
 *
 * @example
 * ```tsx
 * const handleLike = useThrottledCallback((id: string) => {
 *   console.log('Liked:', id);
 * }, 500);
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => void>(
  callback: T,
  throttleTime: number = 1000
): T {
  const lastCallTimeRef = useRef<number>(0);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (timeSinceLastCall < throttleTime) {
        console.log(`[Throttle] Blocked: ${throttleTime - timeSinceLastCall}ms remaining`);
        return;
      }

      lastCallTimeRef.current = now;
      callback(...args);
    }) as T,
    [callback, throttleTime]
  );
}

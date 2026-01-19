import { useCallback, useRef } from 'react';
import { useRouter, type Href } from 'expo-router';

/**
 * useThrottledNavigation
 *
 * 중복 네비게이션을 방지하는 Zero-Rendering-Cost Navigation Hook입니다.
 *
 * 최적화 사항:
 * 1. useState 제거: 모든 상태를 useRef로 관리하여 리렌더링 비용을 0으로 만듦
 * 2. useFocusEffect 제거: 시간 기반 throttle만으로 충분한 보호 제공
 * 3. 즉각적인 네비게이션: 상태 업데이트 대기 없이 바로 화면 전환 시작
 *
 * @param options - Throttle 시간 설정 옵션 (pushTime, backTime)
 * @returns { push, back } - throttled navigation functions
 */
export function useThrottledNavigation(options: { pushTime?: number; backTime?: number } = {}) {
  const { pushTime = 300, backTime = 300 } = options;
  const router = useRouter();

  // 모든 상태를 ref로 관리하여 리렌더링 방지
  const lastPushCallTimeRef = useRef<number>(0);
  const lastBackCallTimeRef = useRef<number>(0);
  const isNavigatingRef = useRef<boolean>(false);

  const push = useCallback(
    (href: Href) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastPushCallTimeRef.current;

      // 1. 시간 기반 Throttle: 설정된 시간 내 중복 호출 방지
      if (timeSinceLastCall < pushTime) {
        if (__DEV__) {
          console.log(`[Navigation Push] 🚫 Throttled: ${pushTime - timeSinceLastCall}ms remaining`);
        }
        return;
      }

      // 2. 상태 기반 Throttle: 네비게이션이 이미 진행 중인 경우 방지
      if (isNavigatingRef.current) {
        if (__DEV__) {
          console.log(`[Navigation Push] 🚫 Blocked: Navigation already in progress.`);
        }
        return;
      }

      // 플래그 설정 및 시간 업데이트 (동기적으로 즉시 적용)
      isNavigatingRef.current = true;
      lastPushCallTimeRef.current = now;

      try {
        router.push(href);
        if (__DEV__) {
          console.log('[Navigation Push] ✅ Success:', href);
        }

        // 네비게이션 완료 후 플래그 해제 (애니메이션 시간 고려)
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, pushTime);
      } catch (error) {
        // 에러 발생 시 플래그와 시간을 롤백하여 재시도 가능하게 함
        console.error('[Navigation Push] ❌ Error:', error);
        isNavigatingRef.current = false;
        lastPushCallTimeRef.current = 0;
      }
    },
    [router, pushTime]
  );

  const back = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastBackCallTimeRef.current;

    // 1. 시간 기반 Throttle
    if (timeSinceLastCall < backTime) {
      if (__DEV__) {
        console.log(`[Navigation Back] 🚫 Throttled: ${backTime - timeSinceLastCall}ms remaining`);
      }
      return;
    }

    // 2. 상태 기반 Throttle
    if (isNavigatingRef.current) {
      if (__DEV__) {
        console.log(`[Navigation Back] 🚫 Blocked: Navigation already in progress.`);
      }
      return;
    }

    // 플래그 설정 및 시간 업데이트 (동기적으로 즉시 적용)
    isNavigatingRef.current = true;
    lastBackCallTimeRef.current = now;

    try {
      router.back();
      if (__DEV__) {
        console.log('[Navigation Back] ✅ Success');
      }

      // 네비게이션 완료 후 플래그 해제
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, backTime);
    } catch (error) {
      // 에러 발생 시 롤백
      console.error('[Navigation Back] ❌ Error:', error);
      isNavigatingRef.current = false;
      lastBackCallTimeRef.current = 0;
    }
  }, [router, backTime]);

  return { push, back };
}

/**
 * useThrottledCallback
 * 일반적인 callback을 throttle하는 hook입니다.
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  throttleTime: number = 300
): T {
  const lastCallTimeRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      if (timeSinceLastCall < throttleTime) {
        if (__DEV__) {
          console.log(`[Throttle] 🚫 Blocked: ${throttleTime - timeSinceLastCall}ms remaining`);
        }
        return;
      }

      lastCallTimeRef.current = now;
      callback(...args);
    }) as T,
    [callback, throttleTime]
  );
}

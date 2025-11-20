import { useCallback, useRef, useState } from 'react';
import { useRouter, type Href, useFocusEffect } from 'expo-router';

// 네비게이션 Transition 상태를 확인하는 기능은 expo-router의 내부 API를 직접 사용하기 어렵습니다.
// 따라서, 가장 견고한 방법은 React Navigation의 상태를 활용하거나,
// 간단하게는 useFocusEffect를 사용하여 화면 포커스 상태를 기준으로 Transition 완료를 간접적으로 판단하는 것입니다.
// 여기서는 시간 기반 Throttling을 유지하되, 상태 변수를 추가하여 견고성을 높입니다.

/**
 * useThrottledNavigation
 *
 * 중복 네비게이션을 방지하는 Throttled Navigation Hook입니다.
 *
 * 주요 보완 사항:
 * 1. 상태 기반 제어: `isNavigating` 상태를 추가하여, 네비게이션이 활성화된 동안 중복 호출을 막습니다.
 * 2. Throttle 시간 유연성: push와 back에 개별 Throttle 시간을 적용할 수 있도록 개선했습니다.
 * 3. `useFocusEffect`를 활용한 상태 초기화: 화면이 다시 포커스될 때 상태를 초기화하여, 네비게이션 완료를 간접적으로 처리합니다.
 *
 * @param options - Throttle 시간 설정 옵션 (pushTime, backTime)
 * @returns { push, back } - throttled navigation functions
 */
export function useThrottledNavigation(options: { pushTime?: number; backTime?: number } = {}) {
  const { pushTime = 300, backTime = 300 } = options;
  const router = useRouter();
  const lastPushCallTimeRef = useRef<number>(0);
  const lastBackCallTimeRef = useRef<number>(0);
  
  // 네비게이션이 진행 중임을 나타내는 상태 (상태 기반 제어를 위한 핵심 보완)
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // 화면이 완전히 포커스될 때 (Transition 완료 후), isNavigating 상태를 초기화합니다.
  // 이는 네이티브 스택 전환이 완료되었음을 간접적으로 알리는 신호로 사용됩니다.
  useFocusEffect(
    useCallback(() => {
      // 화면이 포커스되면 네비게이션은 완료된 것으로 간주합니다.
      setIsNavigating(false);
      
      // cleanup 함수는 화면이 언포커스될 때 (네비게이션 시작 시) 실행됩니다.
      return () => {
        // 네비게이션 시작 시 즉시 true로 설정하여 중복 호출 방지 플래그를 올릴 수 있으나,
        // 여기서는 push/back 함수 내부에서 설정하는 것이 더 명확합니다.
      };
    }, [])
  );

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
      if (isNavigating) {
         if (__DEV__) {
          console.log(`[Navigation Push] 🚫 Blocked: Navigation already in progress.`);
        }
        return;
      }
      
      // 플래그 설정 및 시간 업데이트
      setIsNavigating(true); 
      lastPushCallTimeRef.current = now;

      try {
        router.push(href);
        if (__DEV__) {
          console.log('[Navigation Push] ✅ Success:', href);
        }
      } catch (error) {
        // 에러 발생 시 플래그와 시간을 롤백하여 재시도 가능하게 함
        console.error('[Navigation Push] ❌ Error:', error);
        setIsNavigating(false);
        lastPushCallTimeRef.current = 0; // 롤백
      }
    },
    [router, pushTime, isNavigating]
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
    if (isNavigating) {
         if (__DEV__) {
          console.log(`[Navigation Back] 🚫 Blocked: Navigation already in progress.`);
        }
        return;
    }

    // 플래그 설정 및 시간 업데이트
    setIsNavigating(true);
    lastBackCallTimeRef.current = now;

    try {
      router.back();
      if (__DEV__) {
        console.log('[Navigation Back] ✅ Success');
      }
    } catch (error) {
      // 에러 발생 시 롤백
      console.error('[Navigation Back] ❌ Error:', error);
      setIsNavigating(false);
      lastBackCallTimeRef.current = 0; // 롤백
    }
  }, [router, backTime, isNavigating]);

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
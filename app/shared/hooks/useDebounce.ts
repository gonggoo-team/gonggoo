/**
 * useDebounce Hook
 *
 * 함수 호출을 디바운싱하여 지정된 시간 동안 대기한 후 실행합니다.
 * 지도 카메라 변경 시 역지오코딩 API 호출 최적화에 사용됩니다.
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Debounce hook for function calls
 * @param callback - 디바운싱할 함수
 * @param delay - 딜레이 시간 (밀리초)
 * @returns 디바운싱된 함수
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // 기존 타이머가 있으면 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 새 타이머 설정
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

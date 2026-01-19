import { useEffect, useState, useRef, useCallback } from 'react';
import { InteractionManager, InteractionManagerStatic } from 'react-native';

type InteractionHandle = ReturnType<InteractionManagerStatic['runAfterInteractions']>;

interface UseAfterInteractionsOptions {
  /**
   * 애니메이션 완료 후 추가 지연 시간 (ms)
   * 기본값: 0
   */
  delay?: number;
}

interface UseAfterInteractionsReturn {
  /**
   * 인터랙션(화면 전환 애니메이션)이 완료되었는지 여부
   * true가 되면 무거운 렌더링이나 API 호출을 시작해도 됨
   */
  isReady: boolean;
}

/**
 * useAfterInteractions
 *
 * 화면 전환 애니메이션이 완료된 후 무거운 작업을 수행할 수 있도록 하는 훅입니다.
 * InteractionManager.runAfterInteractions를 사용하여 애니메이션이 끊기는 현상을 방지합니다.
 *
 * @example
 * ```tsx
 * function ProductDetailScreen() {
 *   const { isReady } = useAfterInteractions();
 *   const [product, setProduct] = useState(null);
 *
 *   useEffect(() => {
 *     if (isReady) {
 *       // 화면 전환 애니메이션 완료 후 API 호출
 *       fetchProductDetail().then(setProduct);
 *     }
 *   }, [isReady]);
 *
 *   if (!isReady) {
 *     return <LoadingSkeleton />;
 *   }
 *
 *   return <ProductContent product={product} />;
 * }
 * ```
 *
 * @param options - 옵션 (delay: 추가 지연 시간)
 * @returns { isReady } - 인터랙션 완료 여부
 */
export function useAfterInteractions(
  options: UseAfterInteractionsOptions = {}
): UseAfterInteractionsReturn {
  const { delay = 0 } = options;
  const [isReady, setIsReady] = useState(false);
  const interactionHandleRef = useRef<InteractionHandle | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // InteractionManager를 사용하여 모든 인터랙션(애니메이션 등)이 완료될 때까지 대기
    interactionHandleRef.current = InteractionManager.runAfterInteractions(() => {
      if (delay > 0) {
        // 추가 지연이 필요한 경우
        timeoutRef.current = setTimeout(() => {
          setIsReady(true);
        }, delay);
      } else {
        setIsReady(true);
      }
    });

    // Cleanup: 컴포넌트 언마운트 시 대기 중인 작업 취소
    return () => {
      if (interactionHandleRef.current) {
        interactionHandleRef.current.cancel();
        interactionHandleRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [delay]);

  return { isReady };
}

interface UseAfterInteractionsCallbackOptions {
  /**
   * 애니메이션 완료 후 추가 지연 시간 (ms)
   * 기본값: 0
   */
  delay?: number;
}

/**
 * useAfterInteractionsCallback
 *
 * 화면 전환 애니메이션이 완료된 후 특정 콜백을 실행하는 훅입니다.
 * useEffect와 함께 사용하기 좋은 패턴입니다.
 *
 * @example
 * ```tsx
 * function ChatDetailScreen() {
 *   const [messages, setMessages] = useState([]);
 *   const runAfterInteractions = useAfterInteractionsCallback();
 *
 *   useEffect(() => {
 *     runAfterInteractions(async () => {
 *       // 화면 전환 애니메이션 완료 후 메시지 로드
 *       const data = await fetchMessages();
 *       setMessages(data);
 *     });
 *   }, [runAfterInteractions]);
 *
 *   return <MessageList messages={messages} />;
 * }
 * ```
 *
 * @param options - 옵션 (delay: 추가 지연 시간)
 * @returns runAfterInteractions - 콜백을 인터랙션 완료 후 실행하는 함수
 */
export function useAfterInteractionsCallback(
  options: UseAfterInteractionsCallbackOptions = {}
): (callback: () => void | Promise<void>) => () => void {
  const { delay = 0 } = options;

  return useCallback(
    (callback: () => void | Promise<void>) => {
      let isCancelled = false;
      let timeoutId: NodeJS.Timeout | null = null;

      const handle = InteractionManager.runAfterInteractions(() => {
        if (isCancelled) return;

        if (delay > 0) {
          timeoutId = setTimeout(() => {
            if (!isCancelled) {
              callback();
            }
          }, delay);
        } else {
          callback();
        }
      });

      // Cleanup 함수 반환
      return () => {
        isCancelled = true;
        handle.cancel();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [delay]
  );
}

/**
 * useDeferredData
 *
 * 화면 전환 애니메이션 완료 후 데이터를 로드하는 통합 훅입니다.
 * isReady 상태와 데이터 fetching을 한 번에 처리합니다.
 *
 * @example
 * ```tsx
 * function ProductDetailScreen({ productId }: { productId: string }) {
 *   const {
 *     isReady,
 *     data: product,
 *     isLoading,
 *     error,
 *     refetch,
 *   } = useDeferredData(
 *     () => fetchProductDetail(productId),
 *     [productId]
 *   );
 *
 *   if (!isReady || isLoading) {
 *     return <LoadingSkeleton />;
 *   }
 *
 *   if (error) {
 *     return <ErrorView error={error} onRetry={refetch} />;
 *   }
 *
 *   return <ProductContent product={product} />;
 * }
 * ```
 *
 * @param fetcher - 데이터를 가져오는 async 함수
 * @param deps - useEffect 의존성 배열
 * @param options - 옵션 (delay: 추가 지연 시간)
 */
export function useDeferredData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAfterInteractionsOptions = {}
): {
  isReady: boolean;
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { isReady } = useAfterInteractions(options);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, ...deps]);

  return {
    isReady,
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

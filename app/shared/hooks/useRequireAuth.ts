/**
 * useRequireAuth Hook (Alert 기반)
 *
 * 인증이 필요한 기능에 대한 접근 제어를 제공하는 훅입니다.
 * 게스트 사용자가 보호된 기능에 접근하려고 할 때 Alert를 표시합니다.
 *
 * @example
 * ```tsx
 * const { requireAuth } = useRequireAuth();
 *
 * const handleProtectedAction = () => {
 *   requireAuth(() => {
 *     // 로그인된 사용자만 실행되는 코드
 *     console.log('Protected action executed');
 *   });
 * };
 * ```
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/app/shared/contexts';

interface UseRequireAuthReturn {
  /**
   * 인증이 필요한 작업을 실행합니다.
   * 로그인되지 않은 경우 Alert를 표시하고 작업을 실행하지 않습니다.
   *
   * @param action - 인증된 사용자만 실행할 작업
   * @returns 작업이 실행되었는지 여부
   */
  requireAuth: (action: () => void) => boolean;

  /**
   * 현재 인증 상태
   */
  isAuthenticated: boolean;
}

/**
 * useRequireAuth Hook
 */
export function useRequireAuth(): UseRequireAuthReturn {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  /**
   * 인증 확인 및 작업 실행
   */
  const requireAuth = useCallback(
    (action: () => void): boolean => {
      if (isAuthenticated) {
        action();
        return true;
      } else {
        // Alert 표시
        Alert.alert(
          '로그인이 필요한 기능이에요',
          '로그인하고 모든 기능을 이용해보세요!',
          [
            {
              text: '둘러보기 계속하기',
              style: 'cancel',
            },
            {
              text: '회원가입',
              onPress: () => router.push('/signup'),
            },
            {
              text: '로그인',
              onPress: () => router.push('/login'),
            },
          ],
          { cancelable: true }
        );
        return false;
      }
    },
    [isAuthenticated, router]
  );

  return {
    requireAuth,
    isAuthenticated,
  };
}

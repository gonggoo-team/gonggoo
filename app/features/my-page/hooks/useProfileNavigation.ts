import { useCallback } from 'react';
import { useThrottledNavigation } from '@/app/shared/hooks';
import type { ProfileMenuItem } from '@/app/shared/types';

/**
 * 프로필 네비게이션 Hook
 *
 * 프로필 화면의 모든 네비게이션 핸들러를 관리합니다.
 * 각 버튼/메뉴 클릭 시 해당 화면으로 이동하는 로직을 제공합니다.
 * 홈 화면과 동일하게 throttled navigation을 적용하여 중복 클릭을 방지합니다.
 *
 * @returns 모든 네비게이션 핸들러 객체
 */
export function useProfileNavigation() {
  const { push } = useThrottledNavigation();

  // Navigation handlers for group buy stats
  const handleRecruitingPress = useCallback(() => {
    push('/profile/recruiting-list');
  }, [push]);

  const handleRecruitmentCompletePress = useCallback(() => {
    push('/profile/recruitment-complete-list');
  }, [push]);

  const handleGroupCompletePress = useCallback(() => {
    push('/profile/group-complete-list');
  }, [push]);

  // Navigation handlers for participation stats
  const handleWishlistPress = useCallback(() => {
    push('/profile/wishlist');
  }, [push]);

  const handleJoinedPress = useCallback(() => {
    push('/profile/joined-list');
  }, [push]);

  const handleTransactionCompletePress = useCallback(() => {
    push('/profile/transaction-complete-list');
  }, [push]);

  // Settings handler
  const handleSettingsPress = useCallback(() => {
    push('/profile/settings');
  }, [push]);

  // My Info screen handler (프로필 클릭 시 내 정보 화면으로 이동)
  const handleProfilePress = useCallback(() => {
    push('/my-info');
  }, [push]);

  // Menu item handler
  const handleMenuItemPress = useCallback((item: ProfileMenuItem) => {
    if (item.route) {
      push(item.route as any);
    } else if (item.onPress) {
      item.onPress();
    }
  }, [push]);

  return {
    handleRecruitingPress,
    handleRecruitmentCompletePress,
    handleGroupCompletePress,
    handleWishlistPress,
    handleJoinedPress,
    handleTransactionCompletePress,
    handleSettingsPress,
    handleProfilePress,
    handleMenuItemPress,
  };
}

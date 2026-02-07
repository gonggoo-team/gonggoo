import { useProfileState } from './useProfileState';
import { useProfileNavigation } from './useProfileNavigation';

/**
 * 프로필 데이터 통합 Hook
 *
 * 프로필 화면에서 필요한 모든 데이터와 핸들러를 제공합니다.
 * 내부적으로 2개의 Hook을 조합하여 단일 책임 원칙을 준수합니다:
 * - useProfileState: 데이터 관리
 * - useProfileNavigation: 네비게이션 핸들러
 *
 * 이미지 선택 기능은 프로필 수정 화면에서 구현됩니다.
 */
export function useProfileData() {
  // 1. 상태 관리
  const {
    userProfile,
    groupBuyStats,
    participationStats,
    menuItems,
  } = useProfileState();

  // 2. 네비게이션
  const navigation = useProfileNavigation();

  return {
    // 데이터
    userProfile,
    groupBuyStats,
    participationStats,
    menuItems,
    // 핸들러
    ...navigation,
  };
}

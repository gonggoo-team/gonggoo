import { useState, useMemo } from 'react';
import { useAuth } from '@/app/shared/contexts';
import {
  getMockGroupBuyStats,
  getMockParticipationStats,
  getMockProfileMenuItems,
} from '@/app/shared/services/mock';
import type {
  UserProfile,
  GroupBuyStats,
  ParticipationStats,
  ProfileMenuItem,
} from '@/app/shared/types';

/**
 * 프로필 상태 관리 Hook
 *
 * AuthContext의 사용자 데이터와 Mock 통계 데이터를 관리합니다.
 * 향후 API 연동 시 이 Hook만 수정하면 됩니다.
 *
 * @returns userProfile - 사용자 프로필 데이터 (AuthContext에서 가져옴)
 * @returns setUserProfile - 프로필 업데이트 함수
 * @returns groupBuyStats - 공구 개설 통계
 * @returns participationStats - 공구 참여 통계
 * @returns menuItems - 프로필 메뉴 아이템 목록
 */
export function useProfileState() {
  const { user } = useAuth();

  // AuthContext의 user 데이터를 UserProfile 형식으로 변환
  const userProfile = useMemo<UserProfile>(() => ({
    nickname: user?.nickname || '사용자',
    profileImageUri: user?.profileImageUri,
  }), [user?.nickname, user?.profileImageUri]);

  const [groupBuyStats] = useState<GroupBuyStats>(getMockGroupBuyStats());
  const [participationStats] = useState<ParticipationStats>(getMockParticipationStats());
  const [menuItems] = useState<ProfileMenuItem[]>(getMockProfileMenuItems());

  return {
    userProfile,
    groupBuyStats,
    participationStats,
    menuItems,
  };
}

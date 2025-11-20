import { useState } from 'react';
import {
  getMockUserProfile,
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
 * Mock 데이터 로드 및 프로필 관련 상태를 관리합니다.
 * 향후 API 연동 시 이 Hook만 수정하면 됩니다.
 *
 * @returns userProfile - 사용자 프로필 데이터
 * @returns setUserProfile - 프로필 업데이트 함수
 * @returns groupBuyStats - 공구 개설 통계
 * @returns participationStats - 공구 참여 통계
 * @returns menuItems - 프로필 메뉴 아이템 목록
 */
export function useProfileState() {
  // Load initial data from mock
  const [userProfile, setUserProfile] = useState<UserProfile>(getMockUserProfile());
  const [groupBuyStats] = useState<GroupBuyStats>(getMockGroupBuyStats());
  const [participationStats] = useState<ParticipationStats>(getMockParticipationStats());
  const [menuItems] = useState<ProfileMenuItem[]>(getMockProfileMenuItems());

  return {
    userProfile,
    setUserProfile,
    groupBuyStats,
    participationStats,
    menuItems,
  };
}

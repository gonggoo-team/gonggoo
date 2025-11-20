/**
 * 사용자 프로필 관련 Mock 데이터
 */

import type {
  UserProfile,
  GroupBuyStats,
  ParticipationStats,
  ProfileMenuItem,
} from '@/app/shared/types';

/**
 * Mock 사용자 프로필 데이터
 * - 기본 닉네임: "만댱"
 * - 긴 닉네임 테스트를 위해 주석으로 다른 옵션 제공
 */
export const getMockUserProfile = (): UserProfile => ({
  id: '29493020',
  nickname: '만댱',
  // nickname: '아주아주아주아주긴닉네임테스트용입니다', // 긴 텍스트 테스트용
  // nickname: '😀😀😀😀😀😀😀😀', // 이모지 테스트용
  profileImageUri: undefined, // 기본 플레이스홀더 (회색 원형)
  email: 'mandang@gonggoo.com',
  phoneNumber: '01063312296',
  // 계좌 정보 (미설정 상태)
  refundBankName: undefined,
  refundAccountNumber: undefined,
  refundAccountHolder: undefined,
  depositBankName: undefined,
  depositAccountNumber: undefined,
  depositAccountHolder: undefined,
  // 주소 정보
  neighborhood: '청담동',
  address: '서울시 강남구 청담동',
});

/**
 * Mock 공구 개설 통계 데이터
 */
export const getMockGroupBuyStats = (): GroupBuyStats => ({
  recruiting: 3, // 모집 중
  recruitmentComplete: 5, // 모집 완료
  groupComplete: 12, // 공구 완료
});

/**
 * Mock 공구 참여 통계 데이터
 */
export const getMockParticipationStats = (): ParticipationStats => ({
  wishlist: 8, // 찜 목록
  joined: 15, // 참여 완료
  transactionComplete: 23, // 거래 완료
});

/**
 * Mock 프로필 메뉴 아이템 리스트
 * - route는 추후 실제 화면 구현 시 연결
 * - 현재는 stub 화면으로 이동
 */
export const getMockProfileMenuItems = (): ProfileMenuItem[] => [
  {
    id: 'recent-products',
    label: '최근 본 상품',
    route: '/recent-products',
  },
  {
    id: 'cancel-history',
    label: '취소 내역',
    route: '/cancel-history',
  },
  {
    id: 'my-reviews',
    label: '나의 후기',
    route: '/my-reviews',
  },
  {
    id: 'notification-settings',
    label: '알림 설정',
    route: '/notification-settings',
  },
  {
    id: 'customer-service',
    label: '고객센터',
    route: '/customer-service',
  },
  {
    id: 'notices',
    label: '공지사항',
    route: '/notices',
  },
];

/**
 * 긴 텍스트 테스트를 위한 메뉴 아이템 (개발/테스트용)
 */
export const getMockProfileMenuItemsWithLongText = (): ProfileMenuItem[] => [
  {
    id: 'recent-products',
    label: '최근 본 상품 아주아주 긴 메뉴 라벨 테스트용 텍스트입니다',
    route: '/recent-products',
  },
  {
    id: 'cancel-history',
    label: '취소 내역',
    route: '/cancel-history',
  },
  {
    id: 'my-reviews',
    label: '나의 후기',
    route: '/my-reviews',
  },
  {
    id: 'notification-settings',
    label: '알림 설정 및 푸시 알림 관리 메뉴',
    route: '/notification-settings',
  },
  {
    id: 'customer-service',
    label: '고객센터',
    route: '/customer-service',
  },
  {
    id: 'notices',
    label: '공지사항',
    route: '/notices',
  },
];

/**
 * 사용 가능한 은행 목록
 */
export const bankList = [
  '국민은행',
  '신한은행',
  '우리은행',
  'KB국민은행',
  '하나은행',
  '농협은행',
  'IBK기업은행',
  '카카오뱅크',
  '토스뱅크',
  'SC제일은행',
  '씨티은행',
  '새마을금고',
  '우체국',
  '신협',
  '저축은행',
] as const;

export type BankName = typeof bankList[number];

/**
 * 계좌 정보가 설정된 사용자 프로필 데이터 (테스트용)
 */
export const getMockUserProfileWithAccounts = (): UserProfile => ({
  ...getMockUserProfile(),
  refundBankName: '신한은행',
  refundAccountNumber: '110-123-456789',
  refundAccountHolder: '만댱',
  depositBankName: '국민은행',
  depositAccountNumber: '123-45-678901',
  depositAccountHolder: '만댱',
});

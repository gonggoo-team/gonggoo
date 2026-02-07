/**
 * 사용자 프로필 관련 타입 정의
 */

/**
 * 사용자 프로필 정보
 */
export interface UserProfile {
  id: string;
  nickname: string;
  profileImageUri?: string;
  email?: string;
  phoneNumber?: string;
  // 계좌 정보
  refundBankName?: string;      // 환불계좌 은행명
  refundAccountNumber?: string; // 환불계좌 번호
  refundAccountHolder?: string; // 환불계좌 예금주
  depositBankName?: string;     // 입금계좌 은행명
  depositAccountNumber?: string; // 입금계좌 번호
  depositAccountHolder?: string; // 입금계좌 예금주
  // 주소 정보
  neighborhood?: string;        // 동네 (예: 청담동)
  address?: string;             // 상세 주소
}

/**
 * 공구 개설 상태 타입
 */
export type GroupBuyStatusType =
  | 'recruiting' // 모집 중
  | 'recruitment-complete' // 모집 완료
  | 'group-complete'; // 공구 완료

/**
 * 공구 참여 상태 타입
 */
export type ParticipationStatusType =
  | 'wishlist' // 찜 목록
  | 'joined' // 참여 완료
  | 'transaction-complete'; // 거래 완료

/**
 * 나의 공구 개설 통계
 */
export interface GroupBuyStats {
  recruiting: number; // 모집 중 개수
  recruitmentComplete: number; // 모집 완료 개수
  groupComplete: number; // 공구 완료 개수
}

/**
 * 나의 공구 참여 통계
 */
export interface ParticipationStats {
  wishlist: number; // 찜 목록 개수
  joined: number; // 참여 완료 개수
  transactionComplete: number; // 거래 완료 개수
}

/**
 * 프로필 메뉴 아이템
 */
export interface ProfileMenuItem {
  id: string;
  label: string;
  value?: string; // 값 표시 (예: 회원번호 "29493020")
  route?: string;
  onPress?: () => void;
  showChevron?: boolean; // 화살표 아이콘 표시 여부
}

/**
 * 상태 버튼 아이템
 */
export interface StatusButtonItem {
  id: string;
  label: string;
  count: number;
  iconName: string;
  onPress: () => void;
}

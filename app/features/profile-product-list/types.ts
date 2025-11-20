/**
 * Profile Product List Types
 *
 * 프로필 관련 화면(모집 중, 모집 완료, 공구 완료, 찜 목록, 참여 완료, 거래 완료)에서 사용되는 타입 정의
 */

import type { SwipeableProductItem, ConfirmationModalProps } from '@/app/shared/components';

/**
 * 스와이프 액션 설정
 */
export interface SwipeActionConfig {
  /** 액션 라벨 (줄바꿈 지원: "공구\n수정") */
  label: string;
  /** 배경색 */
  backgroundColor: string;
  /** 텍스트 색상 */
  textColor: string;
  /** 버튼 너비 (px) */
  width: number;
  /** 확인 모달 설정 (선택적) */
  confirmModal?: {
    title: string;
    descriptions: string[];
    cancelText: string;
    confirmText: string;
  };
  /** 액션 실행 핸들러 */
  onPress: (item: SwipeableProductItem) => void;
}

/**
 * 화면 우측 버튼 설정
 */
export interface RightButtonConfig {
  /** 버튼 텍스트 */
  text: string;
  /** 버튼 스타일 variant */
  variant: 'primary' | 'secondary' | 'danger';
  /** 클릭 핸들러 (선택적, 기본: 전체 삭제) */
  onPress?: () => void;
}

/**
 * 빈 상태 설정
 */
export interface EmptyStateConfig {
  /** 메인 메시지 */
  message: string;
  /** 부가 설명 (선택적) */
  description?: string;
}

/**
 * 프로필 화면 설정
 */
export interface ProfileScreenConfig {
  /** GNB 타이틀 */
  screenTitle: string;

  /** 화면 상단 헤더 타이틀 (선택적) */
  headerTitle?: string;

  /** 화면 상단 헤더 부제목 (선택적) */
  headerSubtitle?: string;

  /** 상품 상태 타입 (필터링에 사용) */
  statusType: ProfileStatusType;

  /** GNB 우측 버튼 설정 (선택적) */
  rightButton?: RightButtonConfig;

  /** 스와이프 액션 목록 */
  swipeActions: SwipeActionConfig[];

  /** 빈 상태 설정 */
  emptyState: EmptyStateConfig;
}

/**
 * 프로필 상태 타입
 */
export type ProfileStatusType =
  | 'recruiting'              // 모집 중
  | 'recruitment-complete'    // 모집 완료
  | 'group-complete'          // 공구 완료
  | 'wishlist'                // 찜 목록
  | 'joined'                  // 참여 완료
  | 'transaction-complete';   // 거래 완료

/**
 * 확인 모달 설정
 * @deprecated ConfirmationModalProps를 사용하세요 (하위 호환성 유지)
 */
export type ConfirmationModalConfig = ConfirmationModalProps;

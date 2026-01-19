/**
 * useAccountDeletion Hook
 *
 * 회원 탈퇴 화면의 상태 및 로직을 관리하는 커스텀 훅
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

export interface UseAccountDeletionReturn {
  /** 동의 체크박스 상태 */
  isAgreed: boolean;
  /** 동의 체크박스 토글 핸들러 */
  toggleAgreement: () => void;
  /** 탈퇴 사유 텍스트 */
  feedbackText: string;
  /** 탈퇴 사유 텍스트 변경 핸들러 */
  setFeedbackText: (text: string) => void;
  /** 최종 확인 모달 표시 상태 */
  showConfirmModal: boolean;
  /** 회원 탈퇴 버튼 클릭 핸들러 (1단계 확인) */
  handleDeleteAccount: () => void;
  /** 최종 확인 모달에서 취소 핸들러 */
  handleCancelDeletion: () => void;
  /** 최종 확인 모달에서 탈퇴 확인 핸들러 (2단계 확인) */
  handleConfirmDeletion: () => void;
}

/**
 * 회원 탈퇴 로직을 관리하는 커스텀 훅
 */
export function useAccountDeletion(): UseAccountDeletionReturn {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /**
   * 동의 체크박스 토글
   */
  const toggleAgreement = useCallback(() => {
    setIsAgreed((prev) => !prev);
  }, []);

  /**
   * 회원 탈퇴 버튼 클릭 (1단계 확인)
   * 동의 체크 후에만 활성화되며, 최종 확인 모달을 표시합니다.
   */
  const handleDeleteAccount = useCallback(() => {
    if (!isAgreed) {
      return;
    }
    setShowConfirmModal(true);
  }, [isAgreed]);

  /**
   * 최종 확인 모달에서 취소
   */
  const handleCancelDeletion = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  /**
   * 최종 확인 모달에서 탈퇴 확인 (2단계 확인)
   * TODO: 실제 API 호출로 대체 필요
   */
  const handleConfirmDeletion = useCallback(() => {
    setShowConfirmModal(false);

    // TODO: 실제 회원 탈퇴 API 호출

    // 탈퇴 완료 후 처리
    // - 로그아웃
    // - 로그인 화면으로 이동
    // - 또는 탈퇴 완료 안내 화면으로 이동

    // 현재는 뒤로가기로 처리
    router.back();
  }, [router, feedbackText]);

  return {
    isAgreed,
    toggleAgreement,
    feedbackText,
    setFeedbackText,
    showConfirmModal,
    handleDeleteAccount,
    handleCancelDeletion,
    handleConfirmDeletion,
  };
}

/**
 * ConfirmationModal Types
 *
 * 삭제/취소 확인 모달에서 사용되는 타입 정의
 */

/**
 * ConfirmationModal Props
 */
export interface ConfirmationModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 타이틀 */
  title: string;
  /** 모달 설명 (배열: 각 줄) */
  descriptions: string[];
  /** 취소 버튼 텍스트 */
  cancelText: string;
  /** 확인 버튼 텍스트 */
  confirmText: string;
  /** 확인 버튼 색상 */
  confirmColor: string;
  /** 취소 핸들러 */
  onCancel: () => void;
  /** 확인 핸들러 */
  onConfirm: () => void;
}

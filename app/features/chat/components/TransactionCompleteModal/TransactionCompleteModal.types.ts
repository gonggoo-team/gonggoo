/**
 * TransactionCompleteModal Types
 */

export interface TransactionCompleteModalProps {
  /** 모달 표시 여부 */
  visible: boolean;

  /** 선택된 공구원 수 */
  selectedCount: number;

  /** 취소 핸들러 */
  onCancel: () => void;

  /** 확인 핸들러 */
  onConfirm: () => void;
}

/**
 * ChatInput Types
 */

export interface ChatInputProps {
  /** 메시지 전송 핸들러 */
  onSend: (message: string) => void;
  /** 이미지/파일 첨부 핸들러 */
  onAttach: () => void;
  /** 입력 비활성화 (전송 중일 때) */
  disabled?: boolean;
}

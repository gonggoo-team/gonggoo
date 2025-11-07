/**
 * FloatingActionBar Types
 */

export interface FloatingActionBarProps {
  /** 좋아요 버튼 클릭 핸들러 */
  onLikePress?: () => void;
  /** 채팅 버튼 클릭 핸들러 */
  onChatPress?: () => void;
  /** 참여하기 버튼 클릭 핸들러 */
  onJoinPress?: () => void;
  /** 좋아요 활성화 여부 */
  isLiked?: boolean;
  /** 참여하기 버튼 비활성화 여부 */
  joinDisabled?: boolean;
  /** 참여하기 버튼 텍스트 */
  joinButtonText?: string;
}

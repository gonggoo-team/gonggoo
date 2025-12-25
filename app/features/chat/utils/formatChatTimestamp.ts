/**
 * Chat Timestamp Formatter
 *
 * 채팅 타임스탬프를 사용자 친화적인 형식으로 변환합니다.
 *
 * 포맷 규칙:
 * - < 1분: "방금 전"
 * - < 1시간: "N분 전"
 * - 오늘: "N시간 전"
 * - 이번 주: "월요일", "화요일", etc.
 * - 그 이전: "8/30", "12/15" (월/일)
 */

/**
 * 요일 한글 이름
 */
const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * 채팅 타임스탬프를 포맷팅
 * @param timestamp Unix timestamp (milliseconds)
 * @returns 포맷된 타임스탬프 문자열
 */
export function formatChatTimestamp(timestamp: number): string {
  const now = Date.now();
  const messageDate = new Date(timestamp);
  const diffMs = now - timestamp;

  // 음수인 경우 (미래 시간) - 방금 전으로 처리
  if (diffMs < 0) {
    return '방금 전';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // < 1분: "방금 전"
  if (diffMinutes < 1) {
    return '방금 전';
  }

  // < 1시간: "N분 전"
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  // 오늘: "N시간 전"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const messageDateOnly = new Date(messageDate);
  messageDateOnly.setHours(0, 0, 0, 0);

  if (messageDateOnly.getTime() === today.getTime()) {
    return `${diffHours}시간 전`;
  }

  // 이번 주: "월요일", "화요일", etc.
  // 이번 주의 시작 (일요일)을 계산
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());

  if (messageDateOnly.getTime() >= thisWeekStart.getTime()) {
    return DAY_NAMES[messageDate.getDay()];
  }

  // 그 이전: "8/30", "12/15" (월/일)
  const month = messageDate.getMonth() + 1; // 0-indexed이므로 +1
  const day = messageDate.getDate();
  return `${month}/${day}`;
}

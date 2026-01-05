/**
 * Message Timestamp Formatter
 *
 * 메시지 타임스탬프를 "오후 8:10" 형식으로 포맷합니다.
 */

/**
 * 메시지 타임스탬프 포맷
 * @param timestamp Unix timestamp (milliseconds)
 * @returns "오후 8:10" 형식의 시간 문자열
 */
export function formatMessageTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 오전/오후 구분
  const period = hours < 12 ? '오전' : '오후';

  // 12시간 형식으로 변환 (0시는 12시로)
  const displayHours = hours % 12 || 12;

  // 분은 2자리로 패딩
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${period} ${displayHours}:${displayMinutes}`;
}

/**
 * Date Separator Formatter
 *
 * 날짜 구분선용 날짜 포맷 및 날짜 비교 유틸리티입니다.
 */

/**
 * 날짜 구분선 포맷
 * @param timestamp Unix timestamp (milliseconds)
 * @returns "2025. 9. 8." 형식의 날짜 문자열
 */
export function formatDateSeparator(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}. ${month}. ${day}.`;
}

/**
 * 두 타임스탬프가 같은 날인지 확인
 * @param timestamp1 첫 번째 타임스탬프
 * @param timestamp2 두 번째 타임스탬프
 * @returns 같은 날이면 true
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

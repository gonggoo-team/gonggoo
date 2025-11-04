/**
 * CountdownTimer Types
 *
 * 카운트다운 타이머 컴포넌트의 타입 정의입니다.
 */

/**
 * CountdownTimer Props
 */
export interface CountdownTimerProps {
  /**
   * 마감 시간 (Date 객체 또는 ISO 문자열)
   */
  targetTime: Date | string;

  /**
   * 마감 시 콜백 함수 (optional)
   */
  onExpire?: () => void;

  /**
   * 텍스트 색상
   * @default '#181A1A' (Figma 기준)
   */
  textColor?: string;

  /**
   * 아이콘 색상
   * @default '#000000' (Figma 기준)
   */
  iconColor?: string;
}

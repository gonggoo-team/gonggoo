/**
 * Price Formatting Utilities
 *
 * 가격 입력 포맷팅 관련 유틸리티 함수들입니다.
 */

/**
 * 숫자를 천 단위 콤마가 포함된 문자열로 변환
 * @param value - 포맷팅할 문자열 (숫자만 포함)
 * @returns 콤마가 포함된 문자열 (예: "100000" -> "100,000")
 */
export const formatPriceWithCommas = (value: string): string => {
  // 숫자가 아닌 모든 문자 제거
  const numericValue = value.replace(/[^\d]/g, '');

  // 빈 문자열이면 그대로 반환
  if (!numericValue) return '';

  // 천 단위마다 콤마 추가
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 콤마가 포함된 문자열을 숫자만 포함된 문자열로 변환
 * @param value - 콤마가 포함된 문자열 (예: "100,000")
 * @returns 숫자만 포함된 문자열 (예: "100000")
 */
export const parseFormattedPrice = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * 가격 문자열을 숫자로 변환
 * @param value - 가격 문자열 (콤마 포함 가능)
 * @returns 숫자 값
 */
export const parsePriceToNumber = (value: string): number => {
  const numericValue = parseFormattedPrice(value);
  return numericValue ? parseInt(numericValue, 10) : 0;
};

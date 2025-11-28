/**
 * Address Utilities
 *
 * 한국 주소에서 동네 정보를 추출하고 포맷팅하는 유틸리티 함수들
 */

/**
 * 전체 주소에서 동네명(동/읍/면) 추출
 *
 * 예시:
 * - "서울시 강남구 역삼동" => "역삼동"
 * - "서울시 서초구 서초동" => "서초동"
 * - "경기도 성남시 분당구 정자동" => "정자동"
 * - "서울시 강남구" => null
 *
 * @param address - 전체 주소 문자열
 * @returns 동네명 또는 null (동네명을 찾을 수 없는 경우)
 */
export function extractNeighborhood(address: string | undefined): string | null {
  if (!address) return null;

  // 한국 주소 패턴: [동/읍/면]으로 끝나는 한글 단어
  // 예: 역삼동, 서초동, 정자동, 판교읍, 백사면 등
  const dongPattern = /([가-힣]+동|[가-힣]+읍|[가-힣]+면)/;
  const match = address.match(dongPattern);

  return match ? match[1] : null;
}

/**
 * 동네명 표시용 텍스트 반환
 *
 * 동네명이 없는 경우 fallback 텍스트를 반환합니다.
 *
 * @param address - 전체 주소 문자열
 * @param fallback - 동네명이 없을 때 표시할 텍스트 (기본값: "동네 설정")
 * @returns 동네명 또는 fallback 텍스트
 */
export function getNeighborhoodDisplay(
  address: string | undefined,
  fallback: string = '동네 설정'
): string {
  return extractNeighborhood(address) || fallback;
}

/**
 * "OO동에서 모집 중인..." 형태로 서브타이틀 포맷팅
 *
 * 동네명이 있으면 "역삼동에서 모집 중인 팟을 한눈에 확인하세요!" 형태로,
 * 없으면 "우리 동네에서 모집 중인 팟을 한눈에 확인하세요!" 형태로 반환합니다.
 *
 * @param address - 전체 주소 문자열
 * @returns 포맷팅된 서브타이틀 문자열
 */
export function formatNeighborhoodSubtitle(address: string | undefined): string {
  const neighborhood = extractNeighborhood(address);

  if (!neighborhood) {
    return '우리 동네에서 모집 중인 팟을 한눈에 확인하세요!';
  }

  return `${neighborhood}에서 모집 중인 팟을 한눈에 확인하세요!`;
}

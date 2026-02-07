/**
 * Nickname Utilities
 *
 * 한글 닉네임 생성 및 포맷팅 유틸리티 함수들
 */

const ADJECTIVES = [
  '귀여운',
  '행복한',
  '씩씩한',
  '착한',
  '멋진',
  '똑똑한',
  '용감한',
  '친절한',
  '활발한',
  '상냥한',
  '즐거운',
  '신나는',
  '밝은',
  '따뜻한',
  '재미있는',
  '사랑스러운',
  '당당한',
  '든든한',
  '튼튼한',
  '날렵한',
] as const;

const NOUNS = [
  '토끼',
  '곰돌이',
  '사자',
  '강아지',
  '고양이',
  '펭귄',
  '판다',
  '코알라',
  '다람쥐',
  '여우',
  '햄스터',
  '고슴도치',
  '수달',
  '코끼리',
  '기린',
  '알파카',
  '비버',
  '미어캣',
  '돌고래',
  '물개',
] as const;

/**
 * 랜덤 한글 닉네임 생성
 *
 * 형용사 + 명사 조합으로 랜덤 닉네임을 생성합니다.
 * 총 400가지 조합 가능 (20개 형용사 × 20개 명사)
 *
 * 예시:
 * - "귀여운토끼"
 * - "행복한곰돌이"
 * - "용감한사자"
 *
 * @returns 랜덤 생성된 한글 닉네임
 */
export function generateRandomNickname(): string {
  const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${randomAdjective}${randomNoun}`;
}

/**
 * 닉네임 표시용 텍스트 반환
 *
 * 닉네임이 없는 경우 fallback 텍스트를 반환합니다.
 *
 * @param nickname - 사용자 닉네임
 * @param fallback - 닉네임이 없을 때 표시할 텍스트 (기본값: "사용자")
 * @returns 닉네임 또는 fallback 텍스트
 */
export function getNicknameDisplay(
  nickname: string | undefined,
  fallback: string = '사용자'
): string {
  return nickname || fallback;
}

/**
 * "OO님" 형태로 포맷팅
 *
 * 닉네임에 "님"을 붙여 반환합니다.
 * 닉네임이 없는 경우 fallback 텍스트를 사용합니다.
 *
 * @param nickname - 사용자 닉네임
 * @param fallback - 닉네임이 없을 때 사용할 텍스트 (기본값: "사용자")
 * @returns "닉네임님" 형태의 문자열
 */
export function formatNicknameWithSuffix(
  nickname: string | undefined,
  fallback: string = '사용자'
): string {
  const displayName = getNicknameDisplay(nickname, fallback);
  return `${displayName}님`;
}

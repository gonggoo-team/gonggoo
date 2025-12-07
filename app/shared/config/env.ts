/**
 * Environment Variables
 *
 * Expo에서 환경 변수 접근
 * EXPO_PUBLIC_ 접두사가 붙은 변수만 클라이언트에서 접근 가능
 */

export const ENV = {
  KAKAO_REST_API_KEY: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
} as const;

/**
 * 환경 변수 검증
 */
export function validateEnv(): boolean {
  const isDevelopment = __DEV__;

  // 개발 모드에서는 환경 변수가 없어도 Mock 사용 가능
  if (isDevelopment) {
    if (!ENV.KAKAO_REST_API_KEY) {
      console.warn('[ENV] Kakao API key not found. Using mock data in development mode.');
    }
    return true;
  }

  // 프로덕션에서는 필수
  if (!ENV.KAKAO_REST_API_KEY) {
    console.error('[ENV] Missing EXPO_PUBLIC_KAKAO_REST_API_KEY in production');
    return false;
  }

  return true;
}

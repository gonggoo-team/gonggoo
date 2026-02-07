/**
 * Environment Variables
 *
 * Expo에서 환경 변수 접근
 * EXPO_PUBLIC_ 접두사가 붙은 변수만 클라이언트에서 접근 가능
 */

export const ENV = {
  NAVER_MAP_CLIENT_ID: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID,
  NAVER_MAP_CLIENT_SECRET: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_SECRET,
  USE_MOCK_LOCATION: process.env.EXPO_PUBLIC_USE_MOCK_LOCATION === 'true',
} as const;

/**
 * 환경 변수 검증
 */
export function validateEnv(): boolean {
  const isDevelopment = __DEV__;

  // 개발 모드에서는 환경 변수가 없어도 Mock 사용 가능
  if (isDevelopment) {
    if (!ENV.NAVER_MAP_CLIENT_ID || !ENV.NAVER_MAP_CLIENT_SECRET) {
      console.warn('[ENV] Naver Map API keys not found. Using mock data in development mode.');
    }
    return true;
  }

  // 프로덕션에서는 필수
  if (!ENV.NAVER_MAP_CLIENT_ID || !ENV.NAVER_MAP_CLIENT_SECRET) {
    console.error('[ENV] Missing Naver Map API keys in production');
    return false;
  }

  return true;
}

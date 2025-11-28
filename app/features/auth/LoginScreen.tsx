/**
 * Login Screen
 *
 * 로그인 화면 Wrapper
 * PhoneAuthScreen을 사용하여 로그인 기능 제공
 */

import React from 'react';
import { useRouter } from 'expo-router';
import PhoneAuthScreen from './PhoneAuthScreen';

export default function LoginScreen() {
  const router = useRouter();

  /**
   * 로그인 성공 핸들러
   * AuthContext에 이미 저장됨 (usePhoneAuth 내부에서 처리)
   */
  const handleLoginSuccess = () => {
    // 네비게이션 스택 초기화 → 홈으로 이동
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return <PhoneAuthScreen variant="login" onSuccess={handleLoginSuccess} />;
}

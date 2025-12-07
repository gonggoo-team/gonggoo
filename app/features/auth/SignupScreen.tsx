/**
 * Signup Screen
 *
 * 회원가입 화면 Wrapper
 * PhoneAuthScreen을 사용하여 회원가입 기능 제공
 * 인증 성공 후 위치 설정 화면으로 이동
 */

import React from 'react';
import { useRouter } from 'expo-router';
import PhoneAuthScreen from './PhoneAuthScreen';
import * as AuthStorage from '@/app/shared/services/storage/authStorage';

export default function SignupScreen() {
  const router = useRouter();

  /**
   * 회원가입 인증 성공 핸들러
   * 위치 설정 화면으로 이동
   */
  const handleSignupSuccess = async (phone: string) => {
    await AuthStorage.setHasLaunched(true);
    router.push({
      pathname: '/set-location',
      params: { phone, fromSignup: 'true' },
    });
  };

  return <PhoneAuthScreen variant="signup" onSuccess={handleSignupSuccess} />;
}

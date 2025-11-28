/**
 * useLogin Hook
 *
 * 로그인 로직을 관리하는 커스텀 훅
 * - 2단계 로그인: 전화번호 입력 → 인증코드 확인
 * - 인증코드 전송 및 검증
 * - 에러 처리
 */

import { useState, useCallback } from 'react';
import type { LoginStep } from '@/app/shared/types';
import * as AuthService from '@/app/shared/services/authService';
import { isValidPhoneNumber } from '../components/PhoneInput';

export function useLogin() {
  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  /**
   * 전화번호 유효성 검사 및 인증코드 전송
   */
  const sendVerificationCode = useCallback(async () => {
    // 입력 검증
    if (!phone) {
      setError('전화번호를 입력해주세요.');
      return false;
    }

    if (!isValidPhoneNumber(phone)) {
      setError('올바른 전화번호 형식이 아닙니다.');
      return false;
    }

    setError(undefined);
    setIsLoading(true);

    try {
      // 전화번호 등록 여부 확인
      const exists = await AuthService.checkPhoneExists(phone);
      if (!exists) {
        setError('등록되지 않은 전화번호입니다.');
        setIsLoading(false);
        return false;
      }

      // 인증코드 전송
      const result = await AuthService.sendVerificationCode(phone);

      if (result.success) {
        setStep('code');
        setIsTimerRunning(true);
        setCode(''); // 코드 입력 초기화
        setIsLoading(false);
        return true;
      } else {
        setError(result.error || '인증코드 전송에 실패했습니다.');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('인증코드 전송 중 오류가 발생했습니다.');
      setIsLoading(false);
      return false;
    }
  }, [phone]);

  /**
   * 인증코드 검증 및 로그인
   */
  const verifyCodeAndLogin = useCallback(async () => {
    // 입력 검증
    if (!code) {
      setError('인증번호를 입력해주세요.');
      return { success: false };
    }

    if (code.length !== 6) {
      setError('인증번호 6자리를 입력해주세요.');
      return { success: false };
    }

    setError(undefined);
    setIsLoading(true);

    try {
      // 인증코드 검증
      const verifyResult = await AuthService.verifyCode(phone, code);

      if (!verifyResult.success) {
        setError(verifyResult.error || '인증번호가 일치하지 않습니다.');
        setIsLoading(false);
        return { success: false };
      }

      // 로그인
      const loginResult = await AuthService.login(phone);

      if (loginResult.success) {
        setIsTimerRunning(false);
        setIsLoading(false);
        return { success: true, user: loginResult.user };
      } else {
        setError(loginResult.error || '로그인에 실패했습니다.');
        setIsLoading(false);
        return { success: false };
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
      return { success: false };
    }
  }, [phone, code]);

  /**
   * 인증코드 재전송
   */
  const resendCode = useCallback(async () => {
    setCode(''); // 코드 입력 초기화
    setError(undefined);
    setIsTimerRunning(false);

    // 잠시 대기 후 재전송
    setTimeout(async () => {
      await sendVerificationCode();
    }, 100);
  }, [sendVerificationCode]);

  /**
   * 타이머 만료 핸들러
   */
  const handleTimerExpire = useCallback(() => {
    setIsTimerRunning(false);
    setError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
  }, []);

  /**
   * 이전 단계로 돌아가기
   */
  const goBack = useCallback(() => {
    if (step === 'code') {
      setStep('phone');
      setCode('');
      setError(undefined);
      setIsTimerRunning(false);
    }
  }, [step]);

  /**
   * 리셋
   */
  const reset = useCallback(() => {
    setStep('phone');
    setPhone('');
    setCode('');
    setError(undefined);
    setIsLoading(false);
    setIsTimerRunning(false);
  }, []);

  return {
    step,
    phone,
    setPhone,
    code,
    setCode,
    isLoading,
    error,
    setError,
    isTimerRunning,
    sendVerificationCode,
    verifyCodeAndLogin,
    resendCode,
    handleTimerExpire,
    goBack,
    reset,
  };
}

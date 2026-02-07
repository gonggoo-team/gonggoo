/**
 * Phone Auth Screen
 *
 * 로그인/회원가입 공통 화면
 * - Step 1: 전화번호 입력 및 인증코드 전송
 * - Step 2: 인증코드 입력 및 검증
 *
 * Figma: node-id=1055-13866 (로그인), 1055-13898 (회원가입)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme, Button, GNB, LabeledInput, ScreenWrapper } from '@/design-system';
import { TimerDisplay } from './components';
import { usePhoneAuth } from './hooks/usePhoneAuth';

type PhoneAuthVariant = 'login' | 'signup';

interface PhoneAuthScreenProps {
  variant: PhoneAuthVariant;
  onSuccess: (phone: string) => void;
}

/**
 * 전화번호 포맷팅 (010-XXXX-XXXX)
 */
function formatPhoneNumber(text: string): string {
  const numbers = text.replace(/[^0-9]/g, '');
  const trimmed = numbers.slice(0, 11);

  if (trimmed.length <= 3) {
    return trimmed;
  } else if (trimmed.length <= 7) {
    return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
  } else {
    return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 7)}-${trimmed.slice(7)}`;
  }
}

export default function PhoneAuthScreen({
  variant,
  onSuccess,
}: PhoneAuthScreenProps) {
  return (
    <ThemeProvider>
      <PhoneAuthScreenContent variant={variant} onSuccess={onSuccess} />
    </ThemeProvider>
  );
}

function PhoneAuthScreenContent({
  variant,
  onSuccess,
}: PhoneAuthScreenProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets(); // 하단 여백 계산을 위해 사용

  const {
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
    verifyCode,
    resendCode,
    handleTimerExpire,
    goBack,
  } = usePhoneAuth({ variant });

  // Variant별 텍스트 설정
  const texts = {
    login: {
      phoneStepTitle: '휴대폰 번호로 로그인해주세요.',
      codeStepTitle: '인증번호를 입력해 주세요',
      step1Button: '인증번호 전송',
      step2Button: '완료',
    },
    signup: {
      phoneStepTitle: '휴대폰 번호로 가입해주세요.',
      codeStepTitle: '인증번호를 입력해 주세요',
      step1Button: '인증번호 전송',
      step2Button: '완료',
    },
  };

  const currentTexts = texts[variant];
  const [formattedPhone, setFormattedPhone] = useState('');

  // 전화번호 입력 핸들러
  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    const numbers = text.replace(/[^0-9]/g, '').slice(0, 11);

    setFormattedPhone(formatted);
    setPhone(numbers);
    setError(undefined);
  };

  const handleSendCode = async () => {
    await sendVerificationCode();
  };

  const handleVerify = async () => {
    const result = await verifyCode();
    if (result.success) {
      onSuccess(phone);
    }
  };

  const handleGoBack = () => {
    if (step === 'code') {
      goBack();
    } else {
      router.back();
    }
  };

  // 키보드 바깥 터치 시 닫기
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Step 1: 전화번호 입력 화면
  const renderPhoneStep = () => (
    <>
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
            }
          ]}
        >
          {currentTexts.phoneStepTitle}
        </Text>
      </View>

      <View style={styles.inputSection}>
        <LabeledInput
          label="휴대폰 번호"
          variant="phone"
          value={formattedPhone}
          onChangeText={handlePhoneChange}
          placeholder="숫자만 입력해 주세요"
          keyboardType="number-pad"
          maxLength={13}
          autoFocus
          // 자동 완성 관련 Props (전화번호)
          autoComplete="tel" 
          textContentType="telephoneNumber"
          importantForAutofill="yes"
        />
        {error && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.surface.env.accent,
                fontFamily: theme.typography.fontFamily.primary,
              }
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    </>
  );

  // Step 2: 인증코드 입력 화면
  const renderCodeStep = () => (
    <>
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
            }
          ]}
        >
          {currentTexts.codeStepTitle}
        </Text>
      </View>

      <View style={styles.inputSection}>
        <LabeledInput
          label="인증번호"
          variant="verification"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setError(undefined);
          }}
          placeholder="인증번호를 입력해 주세요"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          // ★ OTP 자동 완성을 위한 핵심 설정 ★
          textContentType="oneTimeCode" // iOS: 메시지 도착 시 키보드 위에 코드 노출
          autoComplete="sms-otp"      // Android: SMS 권한 없이 인증번호 제안
          importantForAutofill="yes"
        />
        {error && (
          <Text
            style={[
              styles.errorText,
              {
                color: theme.colors.surface.env.accent,
                fontFamily: theme.typography.fontFamily.primary,
              }
            ]}
          >
            {error}
          </Text>
        )}
      </View>
      <View style={styles.timerContainer}>
        <TimerDisplay
          isRunning={isTimerRunning}
          duration={300}
          onExpire={handleTimerExpire}
        />
      </View>
      <View style={styles.resendSection}>
        <TouchableOpacity onPress={resendCode} style={styles.resendButton}>
          <Text
            style={[
              styles.resendText,
              {
                color: theme.colors.surface.texticon.onnormal.text.black,
                fontFamily: theme.typography.fontFamily.primary,
              }
            ]}
          >
            인증번호 재전송
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.resendHint,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
            }
          ]}
        >
          인증번호가 오지 않나요?
        </Text>
      </View>
      <View style={styles.spacer} />
    </>
  );

  return (
    <ScreenWrapper 
      preset='fullscreen'
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]} 
      // edges={['top', 'left', 'right']} // Bottom은 키보드 처리를 위해 제외하거나 별도 처리
    >
      <GNB leftSection={{ type: 'back', onPress: handleGoBack }} />

      <KeyboardAvoidingView
        // iOS는 padding으로 키보드 높이만큼 밀어올림
        // Android는 기본 동작(adjustResize)을 활용하기 위해 undefined 혹은 height 설정
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        // GNB 높이 + 상단 여백만큼 오프셋이 필요할 수 있음 (상황에 따라 조절 40~60)
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              // ScrollView가 키보드 올라올 때 자동으로 스크롤 되도록 설정
            >
              {step === 'phone' ? renderPhoneStep() : renderCodeStep()}
            </ScrollView>

            {/* 하단 고정 버튼 */}
            {/* insets.bottom을 더해 아이폰 홈바 영역 확보 */}
            <View 
              style={[
                styles.buttonContainer, 
                // { 
                //   paddingBottom: Platform.OS === 'ios' ? 0 : 16, 
                //   marginBottom: Platform.OS === 'ios' ? 0 : 10 
                // }
              ]}
            >
              <Button
                variant="full-primary"
                onPress={step === 'phone' ? handleSendCode : handleVerify}
                disabled={
                  isLoading ||
                  (step === 'phone' ? phone.length !== 11 : code.length !== 6)
                }
              >
                {isLoading
                  ? step === 'phone'
                    ? '전송 중...'
                    : '확인 중...'
                  : currentTexts[step === 'phone' ? 'step1Button' : 'step2Button']}
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>      
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  titleContainer: {
    // paddingVertical: 10,
    // marginTop: 10, 
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  inputSection: {
    marginTop: 24,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 20,
  },
  timerContainer: {
    paddingTop: 10,
    alignItems: 'center',
  },
  resendSection: {
    alignItems: 'center',
    gap: 8,
    // marginTop: 16,
  },
  resendButton: {
    paddingVertical: 8,
    // paddingHorizontal: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    width: 92,
    // height: 30,
    textAlignVertical: 'center',
  },
  resendText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  resendHint: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    // paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'transparent', 
  },
});
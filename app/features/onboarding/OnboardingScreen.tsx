/**
 * Onboarding Screen
 *
 * 앱 소개 및 액션 선택 화면
 * Figma: node-id=1314-14650
 *
 * 디자인:
 * - 흰색 배경
 * - Neighbors 로고 (y=281.75px)
 * - 메인 버튼 그룹: 시작하기, 비회원으로 둘러보기, 로그인 링크 (y=390.25px)
 * - 소셜 로그인 섹션 (y=624px)
 *
 * 액션:
 * - 시작하기: 회원가입 화면으로 이동
 * - 비회원으로 둘러보기: 게스트 모드 활성화 및 홈 진입
 * - 로그인: 로그인 화면으로 이동
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeProvider } from '@/design-system';
import { useAuth } from '@/app/shared/contexts';
import * as AuthStorage from '@/app/shared/services/storage/authStorage';
import {
  ActionButton,
  LoginLinkSection,
  SocialLoginSection,
} from './components';

const { height: screenHeight } = Dimensions.get('window');

export default function OnboardingScreen() {
  return (
    <ThemeProvider>
      <OnboardingScreenContent />
    </ThemeProvider>
  );
}

function OnboardingScreenContent() {
  const router = useRouter();
  const { enableGuestMode } = useAuth();

  /**
   * "시작하기" 버튼 핸들러
   * - hasLaunched 플래그 설정
   * - 회원가입 화면으로 이동
   */
  const handleStart = async () => {
    await AuthStorage.setHasLaunched(true);
    router.push('/signup');
  };

  /**
   * "비회원으로 둘러보기" 버튼 핸들러
   * - 게스트 모드 활성화
   * - hasLaunched 플래그 설정
   * - 홈 화면으로 이동
   */
  const handleBrowse = async () => {
    await AuthStorage.setHasLaunched(true);
    await enableGuestMode();
    router.replace('/(tabs)');
  };

  /**
   * "로그인" 버튼 핸들러
   * - 로그인 화면으로 이동
   */
  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top spacer - proportional to Figma y=281.75px */}
      <View style={styles.topSpacer} />

      {/* Neighbors Brand Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/Neighbors_sm.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Spacer between logo and buttons */}
      <View style={styles.middleSpacer} />

      {/* Main Action Buttons */}
      <View style={styles.buttonsContainer}>
        <ActionButton
          title="시작하기"
          variant="primary"
          onPress={handleStart}
        />
        <ActionButton
          title="비회원으로 둘러보기"
          variant="secondary"
          onPress={handleBrowse}
        />
        <LoginLinkSection onLoginPress={handleLogin} />
      </View>

      {/* Spacer between buttons and social login */}
      <View style={styles.bottomSpacer} />

      {/* Social Login Section */}
      <SocialLoginSection />


      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  // Top spacer: 281.75px from top (proportional to screen height)
  topSpacer: {
    height: screenHeight * (281.75 / 812),
  },
  logoContainer: {
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: 25, // Actual image height (445 ÷ 3 ≈ 148, 76 ÷ 3 ≈ 25)
    aspectRatio: 445 / 76, // Maintain original aspect ratio (≈5.86)
  },
  // Middle spacer: from y=314.75 (281.75+33) to y=390.25
  middleSpacer: {
    height: screenHeight * ((390.25 - 314.75) / 812),
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15, // Figma: 15px gap between buttons
  },
  // Bottom spacer: calculated based on remaining space
  bottomSpacer: {
    // From end of buttons (~390.25 + 54 + 15 + 42 + ~20) to y=624
    height: screenHeight * ((624 - 520) / 812),
  },
});

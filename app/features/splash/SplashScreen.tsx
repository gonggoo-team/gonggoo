/**
 * Splash Screen
 *
 * 앱 최초 실행 시 보여지는 스플래시 화면
 * Figma: node-id=1125-6911
 *
 * 디자인:
 * - 브랜드 그린 배경 (#006242)
 * - Neighbors 로고/일러스트레이션
 * - 설명 텍스트: "필요한 만큼만, 저렴하게\n함께하는 공동구매"
 * - 2.5초 후 자동으로 온보딩 화면으로 이동
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeProvider } from '@/design-system';

export default function SplashScreen() {
  return (
    <ThemeProvider>
      <SplashScreenContent />
    </ThemeProvider>
  );
}

function SplashScreenContent() {
  const router = useRouter();

  /**
   * 2.5초 후 자동으로 온보딩 화면으로 이동
   * replace를 사용하여 뒤로가기 시 스플래시로 돌아가지 않도록 함
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Main content - centered */}
      <View style={styles.content}>
        {/* Neighbors brand logo */}
        <Image
          source={require('@/assets/images/Neighbors.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Description text */}
        <Text style={styles.descriptionText}>
          필요한 만큼만, 저렴하게{'\n'}함께하는 공동구매
        </Text>
      </View>      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006242', // Brand primary green
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 78.44, // Spacing between logo and text per Figma
  },
  logoImage: {
    width: 231, // Actual image width
    aspectRatio: 231 / 39, // Maintain original aspect ratio (≈5.92)
  },
  descriptionText: {
    width: 373,
    fontFamily: 'Pretendard',
    fontWeight: '500', // Medium
    fontSize: 15,
    lineHeight: 17.9,
    letterSpacing: -0.375, // 15 * -0.025
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

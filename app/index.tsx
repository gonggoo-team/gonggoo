/**
 * App Entry Point
 *
 * 인증 상태에 따라 적절한 화면으로 리다이렉트
 * - 최초 실행: onboarding
 * - 로그인됨: (tabs)
 * - 게스트: (tabs)
 * - 미로그인: (tabs) - 일부 기능 제한
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@/app/shared/contexts';
import * as AuthStorage from '@/app/shared/services/storage/authStorage';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const [hasLaunched, setHasLaunched] = React.useState<boolean | null>(null);

  /**
   * 최초 실행 여부 확인
   */
  useEffect(() => {
    const checkFirstLaunch = async () => {
      const launched = await AuthStorage.getHasLaunched();
      setHasLaunched(launched);
    };

    checkFirstLaunch();
  }, []);

  /**
   * 로딩 중
   */
  if (isLoading || hasLaunched === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#006242" />
      </View>
    );
  }

  /**
   * 리다이렉트 로직
   */
  // 최초 실행 → 온보딩 화면
  if (!hasLaunched) {
    return <Redirect href="/onboarding" />;
  }

  // 로그인됨 또는 게스트 → 홈
  if (isAuthenticated || isGuest) {
    return <Redirect href="/(tabs)" />;
  }

  // 기본: 온보딩 화면 (로그인 안 됨 상태)
  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

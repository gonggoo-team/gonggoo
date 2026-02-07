/**
 * Neighborhood Auth Screen
 *
 * GPS 기반 동네 인증 화면
 * Flow: 권한 요청 → GPS 감지 → 역지오코딩 → 확인 → 완료
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { ThemeProvider, useTheme, GNB, ScreenWrapper } from '@/design-system';
import { useAuth } from '@/app/shared/contexts';
import type { LocationData } from '@/app/shared/types/auth.types';
import type { DetectedLocation, GPSError } from './types/location.types';
import { useLocationPermission } from './hooks/useLocationPermission';
import { useGPSLocation } from './hooks/useGPSLocation';
import { PermissionRequestView } from './components/PermissionRequestView';
import { NeighborhoodConfirmationView } from './components/NeighborhoodConfirmationView';
import { LocationErrorView } from './components/LocationErrorView';

type FlowStep =
  | 'permission-request'
  | 'detecting-location'
  | 'confirmation'
  | 'error';

export default function NeighborhoodAuthScreen() {
  return (
    <ThemeProvider>
      <NeighborhoodAuthScreenContent />
    </ThemeProvider>
  );
}

function NeighborhoodAuthScreenContent() {
  const router = useRouter();
  const { push, back } = useThrottledNavigation();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const { signup, updateLocation } = useAuth();

  const [step, setStep] = useState<FlowStep>('permission-request');
  const [isLoading, setIsLoading] = useState(false);

  const {
    status: permissionStatus,
    requestPermission,
    openSettings,
    checkPermission,
  } = useLocationPermission();

  const {
    detectedLocation,
    isDetecting,
    error: gpsError,
    detectLocation,
    retry,
  } = useGPSLocation();

  const isFromSignup = params.fromSignup === 'true';
  const phone = params.phone as string | undefined;

  /**
   * 화면 진입 시 자동 권한 요청
   */
  useEffect(() => {
    const autoRequestPermission = async () => {
      if (step !== 'permission-request') return;

      const currentStatus = await checkPermission();

      if (currentStatus === 'granted') {
        // 이미 권한 허용됨 → GPS 감지로 바로 이동
        setStep('detecting-location');
        const location = await detectLocation();

        if (location) {
          setStep('confirmation');
        } else {
          setStep('error');
        }
      } else if (currentStatus === 'undetermined') {
        // 권한 미결정 → 자동 권한 요청 (300ms 지연으로 UI 렌더링 후 실행)
        setTimeout(async () => {
          const granted = await requestPermission();

          if (granted) {
            // 권한 허용 → GPS 감지 시작
            setStep('detecting-location');
            const location = await detectLocation();

            if (location) {
              setStep('confirmation');
            } else {
              setStep('error');
            }
          } else {
            // 권한 거부 → 에러 화면
            setStep('error');
          }
        }, 300);
      }
      // denied인 경우는 수동 UI 유지
    };

    autoRequestPermission();
  }, [step, checkPermission, detectLocation, requestPermission]);

  /**
   * 뒤로 가기 핸들러
   */
  const handleGoBack = useCallback(() => {
    if (isFromSignup) {
      // 회원가입 중에는 동네 설정 필수
      // TODO: 확인 Alert 표시
      router.replace('/onboarding');
    } else {
      router.back();
    }
  }, [isFromSignup, router]);

  /**
   * 권한 요청 핸들러
   */
  const handlePermissionRequest = useCallback(async () => {
    const granted = await requestPermission();

    if (granted) {
      // 권한 허용 → GPS 감지 시작
      setStep('detecting-location');
      const location = await detectLocation();

      if (location) {
        setStep('confirmation');
      } else {
        setStep('error');
      }
    } else {
      // 권한 거부 → 에러 화면
      setStep('error');
    }
  }, [requestPermission, detectLocation]);

  /**
   * 직접 검색 핸들러
   */
  const handleManualSearch = useCallback(() => {
    push({
      pathname: '/search-location',
      params: {
        fromSignup: params.fromSignup,
        phone: params.phone,
        mode: 'manual',
      },
    });
  }, [push, params]);

  /**
   * 동네 확인 핸들러
   */
  const handleConfirm = useCallback(async () => {
    if (!detectedLocation) return;

    setIsLoading(true);

    try {
      const locationData: LocationData = {
        address: detectedLocation.fullAddress,
        neighborhood: detectedLocation.neighborhood || '',
        city: detectedLocation.city || '',
        district: detectedLocation.district || '',
        latitude: detectedLocation.latitude,
        longitude: detectedLocation.longitude,
        verified: true,
        range: 5,
        gpsVerified: true,
        detectedAt: new Date().toISOString(),
        accuracy: detectedLocation.accuracy,
      };

      if (isFromSignup && phone) {
        // 회원가입 flow
        const result = await signup(phone, locationData);

        if (result.success) {
          // 네비게이션 스택 초기화 → 홈으로 이동
          router.dismissAll();
          router.replace('/(tabs)');
        } else {
          alert(result.error || '회원가입에 실패했습니다.');
        }
      } else {
        // 설정에서 위치 변경 flow
        const success = await updateLocation(locationData);

        if (success) {
          router.back();
        } else {
          alert('위치 설정에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('[NeighborhoodAuth] Confirm error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [detectedLocation, isFromSignup, phone, signup, updateLocation, router]);

  /**
   * 재시도 핸들러
   */
  const handleRetry = useCallback(async () => {
    setStep('detecting-location');
    const location = await retry();

    if (location) {
      setStep('confirmation');
    } else {
      setStep('error');
    }
  }, [retry]);

  /**
   * 설정 열기 핸들러
   */
  const handleOpenSettings = useCallback(async () => {
    await openSettings();
  }, [openSettings]);

  /**
   * 에러 결정
   */
  const currentError: GPSError = gpsError
    ? gpsError
    : permissionStatus === 'denied'
    ? 'PERMISSION_DENIED'
    : 'LOCATION_UNAVAILABLE';

  return (
    <ScreenWrapper
      preset='fullscreen'
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      {/* GNB Header */}
      <GNB leftSection={{ type: 'back', onPress: handleGoBack }} />

      {/* Content */}
      {step === 'permission-request' && (
        <PermissionRequestView
          onRequestPermission={handlePermissionRequest}
          onSkip={handleManualSearch}
        />
      )}

      {step === 'detecting-location' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.colors.surface.brand.primary}
          />
          <Text
            style={[
              styles.loadingText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            {isDetecting ? '위치를 확인하고 있어요...' : '동네를 찾고 있어요...'}
          </Text>
        </View>
      )}

      {step === 'confirmation' && detectedLocation && (
        <NeighborhoodConfirmationView
          location={detectedLocation}
          onConfirm={handleConfirm}
          onSearch={handleManualSearch}
        />
      )}

      {step === 'error' && (
        <LocationErrorView
          error={currentError}
          onRetry={handleRetry}
          onManualSearch={handleManualSearch}
          onOpenSettings={
            currentError === 'PERMISSION_DENIED'
              ? handleOpenSettings
              : undefined
          }
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator
            size="large"
            color={theme.colors.surface.brand.primary}
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

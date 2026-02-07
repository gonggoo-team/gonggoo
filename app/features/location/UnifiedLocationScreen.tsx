/**
 * Unified Location Screen
 *
 * GPS + 지도 + 범위 선택을 통합한 위치 설정 화면
 * - 회원가입 시: 최초 위치 설정
 * - 로그인 후: 위치 재설정
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeProvider, useTheme, GNB, Button, ScreenWrapper } from '@/design-system';
import { MapView } from '@/design-system/components/MapView';
import { useUnifiedLocation } from './hooks/useUnifiedLocation';
import { PermissionRequestView } from './components/PermissionRequestView';
import { LocationDetectingView } from './components/LocationDetectingView';
import { LocationErrorView } from './components/LocationErrorView';
import { NeighborhoodConfirmationView } from './components/NeighborhoodConfirmationView';
import { RangeSelector } from './components/RangeSelector';

export default function UnifiedLocationScreen() {
  return (
    <ThemeProvider>
      <UnifiedLocationScreenContent />
    </ThemeProvider>
  );
}

function UnifiedLocationScreenContent() {
  const { theme } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const router = useRouter();

  const {
    mode,
    step,
    location,
    selectedRange,
    isLoading,
    error,
    detectGPSLocation,
    retryGPS,
    searchAddress,
    switchToManualMode,
    switchToGPSMode,
    selectRange,
    confirmAndSave,
    goBack,
  } = useUnifiedLocation();


  // 지도 높이 계산 (GNB + 하단 버튼 영역 제외)
  const mapHeight = windowHeight - 350;

  // 디버그: selectedRange 변경 감지
  React.useEffect(() => {
    if (__DEV__) console.log('[UnifiedLocationScreen] selectedRange changed:', selectedRange);
  }, [selectedRange]);
  
  /**
   * 범위에 따른 줌 레벨
   * 경계선 전체 + 바깥 여유 공간이 함께 보이도록 설정
   *
   * 계산 로직:
   * - 원의 직경에 1.5-2배 여유 공간 필요
   * - 2km 반경 = 4km 직경 → 6-8km 화면 필요 → zoom 13
   * - 5km 반경 = 10km 직경 → 15-18km 화면 필요 → zoom 11
   * - 10km 반경 = 20km 직경 → 30-35km 화면 필요 → zoom 9.5
   */
  const getZoomLevel = (range: 2 | 5 | 10): number => {
    switch (range) {
      case 2:
        return 13; // 경계선(4km 직경) + 바깥 여유 공간 표시
      case 5:
        return 11; // 경계선(10km 직경) + 바깥 여유 공간 표시
      case 10:
        return 9.5; // 경계선(20km 직경) + 바깥 여유 공간 표시
      default:
        return 11;
    }
  };

  /**
   * 내 위치 버튼 핸들러
   */
  const handleMyLocation = useCallback(async () => {
    await switchToGPSMode();
  }, [switchToGPSMode]);

  /**
   * 동네 변경하기 버튼 핸들러
   *
   * replace를 사용하여 현재 location-setting을 neighborhood-search로 대체
   * 스택: 내 정보 → location-setting → neighborhood-search (X)
   * 스택: 내 정보 → neighborhood-search (O)
   */
  const handleChangeNeighborhood = useCallback(() => {
    router.replace('/neighborhood-search');
  }, [router]);

  return (
    <ScreenWrapper
      preset='fullscreen'
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.normal.bg1 },
      ]}
    >
      {/* GNB Header */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: '동네 설정',
          onPress: goBack,
        }}
      />

      {/* Content */}
      {step === 'permission-request' && (
        <PermissionRequestView
          onRequestPermission={detectGPSLocation}
          onSkip={switchToManualMode}
        />
      )}

      {step === 'detecting' && (
        <LocationDetectingView message="위치를 확인하고 있어요..." />
      )}

      {/* 에러가 발생해도 지도를 표시하고 수동 검색 가능하도록 변경 */}
      {step === 'location-set' && (
        <>
          {/* Map Area */}
          <View style={styles.mapContainer}>
            <MapView
              latitude={location?.latitude || 37.5665}
              longitude={location?.longitude || 126.9780}
              address={location?.address || '서울특별시'}
              height={mapHeight}
              showMarker={!!location}
              rangeCircleRadius={selectedRange}
              showLocationButton={true}
              onLocationButtonPress={handleMyLocation}
              interactive={false}
              zoom={getZoomLevel(selectedRange)}
            />
          </View>

          {/* Range Selection Section - 항상 표시 */}
          <RangeSelector
            selectedRange={selectedRange}
            onRangeSelect={selectRange}
          />

          {/* Bottom Buttons */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <Button
                variant="full-secondary-rounded"
                onPress={handleChangeNeighborhood}
                style={styles.halfButton}
              >
                동네 변경하기
              </Button>
              <View style={styles.buttonGap} />
              <Button
                variant="full-primary-rounded"
                onPress={confirmAndSave}
                disabled={isLoading || !location}
                style={styles.halfButton}
              >
                {isLoading ? '저장 중...' : '적용하기'}
              </Button>
            </View>
          </View>
        </>
      )}

      {/* Loading Overlay */}
      {isLoading && step !== 'detecting' && (
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfButton: {
    flex: 1,
  },
  buttonGap: {
    width: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

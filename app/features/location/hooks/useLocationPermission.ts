/**
 * useLocationPermission Hook
 *
 * 위치 권한 관리 Hook
 */

import { useState, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import type { PermissionStatus } from '../types/location.types';
import {
  requestLocationPermission,
  checkLocationPermission,
} from '../services/locationService';

export function useLocationPermission() {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  /**
   * 권한 요청
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await requestLocationPermission();
      setStatus(response.status);

      if (response.status === 'granted') {
        return true;
      }

      if (!response.canAskAgain) {
        setError('권한이 영구적으로 거부되었습니다. 설정에서 권한을 허용해주세요.');
      }

      return false;
    } catch (err) {
      console.error('[useLocationPermission] Request error:', err);
      setError('권한 요청 중 오류가 발생했습니다.');
      setStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 권한 확인
   */
  const checkPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const currentStatus = await checkLocationPermission();
      setStatus(currentStatus);
      return currentStatus;
    } catch (err) {
      console.error('[useLocationPermission] Check error:', err);
      setStatus('denied');
      return 'denied';
    }
  }, []);

  /**
   * 앱 설정 열기
   */
  const openSettings = useCallback(async (): Promise<void> => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (err) {
      console.error('[useLocationPermission] Failed to open settings:', err);
      setError('설정을 열 수 없습니다.');
    }
  }, []);

  return {
    status,
    isLoading,
    error,
    requestPermission,
    checkPermission,
    openSettings,
  };
}

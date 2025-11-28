/**
 * Location Error View Component
 *
 * 위치 감지 에러 화면
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Button } from '@/design-system';
import type { GPSError } from '../types/location.types';

interface LocationErrorViewProps {
  error: GPSError;
  onRetry: () => void;
  onManualSearch: () => void;
  onOpenSettings?: () => void;
}

const ERROR_MESSAGES: Record<
  GPSError,
  { title: string; description: string }
> = {
  PERMISSION_DENIED: {
    title: '위치 권한이 거부되었어요',
    description: '설정에서 위치 권한을 허용해주세요',
  },
  LOCATION_UNAVAILABLE: {
    title: '위치를 찾을 수 없어요',
    description: 'GPS가 꺼져있거나 실내에 계신가요?',
  },
  TIMEOUT: {
    title: '위치 확인 시간이 초과되었어요',
    description: '다시 시도하거나 직접 검색해주세요',
  },
  UNSUPPORTED_AREA: {
    title: '서비스 지역이 아니에요',
    description: '현재 서울시 일부 지역만 지원합니다',
  },
  GEOCODING_FAILED: {
    title: '주소를 찾을 수 없어요',
    description: '다시 시도하거나 직접 검색해주세요',
  },
  NETWORK_ERROR: {
    title: '네트워크 오류가 발생했어요',
    description: '인터넷 연결을 확인해주세요',
  },
};

export function LocationErrorView({
  error,
  onRetry,
  onManualSearch,
  onOpenSettings,
}: LocationErrorViewProps) {
  const { theme } = useTheme();
  const errorInfo = ERROR_MESSAGES[error];

  const showSettingsButton = error === 'PERMISSION_DENIED' && onOpenSettings;

  return (
    <View style={styles.container}>
      {/* Error Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>

      {/* Error Title */}
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.semiBold,
            },
          ]}
        >
          {errorInfo.title}
        </Text>
      </View>

      {/* Error Description */}
      <View style={styles.descriptionContainer}>
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          {errorInfo.description}
        </Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {showSettingsButton ? (
          <>
            <Button variant="full-primary" onPress={onOpenSettings}>
              설정에서 권한 허용하기
            </Button>
            <TouchableOpacity
              onPress={onManualSearch}
              style={[
                styles.secondaryButton,
                { backgroundColor: '#E1E1E1', borderRadius: 12 },
              ]}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    color: theme.colors.surface.texticon.onnormal.text.midEmp,
                    fontFamily: theme.typography.fontFamily.primary,
                  },
                ]}
              >
                직접 검색하기
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Button variant="full-primary" onPress={onRetry}>
              다시 시도
            </Button>
            <TouchableOpacity
              onPress={onManualSearch}
              style={[
                styles.secondaryButton,
                { backgroundColor: '#E1E1E1', borderRadius: 12 },
              ]}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    color: theme.colors.surface.texticon.onnormal.text.midEmp,
                    fontFamily: theme.typography.fontFamily.primary,
                  },
                ]}
              >
                직접 검색하기
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  icon: {
    fontSize: 64,
  },
  titleContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 16,
    gap: 10,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 22.4,
    letterSpacing: -0.4,
    fontWeight: '600',
  },
});

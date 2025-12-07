/**
 * Permission Request View Component
 *
 * 위치 권한 요청 화면 (Screen 1)
 * Figma: node-id=1056-10141
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Button } from '@/design-system';

interface PermissionRequestViewProps {
  onRequestPermission: () => void;
  onSkip: () => void;
}

export function PermissionRequestView({
  onRequestPermission,
  onSkip,
}: PermissionRequestViewProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Title */}
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
          나의 동네를 선택해주세요
        </Text>
      </View>

      {/* Description */}
      {/* <View style={styles.descriptionContainer}>
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          현재 위치를 기반으로{'\n'}동네를 자동으로 설정해드려요
        </Text>
      </View> */}

      {/* Info Text */}
      {/* <View style={styles.infoContainer}>
        <Text
          style={[
            styles.infoText,
            {
              color: theme.colors.surface.texticon.onnormal.text.lowEmp,
              fontFamily: theme.typography.fontFamily.primary,
            },
          ]}
        >
          위치 권한을 허용하시면{'\n'}주변 공동구매 정보를 볼 수 있어요
        </Text>
      </View> */}

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <Button variant="full-primary" onPress={onRequestPermission}>
          위치 권한 허용하기
        </Button>

        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text
            style={[
              styles.skipText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
                fontFamily: theme.typography.fontFamily.primary,
              },
            ]}
          >
            직접 검색하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    paddingVertical: 10,
    marginTop: 7,
  },
  title: {
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.625, // -2.5% of 25px
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  infoContainer: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.35,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 64,
    gap: 16,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
});

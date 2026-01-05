/**
 * Location Detecting View Component
 *
 * GPS 위치 감지 중 화면
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/design-system';

interface LocationDetectingViewProps {
  message?: string;
}

export function LocationDetectingView({
  message = '위치를 확인하고 있어요...',
}: LocationDetectingViewProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={theme.colors.surface.brand.primary}
      />
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
            fontFamily: theme.typography.fontFamily.primary,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
});

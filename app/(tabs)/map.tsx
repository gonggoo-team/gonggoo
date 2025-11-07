/**
 * Map Screen
 *
 * 지도 탭 화면입니다.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider, useTheme } from '@/design-system';

/**
 * MapScreen Component
 */
export default function MapScreen() {
  return (
    <ThemeProvider>
      <MapScreenContent />
    </ThemeProvider>
  );
}

/**
 * MapScreenContent Component (ThemeProvider 내부)
 */
function MapScreenContent() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <Text style={[styles.text, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
        지도 화면
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

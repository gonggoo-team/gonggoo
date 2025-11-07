/**
 * Chat Screen
 *
 * 채팅 탭 화면입니다.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider, useTheme } from '@/design-system';

/**
 * ChatScreen Component
 */
export default function ChatScreen() {
  return (
    <ThemeProvider>
      <ChatScreenContent />
    </ThemeProvider>
  );
}

/**
 * ChatScreenContent Component (ThemeProvider 내부)
 */
function ChatScreenContent() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <Text style={[styles.text, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
        채팅 화면
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

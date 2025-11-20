import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/design-system';

export default function SettingsScreen() {
  return (
    <ThemeProvider>
      <SettingsScreenContent />
    </ThemeProvider>
  );
}

function SettingsScreenContent() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
      edges={['top']}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
            },
          ]}
        >
          설정
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.sm,
            },
          ]}
        >
          Stub Screen
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {},
  subtitle: {},
});
